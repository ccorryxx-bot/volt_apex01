<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <TopNavBar />
    <div class="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <h2 class="font-heading text-base tracking-wider mb-4" style="color: var(--volt-electric);">🎁 Bonus များ</h2>
      <div class="space-y-3">
        <div v-for="b in bonuses" :key="b.id" class="glass-card">
          <button class="flex items-center justify-between w-full" @click="b.open = !b.open">
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ b.icon }}</span>
              <div class="text-left">
                <div class="text-sm font-medium" style="color: var(--volt-white);">{{ b.name }}</div>
                <div class="text-xs" style="color: var(--volt-gold);">{{ b.value }}</div>
              </div>
            </div>
            <span style="color: var(--volt-electric); transition: transform 0.3s;" :style="b.open ? 'transform: rotate(180deg)' : ''">▾</span>
          </button>
          <transition name="slide">
            <div v-if="b.open" class="mt-3 pt-3 border-t" style="border-color: rgba(0,212,255,0.1);">
              <p class="text-xs mb-3" style="color: var(--volt-gray);">{{ b.desc }}</p>
              <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                <div><span style="color: var(--volt-gray);">Min Deposit: </span><span style="color: var(--volt-white);">{{ b.minDeposit }}</span></div>
                <div><span style="color: var(--volt-gray);">Wagering: </span><span style="color: var(--volt-white);">{{ b.wagering }}x</span></div>
              </div>
              <button class="btn-primary h-10 text-sm">{{ b.claimed ? 'ရယူပြီးပါပြီ ✓' : 'Bonus ရယူမည်' }}</button>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";

const bonuses = ref([
  { id: 1, icon: "🎊", name: "Welcome Bonus", value: "100% up to 50,000 K", desc: "ပထမဆုံး ငွေသွင်းမှုတွင် 100% Bonus ရရှိမည်", minDeposit: "10,000 K", wagering: 20, open: false, claimed: false },
  { id: 2, icon: "📅", name: "Daily Bonus", value: "10% Daily Reload", desc: "နေ့တိုင်း ငွေသွင်းမှုတွင် 10% Bonus ထပ်ရမည်", minDeposit: "5,000 K", wagering: 10, open: false, claimed: false },
  { id: 3, icon: "💰", name: "Cashback", value: "5% Weekly Cashback", desc: "တစ်ပတ်လျှင် ရှုံးငွေ၏ 5% ပြန်ရမည်", minDeposit: "0 K", wagering: 1, open: false, claimed: false },
  { id: 4, icon: "👥", name: "Referral Bonus", value: "3% Commission", desc: "မိတ်ဆက်ထားသူ ငွေသွင်းတိုင်း 3% ရမည်", minDeposit: "0 K", wagering: 0, open: false, claimed: true },
]);
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: max-height 0.3s ease, opacity 0.3s; overflow: hidden; max-height: 300px; }
.slide-enter-from, .slide-leave-to { max-height: 0; opacity: 0; }
</style>
