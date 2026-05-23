<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <div class="sticky top-0 z-50 px-4 h-14 flex items-center gap-3" style="background: rgba(10,14,26,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,212,255,0.1);">
      <button @click="$router.push('/admin')" class="text-xl" style="color: var(--volt-electric);">←</button>
      <span class="font-heading text-sm font-bold" style="color: var(--volt-white);">Withdraw Approval</span>
      <span class="ml-auto text-xs px-2 py-1 rounded-full font-bold" style="background: rgba(255,61,90,0.15); color: var(--volt-red);">{{ txStore.pendingWithdrawals.length }} ဆောင်ရွက်ရန်</span>
    </div>

    <div class="px-4 pt-4 pb-8 max-w-lg mx-auto">
      <div class="flex gap-2 mb-4">
        <button v-for="f in statusFilters" :key="f.key"
          class="px-4 h-8 rounded-full text-xs font-medium transition-all"
          :style="filter === f.key ? 'background: var(--volt-gold); color: #050811;' : 'background: rgba(13,27,62,0.7); color: var(--volt-gray); border: 1px solid rgba(0,212,255,0.15);'"
          @click="setFilter(f.key)">{{ f.label }}</button>
      </div>

      <div v-if="txStore.loading" class="space-y-3">
        <VoltSkeleton v-for="i in 4" :key="i" height="160px" radius="14px" />
      </div>

      <div v-else class="space-y-3">
        <div v-for="t in displayList" :key="t.id" class="glass-card relative overflow-hidden">
          <div class="h-1 absolute top-0 inset-x-0" :style="t.status === 'pending' ? 'background: var(--volt-gold)' : t.status === 'approved' ? 'background: var(--volt-emerald)' : 'background: var(--volt-red)'"></div>

          <div class="flex items-start justify-between mb-3">
            <div>
              <div class="font-medium text-sm" style="color: var(--volt-white);">{{ (t as any).users?.username || t.user_id?.substring(0,8) }}</div>
              <div class="text-xs mt-0.5" style="color: var(--volt-gray);">{{ (t as any).users?.phone_number }} · {{ formatDate(t.created_at) }}</div>
            </div>
            <span class="text-xs px-2 py-1 rounded-full" :style="statusStyle(t.status)">{{ statusLabel(t.status) }}</span>
          </div>

          <div class="grid grid-cols-2 gap-2 mb-3">
            <div class="p-2 rounded-xl" style="background: rgba(5,8,17,0.6);">
              <div class="text-xs mb-0.5" style="color: var(--volt-gray);">ပမာဏ</div>
              <div class="font-number text-base font-black" style="color: var(--volt-red);">{{ t.amount.toLocaleString() }} K</div>
            </div>
            <div class="p-2 rounded-xl" style="background: rgba(5,8,17,0.6);">
              <div class="text-xs mb-0.5" style="color: var(--volt-gray);">ပေးချေနည်း</div>
              <div class="text-sm font-medium" style="color: var(--volt-electric);">{{ t.payment_method?.toUpperCase() }}</div>
            </div>
          </div>

          <div class="p-2 rounded-xl mb-3 text-xs" style="background: rgba(5,8,17,0.6);">
            <span style="color: var(--volt-gray);">Account: </span>
            <span style="color: var(--volt-white); font-weight: 600;">{{ t.payment_account || '—' }}</span>
          </div>

          <div v-if="t.admin_note" class="p-2 rounded-xl mb-3 text-xs" style="background: rgba(255,61,90,0.08); color: var(--volt-red);">{{ t.admin_note }}</div>

          <div v-if="t.status === 'pending'" class="flex gap-2">
            <button class="flex-1 h-10 rounded-xl text-sm font-bold" style="background: rgba(0,255,179,0.1); color: var(--volt-emerald); border: 1px solid rgba(0,255,179,0.25);" :disabled="processing === t.id" @click="approve(t.id)">
              <span v-if="processing === t.id">⏳ ...</span><span v-else>✓ Approve</span>
            </button>
            <button class="flex-1 h-10 rounded-xl text-sm font-bold" style="background: rgba(255,61,90,0.1); color: var(--volt-red); border: 1px solid rgba(255,61,90,0.25);" @click="openReject(t.id)">✕ Reject</button>
          </div>
        </div>
        <div v-if="displayList.length === 0" class="text-center py-12">
          <div class="text-4xl mb-2">✅</div>
          <p class="text-sm" style="color: var(--volt-gray);">ဆောင်ရွက်ရမည့် Withdrawal မရှိပါ</p>
        </div>
      </div>
    </div>

    <VoltModal v-model="showRejectModal" title="Reject ကြောင်း">
      <textarea v-model="rejectNote" rows="3" placeholder="ကြောင်းရင်း..." class="w-full p-3 rounded-xl text-sm outline-none resize-none" style="background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.2); color: var(--volt-white);"></textarea>
      <template #footer>
        <button class="h-11 px-6 rounded-xl text-sm font-bold" style="background: rgba(255,61,90,0.15); color: var(--volt-red); border: 1px solid rgba(255,61,90,0.3);" @click="confirmReject">Reject မည်</button>
      </template>
    </VoltModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTransactionsStore } from "@/stores/transactions.store";
import VoltSkeleton from "@/components/ui/VoltSkeleton.vue";
import VoltModal from "@/components/ui/VoltModal.vue";
import type { TxnStatus } from "@/stores/transactions.store";
import { supabase } from "@/lib/supabase";

const txStore = useTransactionsStore();
const filter = ref<TxnStatus>("pending");
const processing = ref("");
const showRejectModal = ref(false);
const rejectNote = ref("");
const rejectTargetId = ref("");
const allWithdrawals = ref<any[]>([]);

const statusFilters = [
  { key: "pending", label: "⏳ Pending" },
  { key: "approved", label: "✓ Approved" },
  { key: "rejected", label: "✕ Rejected" },
];

const displayList = computed(() => {
  if (filter.value === "pending") return txStore.pendingWithdrawals;
  return allWithdrawals.value.filter(t => t.status === filter.value);
});

async function setFilter(f: TxnStatus) {
  filter.value = f;
  if (f !== "pending") {
    const { data } = await supabase.from("transactions").select("*, users(username, phone_number)").eq("type", "withdraw").eq("status", f).order("created_at", { ascending: false }).limit(30);
    if (data) allWithdrawals.value = data;
  }
}
async function approve(id: string) { processing.value = id; await txStore.approveWithdrawal(id); processing.value = ""; }
function openReject(id: string) { rejectTargetId.value = id; rejectNote.value = ""; showRejectModal.value = true; }
async function confirmReject() { await txStore.rejectTransaction(rejectTargetId.value, rejectNote.value); showRejectModal.value = false; }

function formatDate(d: string) { return new Date(d).toLocaleString("my-MM", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); }
function statusStyle(s: TxnStatus) {
  return { approved: "background: rgba(0,255,179,0.15); color: var(--volt-emerald);", pending: "background: rgba(212,175,55,0.15); color: var(--volt-gold);", rejected: "background: rgba(255,61,90,0.15); color: var(--volt-red);", processing: "background: rgba(0,212,255,0.12); color: var(--volt-electric);" }[s] || "";
}
function statusLabel(s: TxnStatus) { return { approved: "✓ Approved", pending: "⏳ Pending", rejected: "✕ Rejected", processing: "⚙ Processing" }[s] || s; }

onMounted(() => txStore.fetchPendingWithdrawals());
</script>
