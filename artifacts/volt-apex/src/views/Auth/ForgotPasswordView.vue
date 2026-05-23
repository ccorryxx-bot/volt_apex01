<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden" style="background: var(--volt-black);">
    <ParticleField class="absolute inset-0 z-0" />
    <div class="absolute inset-0 z-0" style="background: radial-gradient(ellipse at center, rgba(13,27,62,0.8) 0%, rgba(5,8,17,0.95) 70%);"></div>
    <div class="relative z-10 w-full max-w-sm anim-fade-in-up">
      <div class="text-center mb-6">
        <div class="logo-glass inline-block px-6 py-3 mb-2 cursor-pointer" @click="$router.push('/login')">
          <span class="font-heading text-2xl font-black text-gold-gradient tracking-widest">VOLT APEX</span>
        </div>
      </div>

      <div class="glass-card p-6 hud-bracket relative">
        <h2 class="font-heading text-center mb-2 text-base tracking-wider" style="color: var(--volt-electric);">စကားဝှက် ပြန်လည်သတ်မှတ်မည်</h2>
        <p class="text-xs text-center mb-5" style="color: var(--volt-gray);">မှတ်ပုံတင်ထားသော ဖုန်းနံပါတ် ထည့်ပါ</p>

        <div v-if="!sent">
          <div class="mb-4">
            <label class="block text-xs mb-1.5 font-medium" style="color: var(--volt-gray);">ဖုန်းနံပါတ်</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style="color: var(--volt-electric);">+95</span>
              <input v-model="phone" type="tel" placeholder="9xxxxxxxxx" inputmode="tel"
                class="volt-input w-full h-12 pl-12 pr-4 rounded-xl text-sm outline-none" />
            </div>
          </div>
          <button class="btn-primary" @click="handleReset">
            {{ loading ? 'ပို့နေသည်...' : 'OTP ပို့မည်' }}
          </button>
        </div>

        <div v-else class="text-center py-4">
          <div class="text-4xl mb-3">✉️</div>
          <p class="text-sm mb-4" style="color: var(--volt-emerald);">OTP ပေးပို့မှု အောင်မြင်ပါသည်</p>
          <p class="text-xs mb-4" style="color: var(--volt-gray);">ဤ platform သည် phone OTP ကို Admin မှတဆင့် စီစဉ်ပေးပါသည်</p>
        </div>

        <div class="mt-4 text-center">
          <button class="text-sm" style="color: var(--volt-gray);" @click="$router.push('/login')">
            ← ဝင်ရောက်မည် သို့ ပြန်သွားမည်
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ParticleField from "@/components/three/ParticleField.vue";

const phone = ref("");
const loading = ref(false);
const sent = ref(false);

async function handleReset() {
  if (!phone.value) return;
  loading.value = true;
  await new Promise(r => setTimeout(r, 1000));
  loading.value = false;
  sent.value = true;
}
</script>

<style scoped>
.volt-input {
  background: rgba(5, 8, 17, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.2);
  color: var(--volt-white);
}
.volt-input:focus {
  border-color: rgba(0, 212, 255, 0.5);
  outline: none;
}
.logo-glass {
  background: rgba(13, 27, 62, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
}
</style>
