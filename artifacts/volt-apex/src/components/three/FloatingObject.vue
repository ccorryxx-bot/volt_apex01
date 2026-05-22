<template>
  <canvas v-if="supported" ref="canvas" class="float-canvas" />
  <div v-else class="float-fallback">
    <div class="float-orb anim-float-y"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";

const canvas = ref<HTMLCanvasElement | null>(null);
const supported = ref(true);
let animId: number;

onMounted(() => {
  if (!canvas.value) return;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas.value, alpha: true, antialias: true });
  } catch {
    supported.value = false;
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.value.offsetWidth || 200, canvas.value.offsetHeight || 200);

  const scene = new THREE.Scene();
  const w = canvas.value.offsetWidth || 200;
  const h = canvas.value.offsetHeight || 200;
  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
  camera.position.z = 4;

  const geo = new THREE.OctahedronGeometry(1.2, 0);
  const mat = new THREE.MeshBasicMaterial({ color: 0xD4AF37, wireframe: true, transparent: true, opacity: 0.85 });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  let t = 0;
  const animate = () => {
    animId = requestAnimationFrame(animate);
    t += 0.005;
    mesh.rotation.x += 0.006;
    mesh.rotation.y += 0.008;
    mesh.position.y = Math.sin(t) * 0.15;
    renderer.render(scene, camera);
  };
  animate();

  onUnmounted(() => {
    cancelAnimationFrame(animId);
    renderer.dispose();
    geo.dispose();
    mat.dispose();
  });
});
</script>

<style scoped>
.float-canvas { width: 100%; height: 100%; display: block; }
.float-fallback {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
}
.float-orb {
  width: 80px; height: 80px; border-radius: 50%;
  background: radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%);
  border: 1.5px solid rgba(212,175,55,0.5);
  box-shadow: 0 0 30px rgba(212,175,55,0.2);
}
</style>
