<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <TopNavBar />
    <div class="px-4 pt-4 pb-28 max-w-lg mx-auto">
      <h2 class="font-heading text-base tracking-wider mb-4" style="color: var(--volt-electric);">💸 ငွေထုတ်မည်</h2>

      <div class="glass-card mb-4 text-center relative overflow-hidden">
        <div class="text-xs mb-1" style="color: var(--volt-gray);">ထုတ်ယူနိုင်သော ငွေပမာဏ</div>
        <div class="font-number text-3xl font-black text-gold-gradient anim-float-y">{{ formatBal(auth.profile?.balance || 0) }}</div>
        <div class="text-xs mt-0.5" style="color: var(--volt-gray);">MMK</div>
      </div>

      <div class="glass-card hud-bracket relative space-y-4">
        <div class="scanning-line"></div>

        <div>
          <label class="block text-xs mb-2 font-medium" style="color: var(--volt-gray);">ငွေပေးချေနည်း</label>
          <div class="grid grid-cols-4 gap-2">
            <button v-for="m in methods" :key="m.key"
              class="flex flex-col items-center p-2.5 rounded-xl transition-all"
              :style="method === m.key ? `border: 2px solid var(--volt-gold); background: rgba(212,175,55,0.1); color: var(--volt-gold);` : `border: 1px solid rgba(0,212,255,0.15); background: rgba(13,27,62,0.7); color: var(--volt-gray);`"
              @click="method = m.key">
              <span class="text-2xl mb-1">{{ m.icon }}</span>
              <span class="text-xs">{{ m.name }}</span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs mb-1.5 font-medium" style="color: var(--volt-gray);">Account နံပါတ်</label>
          <input v-model="account" type="tel" placeholder="09xxxxxxxxx" inputmode="tel"
            class="volt-input w-full h-12 px-4 rounded-xl text-sm outline-none" />
        </div>

        <div>
          <label class="block text-xs mb-2 font-medium" style="color: var(--volt-gray);">ထုတ်ယူမည့် ပမာဏ</label>
          <div class="flex gap-2 flex-wrap mb-2">
            <button v-for="amt in quickAmounts" :key="amt"
              class="px-3 h-8 rounded-xl text-xs font-bold transition-all"
              :style="amount === String(amt) ? 'background: var(--volt-gold); color: #050811;' : 'background: rgba(13,27,62,0.7); color: var(--volt-gray); border: 1px solid rgba(0,212,255,0.15);'"
              @click="amount = String(amt)">
              {{ (amt / 1000).toFixed(0) }}K
            </button>
          </div>
          <input v-model="amount" type="number" placeholder="Min 5,000 MMK" inputmode="numeric"
            class="volt-input w-full h-12 px-4 rounded-xl text-sm outline-none" />
        </div>

        <div class="p-3 rounded-xl text-xs space-y-1" style="background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.1);">
          <div class="flex justify-between">
            <span style="color: var(--volt-gray);">ထုတ်ယူမည့်ပမာဏ</span>
            <span class="font-number font-bold" style="color: var(--volt-white);">{{ Number(amount || 0).toLocaleString() }} K</span>
          </div>
          <div class="flex justify-between">
            <span style="color: var(--volt-gray);">ကျန်ငွေ</span>
            <span class="font-number font-bold" :style="remainingBalance >= 0 ? 'color: var(--volt-emerald)' : 'color: var(--volt-red)'">
              {{ remainingBalance.toLocaleString() }} K
            </span>
          </div>
        </div>

        <div v-if="errorMsg" class="p-3 rounded-xl text-sm text-center" style="background: rgba(255,61,90,0.1); border: 1px solid rgba(255,61,90,0.3); color: var(--volt-red);">{{ errorMsg }}</div>

        <button class="btn-primary h-14 text-base font-bold flex items-center justify-center gap-2" @click="handleWithdraw" :disabled="txStore.loading">
          <span v-if="txStore.loading" class="spinner"></span>
          {{ txStore.loading ? 'တင်သွင်းနေသည်...' : 'ငွေထုတ်မည်' }}
        </button>

        <p class="text-xs text-center" style="color: var(--volt-gray);">⏱ ပုံမှန်အားဖြင့် ၁-၃ နာရီအတွင်း ရောက်ရှိမည်</p>
      </div>
    </div>
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useTransactionsStore } from "@/stores/transactions.store";
import { useUiStore } from "@/stores/ui.store";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";
import type { PaymentMethod } from "@/stores/transactions.store";

const router = useRouter();
const auth = useAuthStore();
const txStore = useTransactionsStore();
const ui = useUiStore();

const method = ref<PaymentMethod | "">("");
const account = ref("");
const amount = ref("");
const errorMsg = ref("");
const quickAmounts = [10000, 30000, 50000, 100000, 200000, 500000];

const methods = [
  { key: "kpay",   name: "KPay",   icon: "💙" },
  { key: "wave",   name: "Wave",   icon: "💚" },
  { key: "cbpay",  name: "CB Pay", icon: "🟡" },
  { key: "uabpay", name: "UAB",    icon: "🔵" },
];

const remainingBalance = computed(() => (auth.profile?.balance || 0) - Number(amount.value || 0));

function formatBal(n: number) {
  return n.toLocaleString("en-US");
}

async function handleWithdraw() {
  errorMsg.value = "";
  if (!method.value) { errorMsg.value = "ငွေပေးချေနည်း ရွေးချယ်ပါ"; return; }
  if (!account.value.trim()) { errorMsg.value = "Account နံပါတ် ထည့်ပါ"; return; }
  const amt = Number(amount.value);
  if (!amt || amt < 5000) { errorMsg.value = "အနည်းဆုံး 5,000 MMK ထုတ်ယူနိုင်သည်"; return; }
  if (amt > (auth.profile?.balance || 0)) { errorMsg.value = "ငွေပမာဏ မလုံလောက်ပါ"; return; }

  const result = await txStore.submitWithdraw({
    amount: amt,
    paymentMethod: method.value as PaymentMethod,
    paymentAccount: account.value.trim(),
  });

  if (result.success) {
    ui.toast.success("ငွေထုတ်မှု တင်သွင်းပြီးပါပြီ! Admin စစ်ဆေးနေသည်");
    router.push("/transactions");
  } else {
    errorMsg.value = result.error || "တင်သွင်းမှု မအောင်မြင်ပါ";
  }
}
</script>

<style scoped>
.volt-input { background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.2); color: var(--volt-white); }
.volt-input:focus { border-color: rgba(0,212,255,0.5); outline: none; }
.spinner { width: 20px; height: 20px; border: 2px solid rgba(5,8,17,0.3); border-top-color: #050811; border-radius: 50%; animation: rotate-ring 0.7s linear infinite; }
</style>
