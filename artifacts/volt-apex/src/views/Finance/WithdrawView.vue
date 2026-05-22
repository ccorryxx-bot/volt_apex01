<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <TopNavBar />
    <div class="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <h2 class="font-heading text-base tracking-wider mb-4" style="color: var(--volt-electric);">💸 ငွေထုတ်မည်</h2>
      <div class="glass-card mb-4 text-center">
        <div class="text-xs mb-1" style="color: var(--volt-gray);">ထုတ်ယူနိုင်သော ငွေပမာဏ</div>
        <div class="font-number text-2xl font-bold text-gold-gradient">{{ formatBal(auth.profile?.balance || 0) }} K</div>
      </div>
      <div class="glass-card space-y-3">
        <div>
          <label class="block text-xs mb-1.5" style="color: var(--volt-gray);">ငွေပေးချေနည်း</label>
          <select v-model="method" class="volt-input w-full h-11 px-4 rounded-xl text-sm outline-none">
            <option value="">ရွေးချယ်ပါ</option>
            <option value="kpay">KPay</option>
            <option value="wave">Wave Pay</option>
            <option value="cbpay">CB Pay</option>
            <option value="uabpay">UAB Pay</option>
          </select>
        </div>
        <div>
          <label class="block text-xs mb-1.5" style="color: var(--volt-gray);">Account နံပါတ်</label>
          <input v-model="account" type="tel" placeholder="09xxxxxxxxx" class="volt-input w-full h-11 px-4 rounded-xl text-sm outline-none" />
        </div>
        <div>
          <label class="block text-xs mb-1.5" style="color: var(--volt-gray);">ထုတ်ယူမည့် ပမာဏ</label>
          <input v-model="amount" type="number" :placeholder="`Min 5,000 / Max ${formatBal(auth.profile?.balance || 0)}K`" inputmode="numeric" class="volt-input w-full h-11 px-4 rounded-xl text-sm outline-none" />
        </div>
        <button class="btn-primary anim-glow-pulse flex items-center justify-center gap-2" @click="submit" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'တင်သွင်းနေသည်...' : 'ငွေထုတ်မည်' }}
        </button>
      </div>
    </div>
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";

const auth = useAuthStore();
const ui = useUiStore();
const method = ref(""); const account = ref(""); const amount = ref(""); const loading = ref(false);
function formatBal(n: number) { return (n / 1000).toFixed(0); }
async function submit() {
  if (!method.value || !account.value || !amount.value) { ui.toast.error("အချက်အလက်များ ဖြည့်ပါ"); return; }
  if (Number(amount.value) < 5000) { ui.toast.error("အနည်းဆုံး 5,000 MMK ထုတ်ယူနိုင်သည်"); return; }
  loading.value = true;
  await new Promise(r => setTimeout(r, 1500));
  loading.value = false;
  ui.toast.success("ငွေထုတ်မှု Request တင်သွင်းမှု အောင်မြင်ပါသည်!");
}
</script>

<style scoped>
.volt-input { background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.2); color: var(--volt-white); }
.volt-input:focus { border-color: rgba(0,212,255,0.5); outline: none; }
.volt-input option { background: #0A0E1A; }
.spinner { width: 18px; height: 18px; border: 2px solid rgba(5,8,17,0.3); border-top-color: #050811; border-radius: 50%; animation: rotate-ring 0.7s linear infinite; }
</style>
