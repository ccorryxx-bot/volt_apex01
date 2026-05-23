<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <ParticleField class="fixed inset-0 z-0 pointer-events-none" />

    <!-- Top Nav -->
    <nav class="relative z-20 flex items-center justify-between px-4 py-3 border-b" style="border-color: rgba(0,212,255,0.1); background: rgba(5,8,17,0.85); backdrop-filter: blur(16px);">
      <div class="flex items-center gap-2">
        <span class="font-heading text-xl font-black text-gold-gradient tracking-widest">VOLT APEX</span>
        <span class="text-xs px-2 py-0.5 rounded-full font-bold" style="background: rgba(0,212,255,0.1); color: var(--volt-electric); border: 1px solid rgba(0,212,255,0.2);">BETA</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs hidden sm:block" style="color: var(--volt-gray);">
          <span class="pulse-online mr-1"></span>{{ onlineCount.toLocaleString() }} Online
        </span>
        <button class="btn-secondary h-9 px-4 text-sm" @click="$router.push('/register')">မှတ်ပုံတင်</button>
        <button class="btn-primary h-9 px-5 text-sm anim-glow-pulse" @click="$router.push('/login')">ဝင်ရောက်မည်</button>
      </div>
    </nav>

    <!-- Announcement Ticker -->
    <div class="relative z-10 overflow-hidden py-1.5 px-4" style="background: rgba(0,212,255,0.05); border-bottom: 1px solid rgba(0,212,255,0.1);">
      <div class="flex gap-8 text-xs overflow-x-auto no-scrollbar" style="color: var(--volt-gray);">
        <span>📢 VOLT APEX မှ ကြိုဆိုသည်! 🎉 Welcome Bonus 100% ရယူပါ</span>
        <span>💬 Customer Service 24/7 ဝန်ဆောင်မှု ပေးနေပါသည်</span>
        <span>⚡ ချက်ချင်း ငွေသွင်း / ငွေထုတ် ဝန်ဆောင်မှု</span>
      </div>
    </div>

    <div class="relative z-10 px-4 pt-6 pb-20 max-w-lg mx-auto">

      <!-- Hero Section -->
      <div class="glass-card hud-bracket mb-5 text-center py-8 relative overflow-hidden">
        <div class="scanning-line"></div>
        <div class="absolute inset-0 opacity-5 flex items-center justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="none" stroke="var(--volt-gold)" stroke-width="1"/><path d="M100 20 L180 100 L100 180 L20 100 Z" fill="none" stroke="var(--volt-electric)" stroke-width="0.5"/></svg>
        </div>
        <div class="relative z-10">
          <div class="font-heading text-4xl font-black text-gold-gradient tracking-widest mb-2">VOLT APEX</div>
          <p class="text-sm mb-2" style="color: var(--volt-gray);">Myanmar Premier Gaming Platform</p>
          <p class="text-xs mb-6" style="color: var(--volt-electric);">⚡ Real-time · 🔒 Secure · 🎮 1000+ Games</p>

          <div class="flex gap-3 justify-center">
            <button class="btn-primary px-8 h-12 text-base anim-glow-pulse" @click="$router.push('/register')">
              အခမဲ့ စတင်မည် 🎮
            </button>
            <button class="btn-secondary px-6 h-12 text-sm" @click="$router.push('/login')">
              ဝင်ရောက်မည်
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-3 gap-2 mb-5">
        <div v-for="stat in stats" :key="stat.label" class="glass-card text-center py-3 px-2">
          <div class="font-number text-lg font-black text-gold-gradient">{{ stat.value }}</div>
          <div class="text-xs mt-0.5" style="color: var(--volt-gray);">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Game Categories -->
      <div class="mb-5">
        <div class="flex items-center justify-between mb-3">
          <span class="font-heading text-xs tracking-wider" style="color: var(--volt-electric);">🎮 ဂိမ်းအမျိုးအစား</span>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div v-for="cat in categories" :key="cat.name"
            class="glass-card flex flex-col items-center justify-center py-4 gap-2 cursor-pointer transition-all hover:scale-105"
            @click="$router.push('/login')"
            style="border: 1px solid rgba(0,212,255,0.1);">
            <span class="text-2xl">{{ cat.icon }}</span>
            <span class="text-xs font-medium" style="color: var(--volt-gray);">{{ cat.name }}</span>
          </div>
        </div>
      </div>

      <!-- Featured Games Preview -->
      <div class="glass-card mb-5 p-0 overflow-hidden">
        <div class="p-3 flex items-center justify-between">
          <span class="font-heading text-xs tracking-wider" style="color: var(--volt-electric);">🔥 ထိပ်တန်းဂိမ်းများ</span>
          <button class="text-xs" style="color: var(--volt-gold);" @click="$router.push('/login')">ဆော့ကစားမည် →</button>
        </div>
        <div class="flex gap-2 overflow-x-auto px-3 pb-3 no-scrollbar">
          <div v-for="game in previewGames" :key="game.name"
            class="relative flex-shrink-0 w-24 rounded-xl overflow-hidden cursor-pointer group"
            @click="$router.push('/login')">
            <div class="w-24 h-32 flex items-center justify-center text-3xl" :style="`background: ${game.bg}`">
              {{ game.emoji }}
            </div>
            <div class="absolute inset-x-0 bottom-0 p-1.5" style="background: linear-gradient(0deg, rgba(5,8,17,0.95) 0%, transparent 100%);">
              <div class="text-xs text-center leading-tight" style="color: var(--volt-white);">{{ game.name }}</div>
            </div>
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style="background: rgba(0,0,0,0.5);">
              <span class="text-xs font-bold" style="color: var(--volt-gold);">ကစားမည်</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Features -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <div v-for="feat in features" :key="feat.title" class="glass-card p-4">
          <div class="text-2xl mb-2">{{ feat.icon }}</div>
          <div class="text-xs font-bold mb-1" style="color: var(--volt-electric);">{{ feat.title }}</div>
          <div class="text-xs" style="color: var(--volt-gray);">{{ feat.desc }}</div>
        </div>
      </div>

      <!-- CTA -->
      <div class="glass-card p-5 text-center" style="border: 1px solid rgba(212,175,55,0.2);">
        <div class="font-heading text-base text-gold-gradient mb-2">ယနေ့ပင် စတင်ကစားပါ</div>
        <p class="text-xs mb-4" style="color: var(--volt-gray);">အကောင့်ဖွင့်ခ အခမဲ့ · ငွေသွင်းချက်ချင်း ကစားနိုင်</p>
        <button class="btn-primary w-full h-12 text-sm anim-glow-pulse" @click="$router.push('/register')">
          🎮 အကောင့်အခမဲ့ ဖွင့်မည်
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ParticleField from "@/components/three/ParticleField.vue";

