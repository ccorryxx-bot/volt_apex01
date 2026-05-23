<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <TopNavBar />
    <div class="px-4 pt-4 pb-28 max-w-lg mx-auto">
      <h2 class="font-heading text-base tracking-wider mb-4" style="color: var(--volt-electric);">🔗 Affiliate Hub</h2>

      <!-- Tier Card -->
      <div class="glass-card hud-bracket relative overflow-hidden mb-4">
        <div class="scanning-line"></div>
        <div class="flex items-center justify-between mb-3">
          <div>
            <div class="text-xs mb-1" style="color: var(--volt-gray);">ကျွန်ုပ်၏ Tier</div>
            <div class="font-heading text-xl font-black" :style="`color: ${tierColor}`">{{ tierLabel }}</div>
          </div>
          <div class="w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl" :style="`border-color: ${tierColor}; background: ${tierColor}20`">{{ tierIcon }}</div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center mb-3">
          <div class="p-2 rounded-xl" style="background: rgba(13,27,62,0.8);">
            <div class="font-number text-lg font-black text-gold-gradient">{{ store.myRates.l1 * 100 }}%</div>
            <div class="text-xs" style="color: var(--volt-gray);">L1 Commission</div>
          </div>
          <div class="p-2 rounded-xl" style="background: rgba(13,27,62,0.8);">
            <div class="font-number text-lg font-black text-gold-gradient">{{ store.myRates.l2 * 100 }}%</div>
            <div class="text-xs" style="color: var(--volt-gray);">L2 Commission</div>
          </div>
          <div class="p-2 rounded-xl" style="background: rgba(13,27,62,0.8);">
            <div class="font-number text-lg font-black text-gold-gradient">{{ store.myRates.l3 * 100 }}%</div>
            <div class="text-xs" style="color: var(--volt-gray);">L3 Commission</div>
          </div>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-2 gap-2 mb-4">
        <div class="glass-card text-center">
          <div class="text-2xl mb-1">👥</div>
          <div class="font-number text-xl font-black" style="color: var(--volt-white);">{{ store.stats.total_downline_l1 }}</div>
          <div class="text-xs" style="color: var(--volt-gray);">တိုက်ရိုက် (L1)</div>
        </div>
        <div class="glass-card text-center">
          <div class="text-2xl mb-1">💰</div>
          <div class="font-number text-xl font-black text-gold-gradient">{{ (store.stats.total_commission / 1000).toFixed(1) }}K</div>
          <div class="text-xs" style="color: var(--volt-gray);">စုစုပေါင်း Commission</div>
        </div>
        <div class="glass-card text-center">
          <div class="text-2xl mb-1">⏳</div>
          <div class="font-number text-xl font-black" style="color: var(--volt-gold);">{{ (store.stats.pending_commission / 1000).toFixed(1) }}K</div>
          <div class="text-xs" style="color: var(--volt-gray);">ဆောင်ရွက်ဆဲ</div>
        </div>
        <div class="glass-card text-center">
          <div class="text-2xl mb-1">✅</div>
          <div class="font-number text-xl font-black" style="color: var(--volt-emerald);">{{ (store.stats.paid_commission / 1000).toFixed(1) }}K</div>
          <div class="text-xs" style="color: var(--volt-gray);">ပေးချေပြီး</div>
        </div>
      </div>

      <!-- Referral Link -->
      <div class="glass-card mb-4">
        <div class="text-xs mb-2 font-medium" style="color: var(--volt-electric);">📎 Referral Link</div>
        <div class="flex items-center gap-2 p-3 rounded-xl mb-2" style="background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.15);">
          <span class="text-xs flex-1 truncate" style="color: var(--volt-gray);">{{ store.referralLink }}</span>
          <button class="px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0" style="background: rgba(0,212,255,0.1); color: var(--volt-electric); border: 1px solid rgba(0,212,255,0.2);" @click="copyLink">
            {{ copied ? '✓ ကူးယူပြီး' : '📋 ကူးယူ' }}
          </button>
        </div>
        <div class="flex gap-2">
          <button class="flex-1 h-9 rounded-xl text-xs font-medium" style="background: rgba(37,211,102,0.1); color: #25D366; border: 1px solid rgba(37,211,102,0.2);" @click="shareViber">
            📲 Viber Share
          </button>
          <button class="flex-1 h-9 rounded-xl text-xs font-medium" style="background: rgba(0,132,255,0.1); color: #0084FF; border: 1px solid rgba(0,132,255,0.2);" @click="shareMessenger">
            💬 Messenger
          </button>
        </div>
      </div>

      <!-- Downline List -->
      <div class="glass-card mb-4">
        <div class="text-xs mb-3 font-medium" style="color: var(--volt-electric);">👥 တိုက်ရိုက် Downline (L1)</div>
        <div v-if="store.loading">
          <VoltSkeleton v-for="i in 3" :key="i" height="52px" class="mb-2" />
        </div>
        <div v-else-if="store.downline.length === 0" class="text-center py-6">
          <div class="text-3xl mb-2">🫂</div>
          <p class="text-sm" style="color: var(--volt-gray);">Member မရှိသေးပါ<br/>Referral Link ဖြင့် ဖိတ်ကြားပါ</p>
        </div>
        <div v-else class="space-y-2">
          <div v-for="m in store.downline" :key="m.id" class="flex items-center justify-between p-3 rounded-xl" style="background: rgba(5,8,17,0.5); border: 1px solid rgba(0,212,255,0.08);">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style="background: rgba(0,212,255,0.15); color: var(--volt-electric);">{{ m.username?.charAt(0)?.toUpperCase() }}</div>
              <div>
                <div class="text-xs font-medium" style="color: var(--volt-white);">{{ m.username }}</div>
                <div class="text-xs" style="color: var(--volt-gray);">{{ new Date(m.created_at).toLocaleDateString() }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-number text-xs font-bold" style="color: var(--volt-emerald);">+{{ (m.commission_earned / 1000).toFixed(1) }}K</div>
              <div class="text-xs" style="color: var(--volt-gray);">Commission</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Commission History -->
      <div class="glass-card">
        <div class="text-xs mb-3 font-medium" style="color: var(--volt-electric);">💎 Commission မှတ်တမ်း</div>
        <div v-if="store.commissions.length === 0" class="text-center py-4">
          <p class="text-sm" style="color: var(--volt-gray);">Commission မှတ်တမ်း မရှိသေးပါ</p>
        </div>
        <div v-else class="space-y-0">
          <div v-for="c in store.commissions.slice(0, 8)" :key="c.id" class="flex items-center justify-between py-2.5 border-b last:border-0" style="border-color: rgba(0,212,255,0.08);">
            <div>
              <div class="text-xs font-medium" style="color: var(--volt-white);">L{{ c.level }} · {{ (c as any).users?.username || 'Member' }}</div>
              <div class="text-xs" style="color: var(--volt-gray);">{{ new Date(c.created_at).toLocaleDateString() }}</div>
            </div>
            <div class="text-right">
              <div class="font-number text-sm font-bold" style="color: var(--volt-emerald);">+{{ (c.commission_amount || 0).toLocaleString() }}</div>
              <span class="text-xs px-1.5 py-0.5 rounded-full" :style="c.status === 'paid' ? 'background: rgba(0,255,179,0.1); color: var(--volt-emerald)' : 'background: rgba(212,175,55,0.1); color: var(--volt-gold)'">
                {{ c.status === 'paid' ? 'ပေးချေပြီး' : 'ဆောင်ရွက်ဆဲ' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAffiliateStore } from "@/stores/affiliate.store";
import { useAuthStore } from "@/stores/auth.store";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";
import VoltSkeleton from "@/components/ui/VoltSkeleton.vue";

const store = useAffiliateStore();
const auth = useAuthStore();
const copied = ref(false);

const tierInfo: Record<string, { label: string; icon: string; color: string }> = {
  standard: { label: "Standard",   icon: "✦",  color: "var(--volt-gray)" },
  silver:   { label: "Silver ⭐",  icon: "⭐",  color: "#C0C0C0" },
  gold:     { label: "Gold 🏅",    icon: "🏅",  color: "var(--volt-gold)" },
  platinum: { label: "Platinum 💎",icon: "💎",  color: "var(--volt-electric)" },
};

const tier = computed(() => auth.profile?.affiliate_tier || "standard");
const tierLabel = computed(() => tierInfo[tier.value]?.label || "Standard");
const tierIcon  = computed(() => tierInfo[tier.value]?.icon || "✦");
const tierColor = computed(() => tierInfo[tier.value]?.color || "var(--volt-gray)");

function copyLink() {
  navigator.clipboard.writeText(store.referralLink).catch(() => {});
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}
function shareViber() {
  window.open(`viber://forward?text=${encodeURIComponent("🎮 VOLT APEX — Myanmar Premier Gaming!\n" + store.referralLink)}`, "_blank");
}
function shareMessenger() {
  window.open(`fb-messenger://share?link=${encodeURIComponent(store.referralLink)}`, "_blank");
}

onMounted(() => store.fetchStats());
</script>
