<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <TopNavBar />
    <div class="px-4 pt-4 pb-28 max-w-lg mx-auto">

      <!-- Avatar + Info -->
      <div class="glass-card hud-bracket relative overflow-hidden mb-4 text-center">
        <div class="scanning-line"></div>
        <div class="relative inline-block mb-3">
          <NftAvatar :src="auth.profile?.nft_avatar_url" :size="80" :online="true" />
          <div class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer" style="background: var(--volt-gold);" @click="refreshAvatar">
            <span class="text-xs">🎲</span>
          </div>
        </div>
        <div class="font-heading text-lg font-black" style="color: var(--volt-white);">{{ auth.profile?.username }}</div>
        <div class="text-sm mt-0.5 mb-3" style="color: var(--volt-electric);">{{ auth.profile?.phone_number }}</div>
        <div class="flex justify-center gap-2 flex-wrap mb-3">
          <span class="px-3 py-1 rounded-full text-xs font-medium" :style="tierStyle">{{ tierLabel }}</span>
          <span v-if="auth.profile?.role === 'admin'" class="px-3 py-1 rounded-full text-xs font-medium" style="background: rgba(255,61,90,0.15); color: var(--volt-red); border: 1px solid rgba(255,61,90,0.3);">ADMIN</span>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div class="p-2 rounded-xl" style="background: rgba(5,8,17,0.6);">
            <div class="font-number text-base font-black text-gold-gradient">{{ (auth.profile?.balance || 0).toLocaleString() }}</div>
            <div class="text-xs" style="color: var(--volt-gray);">ငွေကျန် (MMK)</div>
          </div>
          <div class="p-2 rounded-xl" style="background: rgba(5,8,17,0.6);">
            <div class="font-number text-base font-black" style="color: var(--volt-emerald);">{{ (auth.profile?.total_deposited || 0 / 1000).toFixed(1) }}K</div>
            <div class="text-xs" style="color: var(--volt-gray);">Total Deposit</div>
          </div>
          <div class="p-2 rounded-xl" style="background: rgba(5,8,17,0.6);">
            <div class="font-number text-base font-black" style="color: var(--volt-electric);">{{ referralCount }}</div>
            <div class="text-xs" style="color: var(--volt-gray);">Referrals</div>
          </div>
        </div>
      </div>

      <!-- Referral Code -->
      <div class="glass-card mb-4">
        <div class="text-xs mb-2 font-medium" style="color: var(--volt-electric);">🔗 ကျွန်ုပ်၏ Referral Code</div>
        <div class="flex items-center gap-2 p-3 rounded-xl" style="background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.15);">
          <span class="font-number text-lg font-black flex-1 text-center" style="color: var(--volt-gold); letter-spacing: 4px;">{{ auth.profile?.referral_code || '——' }}</span>
          <button class="px-3 py-1.5 rounded-lg text-xs font-medium" style="background: rgba(0,212,255,0.1); color: var(--volt-electric);" @click="copyCode">{{ copied ? '✓' : '📋' }}</button>
        </div>
      </div>

      <!-- Change Password -->
      <div class="glass-card mb-4">
        <div class="text-xs mb-3 font-medium" style="color: var(--volt-electric);">🔐 စကားဝှက် ပြောင်းရန်</div>
        <div class="space-y-2">
          <input v-model="newPassword" type="password" placeholder="စကားဝှက် အသစ်" class="volt-input w-full h-11 px-4 rounded-xl text-sm outline-none" />
          <input v-model="confirmPassword" type="password" placeholder="အတည်ပြုပါ" class="volt-input w-full h-11 px-4 rounded-xl text-sm outline-none" />
          <div v-if="pwError" class="text-xs text-center" style="color: var(--volt-red);">{{ pwError }}</div>
          <button class="btn-primary h-10 text-sm" @click="changePassword" :disabled="changingPw">
            {{ changingPw ? '...' : 'ပြောင်းမည်' }}
          </button>
        </div>
      </div>

      <!-- Verify Phone (optional) -->
      <div class="glass-card mb-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs font-medium mb-0.5" style="color: var(--volt-electric);">📱 ဖုန်းနံပါတ် အတည်ပြုချက်</div>
            <div class="text-xs" style="color: var(--volt-gray);">{{ auth.profile?.phone_number }}</div>
          </div>
          <span class="text-xs px-2 py-1 rounded-full" style="background: rgba(0,255,179,0.1); color: var(--volt-emerald); border: 1px solid rgba(0,255,179,0.2);">✓ အတည်ပြုပြီး</span>
        </div>
      </div>

      <!-- Settings Menu -->
      <div class="glass-card mb-4">
        <div class="divide-y" style="--tw-divide-opacity: 0.08; --tw-divide-color: rgba(0,212,255, var(--tw-divide-opacity));">
          <button v-for="item in menuItems" :key="item.label" class="w-full flex items-center gap-3 py-3 first:pt-0 last:pb-0" @click="item.action()">
            <span class="text-base w-7">{{ item.icon }}</span>
            <span class="flex-1 text-sm text-left" style="color: var(--volt-white);">{{ item.label }}</span>
            <span style="color: var(--volt-gray);">›</span>
          </button>
        </div>
      </div>

      <!-- Logout -->
      <button class="w-full h-12 rounded-xl text-sm font-bold" style="background: rgba(255,61,90,0.1); color: var(--volt-red); border: 1px solid rgba(255,61,90,0.2);" @click="handleLogout">
        🚪 ထွက်မည်
      </button>
    </div>
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import { supabase } from "@/lib/supabase";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";
import NftAvatar from "@/components/ui/NftAvatar.vue";