const onlineCount = ref(1200 + Math.floor(Math.random() * 200));

setInterval(() => {
  onlineCount.value = 1200 + Math.floor(Math.random() * 200);
}, 5000);

const stats = [
  { value: "10K+", label: "ကစားသူများ" },
  { value: "1000+", label: "ဂိမ်းများ" },
  { value: "24/7", label: "ဝန်ဆောင်မှု" },
];

const categories = [
  { icon: "🎰", name: "Slot" },
  { icon: "🎲", name: "Live Casino" },
  { icon: "🐟", name: "Fishing" },
  { icon: "⚽", name: "Sport" },
  { icon: "🎯", name: "Lottery" },
  { icon: "🚀", name: "Crash" },
];

const previewGames = [
  { name: "Gates of Olympus", emoji: "⚡", bg: "linear-gradient(135deg, #0D1B3E 0%, #1a0a4a 100%)" },
  { name: "Sweet Bonanza", emoji: "🍬", bg: "linear-gradient(135deg, #1a0a3e 0%, #3a0a5e 100%)" },
  { name: "Big Bass", emoji: "🐟", bg: "linear-gradient(135deg, #0a2a3e 0%, #0a4a5e 100%)" },
  { name: "Aviator", emoji: "✈️", bg: "linear-gradient(135deg, #1a0a0a 0%, #3e0a0a 100%)" },
  { name: "Dragon Tiger", emoji: "🐉", bg: "linear-gradient(135deg, #1a0a00 0%, #3e1a00 100%)" },
];

const features = [
  { icon: "💰", title: "ချက်ချင်းငွေသွင်း", desc: "KPay, Wave, CBPay ဖြင့် ချက်ချင်း ငွေသွင်းနိုင်" },
  { icon: "💸", title: "မြန်မြန်ငွေထုတ်", desc: "မိနစ်ပိုင်းအတွင်း ငွေထုတ်ပေးသည်" },
  { icon: "🔒", title: "လုံခြုံမှုအပြည့်", desc: "SSL Encrypted · RLS Protected" },
  { icon: "🎁", title: "Bonus များ", desc: "Welcome Bonus, Daily Bonus ရနိုင်" },
];
</script>
