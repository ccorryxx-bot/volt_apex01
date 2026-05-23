<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <TopNavBar />
    <div class="px-4 pt-4 pb-28 max-w-lg mx-auto">
      <h2 class="font-heading text-base tracking-wider mb-4" style="color: var(--volt-electric);">💰 ငွေသွင်းမည်</h2>

      <!-- Payment Methods -->
      <div class="grid grid-cols-4 gap-2 mb-4">
        <button v-for="m in paymentMethods" :key="m.key"
          class="flex flex-col items-center p-2.5 rounded-xl transition-all"
          :style="selected === m.key ? `border: 2px solid var(--volt-gold); background: rgba(212,175,55,0.1); color: var(--volt-gold);` : `border: 1px solid rgba(0,212,255,0.15); background: rgba(13,27,62,0.7); color: var(--volt-gray);`"
          @click="selectMethod(m)">
          <span class="text-2xl mb-1">{{ m.icon }}</span>
          <span class="text-xs font-medium">{{ m.name }}</span>
        </button>
      </div>

      <transition name="slide-down">
        <div v-if="selected && activeAccount" class="space-y-3">
          <!-- Account Info -->
          <div class="glass-card hud-bracket relative">
            <div class="scanning-line"></div>
            <div class="text-xs mb-2 font-medium" style="color: var(--volt-electric);">ငွေလွှဲရမည့် Account</div>
            <div class="flex items-center justify-between mb-2">
              <div>
                <div class="font-heading text-lg font-bold" style="color: var(--volt-white);">{{ activeAccount.account_number }}</div>
                <div class="text-xs mt-0.5" style="color: var(--volt-gray);">{{ activeAccount.account_name }}</div>
              </div>
              <button class="px-3 h-8 rounded-lg text-xs font-medium" style="background: rgba(0,212,255,0.1); color: var(--volt-electric); border: 1px solid rgba(0,212,255,0.2);" @click="copyAccount">
                {{ copiedAccount ? '✓ ကူးယူပြီး' : '📋 ကူးယူ' }}
              </button>
            </div>
            <div class="text-xs p-2 rounded-lg" style="background: rgba(212,175,55,0.08); color: var(--volt-gold); border: 1px solid rgba(212,175,55,0.15);">
              ⚠️ Account name မှန်ကန်မှုကို စစ်ဆေးပြီး ငွေလွှဲပါ
            </div>
          </div>

          <!-- Amount Quick Select -->
          <div>
            <div class="text-xs mb-2 font-medium" style="color: var(--volt-gray);">ငွေပမာဏ (MMK)</div>
            <div class="flex gap-2 flex-wrap mb-2">
              <button v-for="amt in quickAmounts" :key="amt"
                class="px-3 h-8 rounded-xl text-xs font-bold transition-all"
                :style="amount === String(amt) ? 'background: var(--volt-gold); color: #050811;' : 'background: rgba(13,27,62,0.7); color: var(--volt-gray); border: 1px solid rgba(0,212,255,0.15);'"
                @click="amount = String(amt)">
                {{ (amt / 1000).toFixed(0) }}K
              </button>
            </div>
            <input v-model="amount" type="number" placeholder="ပမာဏ ထည့်ပါ" inputmode="numeric"
              class="volt-input w-full h-12 px-4 rounded-xl text-sm outline-none" />
          </div>

          <!-- Reference Number -->
          <div>
            <label class="block text-xs mb-1.5 font-medium" style="color: var(--volt-gray);">Transaction Reference No.</label>
            <input v-model="refNo" type="text" placeholder="e.g. 202505221032xxxxx"
              class="volt-input w-full h-12 px-4 rounded-xl text-sm outline-none" />
          </div>

          <!-- Screenshot Upload -->
          <div>
            <label class="block text-xs mb-1.5 font-medium" style="color: var(--volt-gray);">Screenshot တင်မည် (မဖြစ်မနေ)</label>
            <div class="upload-zone relative" @click="fileInput?.click()" @dragover.prevent @drop.prevent="onDrop">
              <img v-if="previewImg" :src="previewImg" class="absolute inset-0 w-full h-full object-cover rounded-xl" />
              <div v-else class="flex flex-col items-center gap-2 py-4">
                <span class="text-3xl">📷</span>
                <span class="text-sm font-medium" style="color: var(--volt-electric);">Tap ထိ Screenshot တင်မည်</span>
                <span class="text-xs" style="color: var(--volt-gray);">JPG, PNG ဖိုင်</span>
              </div>
              <div v-if="previewImg" class="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center" style="background: rgba(5,8,17,0.8);" @click.stop="previewImg = ''; screenshotFile = null">✕</div>
            </div>
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
          </div>

          <!-- Security Notice -->
          <div class="flex items-center gap-2 p-3 rounded-xl text-xs" style="background: rgba(0,255,179,0.05); border: 1px solid rgba(0,255,179,0.15); color: var(--volt-gray);">
            <span class="text-base">🔒</span>
            <span>ငွေသွင်းပြီး Admin မှ ၁၅ မိနစ်အတွင်း အတည်ပြုပေးမည်</span>
          </div>

          <!-- Error -->
          <div v-if="errorMsg" class="p-3 rounded-xl text-sm text-center" style="background: rgba(255,61,90,0.1); border: 1px solid rgba(255,61,90,0.3); color: var(--volt-red);">{{ errorMsg }}</div>

          <!-- Submit -->
          <button class="btn-primary anim-glow-pulse h-14 text-base font-bold flex items-center justify-center gap-2"
            @click="handleSubmit" :disabled="txStore.loading">
            <span v-if="txStore.loading" class="spinner"></span>
            <span>{{ txStore.loading ? 'တင်သွင်းနေသည်...' : 'ငွေသွင်းမှု Submit မည်' }}</span>
          </button>
        </div>
      </transition>

      <div v-if="!selected" class="glass-card text-center py-8 mt-4">
        <div class="text-3xl mb-2">💳</div>
        <p class="text-sm" style="color: var(--volt-gray);">ငွေပေးချေနည်း ရွေးချယ်ပါ ↑</p>
      </div>
    </div>
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";
import { useTransactionsStore } from "@/stores/transactions.store";
import type { PaymentMethod, PaymentAccount } from "@/stores/transactions.store";
import { useUiStore } from "@/stores/ui.store";
import { useRouter } from "vue-router";

