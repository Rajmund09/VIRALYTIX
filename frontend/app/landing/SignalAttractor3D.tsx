"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const SignalAttractor3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 38;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // 3D Torus Knot Geometry representing the Content Signal Field
    const geometry = new THREE.TorusKnotGeometry(8.5, 2.2, 120, 16, 2, 3);

    // Wireframe Mesh with Electric Green (#00E83F)
    const material = new THREE.MeshBasicMaterial({
      color: 0x00e83f,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Particle Cloud overlay on vertices for glowing vertex points
    const pointsMat = new THREE.PointsMaterial({
      color: 0x111111,
      size: 0.9,
      transparent: true,
      opacity: 0.85,
    });
    const points = new THREE.Points(geometry, pointsMat);
    scene.add(points);

    // Render loop with IntersectionObserver
    let animId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      mesh.rotation.x = elapsedTime * 0.25;
      mesh.rotation.y = elapsedTime * 0.4;
      points.rotation.x = elapsedTime * 0.25;
      points.rotation.y = elapsedTime * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      pointsMat.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-80 lg:h-[450px] relative flex items-center justify-center pointer-events-none"
    />
  );
};
