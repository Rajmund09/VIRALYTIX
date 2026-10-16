'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface PaperUnfoldCardProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  sceneHeight?: number;
  duration?: number;
  paperColor?: string;
  className?: string;
}

export const PaperUnfoldCard: React.FC<PaperUnfoldCardProps> = ({
  src = '/cards/shap-collage-hd.webp',
  alt = 'SHAP Force Vector Balancer Neural Telemetry Card',
  width = 1024,
  height = 576,
  sceneHeight = 580,
  duration = 1.3,
  paperColor = '#F7F3EC',
  className = '',
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const animationRef = useRef<number>(0);
  const startAnimationRef = useRef<(() => void) | null>(null);

  // IntersectionObserver directly on the card so it triggers at the perfect moment
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          setHasTriggered(true);
          if (startAnimationRef.current) {
            startAnimationRef.current();
          }
          observer.disconnect();
        }
      },
      {
        threshold: [0.1, 0.25, 0.5],
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const rootEl = rootRef.current;
    const canvasEl = canvasRef.current;
    if (!rootEl || !canvasEl) return;
    const root: HTMLDivElement = rootEl;
    const canvas: HTMLCanvasElement = canvasEl;

    let disposed = false;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 10000);
    scene.add(camera);

    // High-clarity bright neutral lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(0, 300, 800);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(0, -300, 700);
    scene.add(fillLight);

    const sheetGroup = new THREE.Group();
    scene.add(sheetGroup);

    // Load pre-baked 3D geometry + clean Card texture concurrently
    Promise.all([
      fetch('/cards/paper-baked.json').then((res) => res.json()),
      new Promise<THREE.Texture>((resolve, reject) => {
        new THREE.TextureLoader().load(
          src,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
            resolve(tex);
          },
          undefined,
          reject
        );
      }),
    ])
      .then(([baked, texture]) => {
        if (disposed) {
          texture.dispose();
          return;
        }

        const { indices, uvs, samples } = baked;
        const totalFrames = samples.length;
        const vertexCount = indices.length;

        // Render buffer arrays
        const renderPositions = new Float32Array(vertexCount * 3);
        const renderUvs = new Float32Array(vertexCount * 2);

        for (let i = 0; i < indices.length; i++) {
          renderUvs[i * 2] = uvs[indices[i] * 2];
          renderUvs[i * 2 + 1] = uvs[indices[i] * 2 + 1];
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(renderPositions, 3).setUsage(THREE.DynamicDrawUsage)
        );
        geometry.setAttribute('uv', new THREE.BufferAttribute(renderUvs, 2));

        // Normal card material without artificial reflections or glossy glare
        const frontMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 1.0,
          metalness: 0.0,
          side: THREE.FrontSide,
          transparent: true,
          alphaTest: 0.01,
        });

        const backMaterial = new THREE.MeshStandardMaterial({
          color: paperColor,
          roughness: 1.0,
          metalness: 0,
          side: THREE.BackSide,
        });

        const frontMesh = new THREE.Mesh(geometry, frontMaterial);
        const backMesh = new THREE.Mesh(geometry, backMaterial);

        sheetGroup.add(frontMesh, backMesh);

        function resize() {
          if (!root) return;
          const rect = root.getBoundingClientRect();
          const vpWidth = Math.max(1, rect.width);
          const vpHeight = Math.max(1, rect.height);

          const scale =
            width *
            Math.min(
              1,
              Math.max(1, vpWidth - 32) / width,
              Math.max(1, vpHeight - 32) / height
            );

          sheetGroup.scale.setScalar(scale);

          camera.aspect = vpWidth / vpHeight;
          camera.position.z =
            vpHeight / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
          camera.updateProjectionMatrix();

          const maxDpr = typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 2;
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
          renderer.setSize(vpWidth, vpHeight, false);
        }

        resize();
        window.addEventListener('resize', resize);
        setIsReady(true);

        function deformMesh(progress: number) {
          const fold = Math.min(1, Math.max(0, progress));
          const frameIndex = fold * (totalFrames - 1);
          const lower = Math.floor(frameIndex);
          const upper = Math.min(lower + 1, totalFrames - 1);
          const mix = frameIndex - lower;

          const from = samples[lower];
          const to = samples[upper];

          const posAttr = geometry.attributes.position;
          const posArray = posAttr.array as Float32Array;

          for (let i = 0; i < indices.length; i++) {
            const idx = indices[i] * 3;
            posArray[i * 3] = from[idx] + (to[idx] - from[idx]) * mix;
            posArray[i * 3 + 1] = from[idx + 1] + (to[idx + 1] - from[idx + 1]) * mix;
            posArray[i * 3 + 2] = from[idx + 2] + (to[idx + 2] - from[idx + 2]) * mix;
          }

          posAttr.needsUpdate = true;
          geometry.computeVertexNormals();
        }

        // Render initial crumpled paper ball
        deformMesh(1.0);
        sheetGroup.rotation.set(0.14, -0.22, -0.05);
        renderer.render(scene, camera);

        let startTime: number | null = null;
        let isAnimating = false;

        function animate(timestamp: number) {
          if (disposed) return;

          if (!startTime) startTime = timestamp;
          const elapsed = (timestamp - startTime) / 1000;
          const rawT = Math.min(1, elapsed / duration);

          // Smooth natural cubic ease-out
          const easeOut = 1 - Math.pow(1 - rawT, 3);
          const progress = 1 - easeOut; // 1.0 down to 0.0

          deformMesh(progress);

          sheetGroup.rotation.x = 0.14 * progress;
          sheetGroup.rotation.y = -0.22 * progress;
          sheetGroup.rotation.z = -0.05 * progress;

          renderer.render(scene, camera);

          if (rawT < 1) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            deformMesh(0);
            sheetGroup.rotation.set(0, 0, 0);
            renderer.render(scene, camera);
            entranceFinished = true;
            lastDeformedProgress = 0;
            canvas.style.cursor = 'grab';
          }
        }

        // Interactive Click-and-Hold Crumple & Drag Mechanic (Zero-Lag 1:1 Tracking)
        let entranceFinished = false;
        let currentCrumple = 0;
        let targetCrumple = 0;
        let lastDeformedProgress = -1;
        let currentPosX = 0;
        let currentPosY = 0;
        let targetPosX = 0;
        let targetPosY = 0;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let isHeld = false;
        let interactiveAnimId = 0;
        let lastInteractiveTime = 0;

        function runInteractive(time: number) {
          if (disposed) return;
          if (!lastInteractiveTime) lastInteractiveTime = time;
          const dt = Math.min(0.05, (time - lastInteractiveTime) / 1000);
          lastInteractiveTime = time;

          // Responsive tactile crunch when held (speed 8.5), smooth natural unroll on release (speed 6.0)
          const crumpleSpeed = isHeld ? 8.5 : 6.0;
          const diffCrumple = targetCrumple - currentCrumple;

          if (Math.abs(diffCrumple) > 0.001) {
            currentCrumple += diffCrumple * Math.min(1, dt * crumpleSpeed);
          } else {
            currentCrumple = targetCrumple;
          }

          // ZERO-LAG tracking while held: follow cursor 1:1 instantly without rubber-banding
          if (isHeld) {
            currentPosX = targetPosX;
            currentPosY = targetPosY;
          } else {
            // Smooth natural glide back to center when released
            const returnSpeed = 8.5;
            const diffX = 0 - currentPosX;
            const diffY = 0 - currentPosY;

            if (Math.abs(diffX) > 0.2) {
              currentPosX += diffX * Math.min(1, dt * returnSpeed);
            } else {
              currentPosX = 0;
            }

            if (Math.abs(diffY) > 0.2) {
              currentPosY += diffY * Math.min(1, dt * returnSpeed);
            } else {
              currentPosY = 0;
            }
          }

          // Only run expensive CPU mesh vertex & normal re-computation when the fold/crumple progress actually changes
          if (Math.abs(currentCrumple - lastDeformedProgress) > 0.001) {
            deformMesh(currentCrumple);
            lastDeformedProgress = currentCrumple;
          }

          // Direct GPU matrix transform for pure 60/120fps motion without dropped frames
          sheetGroup.position.set(currentPosX, currentPosY, 0);

          // Subtle physical 3D tilt based on drag position
          const dragTiltX = Math.max(-0.25, Math.min(0.25, -currentPosY * 0.0006));
          const dragTiltY = Math.max(-0.25, Math.min(0.25, currentPosX * 0.0006));
          sheetGroup.rotation.x = 0.14 * currentCrumple + dragTiltX;
          sheetGroup.rotation.y = -0.22 * currentCrumple + dragTiltY;
          sheetGroup.rotation.z = -0.05 * currentCrumple;

          renderer.render(scene, camera);

          const isMoving = isHeld || Math.abs(currentPosX) > 0.2 || Math.abs(currentPosY) > 0.2;
          const isCrumpling = Math.abs(currentCrumple - targetCrumple) > 0.001;

          if (isMoving || isCrumpling) {
            interactiveAnimId = requestAnimationFrame(runInteractive);
          } else {
            interactiveAnimId = 0;
          }
        }

        function triggerInteractive() {
          if (!entranceFinished || disposed) return;
          lastInteractiveTime = 0;
          if (!interactiveAnimId) {
            interactiveAnimId = requestAnimationFrame(runInteractive);
          }
        }

        const handlePointerDown = (e: PointerEvent) => {
          if (!entranceFinished) return;
          if (e.button !== 0 && e.pointerType === 'mouse') return;
          isHeld = true;
          targetCrumple = 0.95;

          const rect = canvas.getBoundingClientRect();
          const worldX = e.clientX - (rect.left + rect.width / 2);
          const worldY = -(e.clientY - (rect.top + rect.height / 2));
          dragOffsetX = worldX - currentPosX;
          dragOffsetY = worldY - currentPosY;

          try {
            canvas.setPointerCapture(e.pointerId);
          } catch {}
          canvas.style.cursor = 'grabbing';
          triggerInteractive();
        };

        const handlePointerMove = (e: PointerEvent) => {
          if (!isHeld || !entranceFinished) return;
          const rect = canvas.getBoundingClientRect();
          const worldX = e.clientX - (rect.left + rect.width / 2);
          const worldY = -(e.clientY - (rect.top + rect.height / 2));

          const maxDistX = rect.width * 0.45;
          const maxDistY = rect.height * 0.45;
          targetPosX = Math.max(-maxDistX, Math.min(maxDistX, worldX - dragOffsetX));
          targetPosY = Math.max(-maxDistY, Math.min(maxDistY, worldY - dragOffsetY));

          // Immediate sync for instant zero-latency drag
          currentPosX = targetPosX;
          currentPosY = targetPosY;

          triggerInteractive();
        };

        const handlePointerUp = (e: PointerEvent) => {
          if (!isHeld) return;
          isHeld = false;
          targetCrumple = 0.0; // Unfold back to flat
          targetPosX = 0.0;     // Return to center
          targetPosY = 0.0;     // Return to center

          try {
            if (canvas.hasPointerCapture(e.pointerId)) {
              canvas.releasePointerCapture(e.pointerId);
            }
          } catch {}
          canvas.style.cursor = 'grab';
          triggerInteractive();
        };

        const handlePointerCancel = (e: PointerEvent) => {
          if (!isHeld) return;
          isHeld = false;
          targetCrumple = 0.0;
          targetPosX = 0.0;
          targetPosY = 0.0;

          try {
            if (canvas.hasPointerCapture(e.pointerId)) {
              canvas.releasePointerCapture(e.pointerId);
            }
          } catch {}
          canvas.style.cursor = 'grab';
          triggerInteractive();
        };

        canvas.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerCancel);

        const startUnfold = () => {
          if (isAnimating || disposed) return;
          isAnimating = true;

          setTimeout(() => {
            if (!disposed) {
              animationRef.current = requestAnimationFrame(animate);
            }
          }, 240);
        };

        startAnimationRef.current = startUnfold;

        if (hasTriggered) {
          startUnfold();
        }

        return () => {
          disposed = true;
          cancelAnimationFrame(animationRef.current);
          cancelAnimationFrame(interactiveAnimId);
          canvas.removeEventListener('pointerdown', handlePointerDown);
          window.removeEventListener('pointermove', handlePointerMove);
          window.removeEventListener('pointerup', handlePointerUp);
          window.removeEventListener('pointercancel', handlePointerCancel);
          window.removeEventListener('resize', resize);
          geometry.dispose();
          frontMaterial.dispose();
          backMaterial.dispose();
          texture.dispose();
          renderer.dispose();
        };
      })
      .catch((err) => {
        console.error('Failed to load paper unfold mesh:', err);
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(animationRef.current);
      if (renderer) renderer.dispose();
    };
  }, [src, width, height, duration, paperColor, hasTriggered]);

  return (
    <div
      ref={rootRef}
      className={`relative w-full max-w-[1024px] mx-auto flex items-center justify-center select-none ${className}`}
      style={{
        height: typeof sceneHeight === 'number' ? `clamp(280px, 56vw, ${sceneHeight}px)` : sceneHeight,
        maxHeight: '80vh',
      }}
    >
      {/* Clean canvas displaying normal card with zero extra filters or colored blur auras */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block relative z-10"
        style={{
          visibility: isReady ? 'visible' : 'hidden',
          touchAction: 'none',
        }}
      />

      {/* Fallback loader */}
      {!isReady && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#008A20] border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
};

export default PaperUnfoldCard;
