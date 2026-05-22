<template>
  <canvas v-if="supported" ref="canvas" class="particle-canvas" />
  <div v-else class="particle-fallback" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";

const canvas = ref<HTMLCanvasElement | null>(null);
const supported = ref(true);
let renderer: THREE.WebGLRenderer | null = null;
let animId: number;

onMounted(() => {
  if (!canvas.value) return;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas.value, alpha: true, antialias: false });
  } catch {
    supported.value = false;
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 60;

  const count = 600;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i]     = (Math.random() - 0.5) * 200;
    positions[i + 1] = (Math.random() - 0.5) * 200;
    positions[i + 2] = (Math.random() - 0.5) * 100;
    const r = Math.random();
    if (r < 0.5) { colors[i] = 0; colors[i+1] = 0.83; colors[i+2] = 1; }
    else         { colors[i] = 0.83; colors[i+1] = 0.69; colors[i+2] = 0.22; }
  }

  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({ size: 0.5, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer?.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  let t = 0;
  const animate = () => {
    animId = requestAnimationFrame(animate);
    t += 0.0003;
    particles.rotation.y = t;
    particles.rotation.x = t * 0.4;
    renderer?.render(scene, camera);
  };
  animate();

  onUnmounted(() => {
    cancelAnimationFrame(animId);
    window.removeEventListener("resize", onResize);
    renderer?.dispose();
    geo.dispose();
    mat.dispose();
  });
});
</script>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
}
.particle-fallback {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(ellipse at 20% 50%, rgba(0,212,255,0.04) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(212,175,55,0.04) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, rgba(0,255,179,0.03) 0%, transparent 50%);
}
</style>
