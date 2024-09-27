"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const FeatureSpace3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // Create 32 3D Feature Nodes
    const group = new THREE.Group();
    scene.add(group);

    const featureCount = 32;
    const geometry = new THREE.SphereGeometry(0.8, 16, 16);
    
    const colors = ["#00E83F", "#00E83F", "#F5A7E8", "#FF7A00"];

    const nodes: THREE.Mesh[] = [];

    for (let i = 0; i < featureCount; i++) {
      const color = colors[i % colors.length];
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        wireframe: i % 4 === 0,
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      const phi = Math.acos(-1 + (2 * i) / featureCount);
      const theta = Math.sqrt(featureCount * Math.PI) * phi;
      const radius = 22 + (i % 5) * 2;

      mesh.position.x = radius * Math.cos(theta) * Math.sin(phi);
      mesh.position.y = radius * Math.sin(theta) * Math.sin(phi);
      mesh.position.z = radius * Math.cos(phi);

      group.add(mesh);
      nodes.push(mesh);
    }

    // Connect nodes with subtle lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xf4f1ea,
      transparent: true,
      opacity: 0.15,
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < 14) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([
            nodes[i].position,
            nodes[j].position,
          ]);
          const line = new THREE.Line(lineGeo, lineMaterial);
          group.add(line);
        }
      }
    }

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      group.rotation.y = elapsedTime * 0.12;
      group.rotation.x = Math.sin(elapsedTime * 0.08) * 0.15;

      nodes.forEach((node, idx) => {
        node.position.y += Math.sin(elapsedTime * 2 + idx) * 0.04;
      });

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
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-90"
    />
  );
};
