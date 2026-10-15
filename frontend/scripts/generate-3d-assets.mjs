import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '../public/assets/3d');

if (!globalThis.FileReader) {
  class NodeFileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      });
    }
  }
  globalThis.FileReader = NodeFileReader;
}

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function exportMesh(mesh, filename) {
  const exporter = new GLTFExporter();
  const scene = new THREE.Scene();
  scene.add(mesh);

  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (gltf) => {
        const buffer = Buffer.from(gltf);
        fs.writeFileSync(path.join(outDir, filename), buffer);
        console.log(`Generated ${filename} (${buffer.length} bytes)`);
        resolve();
      },
      (error) => reject(error),
      { binary: true }
    );
  });
}

async function main() {
  // 1. Lens (Cylinder)
  const lensGeo = new THREE.CylinderGeometry(2, 2, 0.4, 64);
  const lensMesh = new THREE.Mesh(lensGeo, new THREE.MeshStandardMaterial());
  lensMesh.name = 'Cylinder';
  await exportMesh(lensMesh, 'lens.glb');

  // 2. Bar (Cube)
  const barGeo = new THREE.BoxGeometry(4, 0.7, 0.3);
  const barMesh = new THREE.Mesh(barGeo, new THREE.MeshStandardMaterial());
  barMesh.name = 'Cube';
  await exportMesh(barMesh, 'bar.glb');

  // 3. Cube (Cube)
  const cubeGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
  const cubeMesh = new THREE.Mesh(cubeGeo, new THREE.MeshStandardMaterial());
  cubeMesh.name = 'Cube';
  await exportMesh(cubeMesh, 'cube.glb');

  console.log('All 3D assets generated successfully.');
}

main().catch(console.error);