const router = useRouter();
const txStore = useTransactionsStore();
const ui = useUiStore();

const selected = ref<PaymentMethod | "">("");
const amount = ref("");
const refNo = ref("");
const previewImg = ref("");
const screenshotFile = ref<File | null>(null);
const copiedAccount = ref(false);
const errorMsg = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const quickAmounts = [10000, 20000, 50000, 100000, 200000, 500000];

const STATIC_ACCOUNTS: Record<string, { account_name: string; account_number: string }> = {
  kpay:  { account_name: "VOLT APEX", account_number: "09-750-000-001" },
  wave:  { account_name: "VOLT APEX", account_number: "09-750-000-002" },
  cbpay: { account_name: "VOLT APEX", account_number: "09-750-000-003" },
  uabpay:{ account_name: "VOLT APEX", account_number: "09-750-000-004" },
};

const paymentMethods = [
  { key: "kpay",   name: "KPay",   icon: "💙" },
  { key: "wave",   name: "Wave",   icon: "💚" },
  { key: "cbpay",  name: "CB Pay", icon: "🟡" },
  { key: "uabpay", name: "UAB",    icon: "🔵" },
];

const activeAccount = computed(() => {
  if (!selected.value) return null;
  const fromStore = txStore.paymentAccounts.find(a => a.method === selected.value);
  return fromStore || STATIC_ACCOUNTS[selected.value] || null;
});

async function selectMethod(m: typeof paymentMethods[0]) {
  selected.value = m.key as PaymentMethod;
  await txStore.fetchPaymentAccounts();
}

function copyAccount() {
  if (!activeAccount.value) return;
  navigator.clipboard.writeText(activeAccount.value.account_number).catch(() => {});
  copiedAccount.value = true;
  setTimeout(() => (copiedAccount.value = false), 2000);
}

function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) { previewImg.value = URL.createObjectURL(f); screenshotFile.value = f; }
}
function onDrop(e: DragEvent) {
  const f = e.dataTransfer?.files?.[0];
  if (f) { previewImg.value = URL.createObjectURL(f); screenshotFile.value = f; }
}

async function handleSubmit() {
  errorMsg.value = "";
  const amt = Number(amount.value);
  if (!amt || amt < 1000) { errorMsg.value = "ငွေပမာဏ အနည်းဆုံး 1,000 MMK"; return; }
  if (!refNo.value.trim()) { errorMsg.value = "Transaction Reference No. ထည့်ပါ"; return; }

  const result = await txStore.submitDeposit({
    amount: amt,
    paymentMethod: selected.value as PaymentMethod,
    paymentRef: refNo.value.trim(),
    screenshotFile: screenshotFile.value || undefined,
  });

  if (result.success) {
    ui.toast.success("ငွေသွင်းမှု တင်သွင်းပြီးပါပြီ! Admin စစ်ဆေးနေသည် 🎉");
    router.push("/transactions");
  } else {
    errorMsg.value = result.error || "တင်သွင်းမှု မအောင်မြင်ပါ";
  }
}
</script>

<style scoped>
.volt-input { background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.2); color: var(--volt-white); transition: border-color 0.2s; }
.volt-input:focus { border-color: rgba(0,212,255,0.5); box-shadow: 0 0 0 2px rgba(0,212,255,0.08); }
.upload-zone {
  min-height: 110px; border-radius: 14px;
  border: 2px dashed rgba(0,212,255,0.25);
  background: rgba(5,8,17,0.6);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; overflow: hidden; position: relative;
  transition: border-color 0.2s;
}
.upload-zone:hover { border-color: rgba(0,212,255,0.5); }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.35s ease; overflow: hidden; max-height: 900px; }
.slide-down-enter-from, .slide-down-leave-to { max-height: 0; opacity: 0; }
.spinner { width: 20px; height: 20px; border: 2px solid rgba(5,8,17,0.3); border-top-color: #050811; border-radius: 50%; animation: rotate-ring 0.7s linear infinite; }
</style>
