<template>
  <div class="min-h-screen relative flex flex-col items-center justify-center px-4 overflow-hidden" style="background: var(--volt-black);">
    <ParticleField class="absolute inset-0 z-0" />

    <div class="relative z-10 w-full max-w-sm" ref="containerRef">
      <div class="text-center mb-8" ref="logoRef">
        <div class="logo-glass inline-block px-6 py-3 mb-3 relative cursor-pointer" @mouseenter="logoHover = true" @mouseleave="logoHover = false">
          <span class="font-heading text-3xl font-black text-gold-gradient tracking-widest">VOLT APEX</span>
          <div class="logo-ripple" :class="{ active: logoHover }"></div>
        </div>
        <p class="text-sm" style="color: var(--volt-gray);">Myanmar Premier Gaming Platform</p>
      </div>

      <div class="glass-card p-6 hud-bracket relative" ref="cardRef">
        <div class="scanning-line"></div>

        <h2 class="font-heading text-center mb-6 text-base tracking-wider" style="color: var(--volt-electric);">
          အကောင့်ဝင်ရောက်မည်
        </h2>

        <form @submit.prevent="handleLogin" novalidate>
          <div class="mb-4">
            <label class="block text-xs mb-1.5 font-medium" style="color: var(--volt-gray);">ဖုန်းနံပါတ်</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style="color: var(--volt-electric);">+95</span>
              <input
                v-model="phone"
                type="tel"
                placeholder="9xxxxxxxxx"
                inputmode="tel"
                class="w-full h-12 pl-12 pr-4 rounded-xl text-sm outline-none transition-all"
                style="background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.2); color: var(--volt-white);"
                :style="phoneError ? 'border-color: var(--volt-red);' : ''"
                @focus="phoneError = ''"
              />
            </div>
            <p v-if="phoneError" class="text-xs mt-1" style="color: var(--volt-red);">{{ phoneError }}</p>
          </div>

          <div class="mb-6">
            <label class="block text-xs mb-1.5 font-medium" style="color: var(--volt-gray);">စကားဝှက်</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full h-12 pl-4 pr-11 rounded-xl text-sm outline-none transition-all"
                style="background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.2); color: var(--volt-white);"
                :style="passwordError ? 'border-color: var(--volt-red);' : ''"
                @focus="passwordError = ''"
              />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-sm" style="color: var(--volt-gray);" @click="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <p v-if="passwordError" class="text-xs mt-1" style="color: var(--volt-red);">{{ passwordError }}</p>
          </div>

          <div v-if="loginError" class="mb-4 p-3 rounded-xl text-sm text-center" style="background: rgba(255,61,90,0.1); border: 1px solid rgba(255,61,90,0.3); color: var(--volt-red);" :class="{ 'anim-shake': shakeError }">
            {{ loginError }}
          </div>

          <button type="submit" class="btn-primary anim-glow-pulse mb-3 flex items-center justify-center gap-2" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span>{{ loading ? 'စစ်ဆေးနေသည်...' : 'ဝင်ရောက်မည်' }}</span>
          </button>
        </form>

        <div class="text-center mt-2 mb-4">
          <button class="text-sm" style="color: var(--volt-gray);" @click="$router.push('/forgot-password')">
            စကားဝှက် မေ့သွားပါသလား?
          </button>
        </div>

        <div class="border-t pt-4" style="border-color: rgba(0,212,255,0.1);">
          <button class="w-full text-sm py-2 rounded-xl transition-all" style="color: var(--volt-gray);" @click="$router.push('/register')">
            အကောင့်မရှိသေး? <span style="color: var(--volt-electric);">မှတ်ပုံတင်မည်</span>
          </button>
        </div>
      </div>

      <div class="mt-4 text-center">
        <span class="text-xs" style="color: var(--volt-gray);">🔒 လုံခြုံသောချိတ်ဆက်မှု · <span style="color: var(--volt-emerald);">✓ အကောင့်ဖွင့်ခ အခမဲ့</span></span>
      </div>

      <div class="mt-3 text-center">
        <span class="pulse-online mr-1.5"></span>
        <span class="font-number text-sm" style="color: var(--volt-gray);">ကစားသူ <span style="color: var(--volt-emerald);">{{ onlineCount.toLocaleString() }}</span> ဦး online ရှိနေသည်</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import ParticleField from "@/components/three/ParticleField.vue";
import gsap from "gsap";

const router = useRouter();
const auth = useAuthStore();
const ui = useUiStore();

const phone = ref("");
const password = ref("");
const showPassword = ref(false);
const phoneError = ref("");
const passwordError = ref("");
const loginError = ref("");
const loading = ref(false);
const logoHover = ref(false);
const shakeError = ref(false);
const onlineCount = ref(1243);
const logoRef = ref<HTMLElement | null>(null);
const cardRef = ref<HTMLElement | null>(null);

onMounted(() => {
  // GSAP entrance animations
  const tl = gsap.timeline();
  if (logoRef.value) tl.from(logoRef.value, { opacity: 0, y: -24, duration: 0.55, ease: "power3.out" });
  if (cardRef.value) tl.from(cardRef.value, { opacity: 0, y: 28, duration: 0.45, ease: "power2.out" }, "-=0.25");
  setInterval(() => {
    onlineCount.value = 1200 + Math.floor(Math.random() * 200);
  }, 5000);
});

function validate() {
  let valid = true;
  if (!phone.value || phone.value.replace(/\D/g, "").length < 7) {
    phoneError.value = "ဖုန်းနံပါတ် မှန်ကန်စွာ ထည့်ပါ";
    valid = false;
  }
  if (!password.value || password.value.length < 6) {
    passwordError.value = "စကားဝှက် အနည်းဆုံး ၆ လုံး ရှိရမည်";
    valid = false;
  }
  return valid;
}

async function handleLogin() {
  loginError.value = "";
  if (!validate()) return;
  loading.value = true;
  const result = await auth.login(phone.value, password.value);
  loading.value = false;
  if (result.success) {
    ui.toast.success("ဝင်ရောက်မှု အောင်မြင်ပါသည်!");
    gsap.to(cardRef.value, { opacity: 0, y: -16, duration: 0.25, onComplete: () => router.push("/dashboard") });
  } else {
    loginError.value = result.error || "ဖုန်းနံပါတ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေသည်";
    shakeError.value = true;
    if (cardRef.value) gsap.fromTo(cardRef.value, { x: -7 }, { x: 0, duration: 0.4, ease: "elastic.out(1,0.3)" });
    setTimeout(() => (shakeError.value = false), 500);
  }
}
</script>

<style scoped>
.logo-glass {
  background: rgba(13, 27, 62, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.3s ease;
}
.logo-glass:hover {
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
}
.logo-ripple {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.logo-ripple.active { opacity: 1; }
.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(5,8,17,0.3);
  border-top-color: #050811;
  border-radius: 50%;
  animation: rotate-ring 0.7s linear infinite;
}
input:focus {
  border-color: rgba(0, 212, 255, 0.5) !important;
  box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.1);
}
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