const router = useRouter();
const auth = useAuthStore();
const ui = useUiStore();

const copied = ref(false);
const newPassword = ref("");
const confirmPassword = ref("");
const pwError = ref("");
const changingPw = ref(false);
const referralCount = ref(0);

const tierMap: Record<string, { label: string; style: string }> = {
  standard: { label: "Standard ✦",   style: "background: rgba(255,255,255,0.05); color: var(--volt-gray); border: 1px solid rgba(255,255,255,0.1);" },
  silver:   { label: "Silver ⭐",    style: "background: rgba(192,192,192,0.1); color: #C0C0C0; border: 1px solid rgba(192,192,192,0.2);" },
  gold:     { label: "Gold 🏅",      style: "background: rgba(212,175,55,0.12); color: var(--volt-gold); border: 1px solid rgba(212,175,55,0.25);" },
  platinum: { label: "Platinum 💎",  style: "background: rgba(0,212,255,0.1); color: var(--volt-electric); border: 1px solid rgba(0,212,255,0.2);" },
};
const tierLabel = computed(() => tierMap[auth.profile?.affiliate_tier || "standard"]?.label || "Standard");
const tierStyle  = computed(() => tierMap[auth.profile?.affiliate_tier || "standard"]?.style || "");

function copyCode() {
  navigator.clipboard.writeText(auth.profile?.referral_code || "").catch(() => {});
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

function refreshAvatar() {
  const seed = Math.random().toString(36).substring(2, 8);
  if (auth.profile) {
    const newUrl = `https://api.dicebear.com/7.x/rings/svg?seed=${seed}`;
    supabase.from("users").update({ nft_avatar_url: newUrl }).eq("id", auth.user!.id);
    auth.profile.nft_avatar_url = newUrl;
  }
}

async function changePassword() {
  pwError.value = "";
  if (newPassword.value.length < 8) { pwError.value = "အနည်းဆုံး 8 လုံး ရှိရမည်"; return; }
  if (newPassword.value !== confirmPassword.value) { pwError.value = "စကားဝှက် မတူပါ"; return; }
  changingPw.value = true;
  const { error } = await supabase.auth.updateUser({ password: newPassword.value });
  changingPw.value = false;
  if (error) { pwError.value = error.message; return; }
  ui.toast.success("စကားဝှက် ပြောင်းပြီးပါပြီ 🔐");
  newPassword.value = ""; confirmPassword.value = "";
}

async function handleLogout() {
  await auth.logout();
  router.push("/login");
}

const menuItems = [
  { icon: "📋", label: "မှတ်တမ်းများ", action: () => router.push("/transactions") },
  { icon: "🎁", label: "Bonus & Promotions", action: () => router.push("/bonuses") },
  { icon: "🔗", label: "Affiliate Hub", action: () => router.push("/affiliate") },
  { icon: "💬", label: "Customer Service (Viber)", action: () => window.open("viber://contact?number=%2B959750000001", "_blank") },
];

onMounted(async () => {
  if (!auth.user) return;
  const { count } = await supabase.from("users").select("id", { count: "exact", head: true }).eq("referred_by", auth.user.id);
  referralCount.value = count || 0;
});
</script>

<style scoped>
.volt-input { background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.2); color: var(--volt-white); transition: border-color 0.2s; }
.volt-input:focus { border-color: rgba(0,212,255,0.5); outline: none; }
</style>
