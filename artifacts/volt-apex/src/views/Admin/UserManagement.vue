<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <div class="sticky top-0 z-50 px-4 h-14 flex items-center gap-3" style="background: rgba(10,14,26,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,212,255,0.1);">
      <button @click="$router.push('/admin')" class="text-xl" style="color: var(--volt-electric);">←</button>
      <span class="font-heading text-sm font-bold" style="color: var(--volt-white);">User Management</span>
      <span class="ml-auto font-number text-sm" style="color: var(--volt-gold);">{{ totalCount }} ဦး</span>
    </div>

    <div class="px-4 pt-3 pb-8 max-w-lg mx-auto">
      <!-- Search + Filter -->
      <div class="flex gap-2 mb-4">
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
          <input v-model="search" type="search" placeholder="Username / Phone ရှာမည်" class="volt-input w-full h-10 pl-9 pr-3 rounded-xl text-sm outline-none" @input="debouncedSearch" />
        </div>
        <select v-model="roleFilter" class="volt-input h-10 px-3 rounded-xl text-xs outline-none" @change="fetchUsers">
          <option value="">အားလုံး</option>
          <option value="player">Player</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
        </select>
      </div>

      <div v-if="loading" class="space-y-2">
        <VoltSkeleton v-for="i in 5" :key="i" height="72px" radius="12px" />
      </div>

      <div v-else class="space-y-2">
        <div v-for="u in users" :key="u.id"
          class="glass-card cursor-pointer"
          :class="{ 'expanded': expanded === u.id }"
          @click="expanded = expanded === u.id ? '' : u.id">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0"
              :style="`background: ${u.role === 'admin' ? 'rgba(255,61,90,0.15)' : 'rgba(0,212,255,0.12)'}; color: ${u.role === 'admin' ? 'var(--volt-red)' : 'var(--volt-electric)'}`">
              {{ u.username?.charAt(0)?.toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-sm font-medium truncate" style="color: var(--volt-white);">{{ u.username }}</span>
                <span v-if="u.role !== 'player'" class="text-xs px-1.5 rounded-full" :style="u.role === 'admin' ? 'background: rgba(255,61,90,0.12); color: var(--volt-red);' : 'background: rgba(0,212,255,0.1); color: var(--volt-electric);'">{{ u.role }}</span>
                <span v-if="u.is_banned" class="text-xs px-1.5 rounded-full" style="background: rgba(255,61,90,0.15); color: var(--volt-red);">BANNED</span>
              </div>
              <div class="text-xs truncate mt-0.5" style="color: var(--volt-gray);">{{ u.phone_number }} · {{ u.affiliate_tier }}</div>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="font-number text-sm font-bold text-gold-gradient">{{ (u.balance / 1000).toFixed(1) }}K</div>
              <div class="text-xs" style="color: var(--volt-gray);">Balance</div>
            </div>
          </div>

          <transition name="slide">
            <div v-if="expanded === u.id" class="mt-3 pt-3 border-t space-y-2" style="border-color: rgba(0,212,255,0.1);">
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div><span style="color: var(--volt-gray);">Total Deposit: </span><span class="font-bold" style="color: var(--volt-emerald);">{{ (u.total_deposited / 1000).toFixed(1) }}K</span></div>
                <div><span style="color: var(--volt-gray);">Total Withdraw: </span><span class="font-bold" style="color: var(--volt-red);">{{ (u.total_withdrawn / 1000).toFixed(1) }}K</span></div>
                <div><span style="color: var(--volt-gray);">Bonus Bal: </span><span class="font-bold" style="color: var(--volt-electric);">{{ (u.bonus_balance / 1000).toFixed(1) }}K</span></div>
                <div><span style="color: var(--volt-gray);">Joined: </span><span style="color: var(--volt-white);">{{ new Date(u.created_at).toLocaleDateString() }}</span></div>
              </div>
              <div class="flex gap-2 mt-2">
                <button class="flex-1 h-8 rounded-lg text-xs font-medium" style="background: rgba(0,212,255,0.1); color: var(--volt-electric); border: 1px solid rgba(0,212,255,0.2);" @click.stop="openAdjust(u)">💰 ငွေ Adjust</button>
                <button class="flex-1 h-8 rounded-lg text-xs font-medium" :style="u.is_banned ? 'background: rgba(0,255,179,0.1); color: var(--volt-emerald); border: 1px solid rgba(0,255,179,0.2);' : 'background: rgba(255,61,90,0.1); color: var(--volt-red); border: 1px solid rgba(255,61,90,0.2);'" @click.stop="toggleBan(u)">
                  {{ u.is_banned ? '✓ Unban' : '🚫 Ban' }}
                </button>
              </div>
            </div>
          </transition>
        </div>

        <div v-if="users.length === 0" class="text-center py-12">
          <div class="text-4xl mb-2">👥</div>
          <p class="text-sm" style="color: var(--volt-gray);">User မတွေ့ပါ</p>
        </div>

        <button v-if="hasMore" class="w-full mt-2 py-3 text-sm" style="color: var(--volt-electric); border: 1px solid rgba(0,212,255,0.15); border-radius: 12px;" @click="loadMore">နောက်ထပ် ↓</button>
      </div>
    </div>

    <!-- Balance Adjust Modal -->
    <VoltModal v-model="showAdjustModal" :title="`Balance Adjust — ${adjustTarget?.username}`">
      <div class="space-y-3">
        <div class="text-sm" style="color: var(--volt-gray);">လက်ရှိ Balance: <span class="font-number font-bold" style="color: var(--volt-gold);">{{ (adjustTarget?.balance || 0).toLocaleString() }} K</span></div>
        <select v-model="adjustType" class="volt-input w-full h-10 px-3 rounded-xl text-sm outline-none">
          <option value="add">ငွေ ထည့်မည် (+)</option>
          <option value="deduct">ငွေ နှုတ်မည် (-)</option>
        </select>
        <input v-model="adjustAmount" type="number" placeholder="ပမာဏ" class="volt-input w-full h-10 px-4 rounded-xl text-sm outline-none" />
        <input v-model="adjustNote" type="text" placeholder="ကြောင်း (Admin Note)" class="volt-input w-full h-10 px-4 rounded-xl text-sm outline-none" />
      </div>
      <template #footer>
        <button class="btn-primary h-11 text-sm px-6" @click="confirmAdjust" :disabled="adjusting">
          {{ adjusting ? '...' : 'Adjust မည်' }}
        </button>
      </template>
    </VoltModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";
import VoltSkeleton from "@/components/ui/VoltSkeleton.vue";
import VoltModal from "@/components/ui/VoltModal.vue";

const authStore = useAuthStore();
const users = ref<any[]>([]);
const loading = ref(false);
const expanded = ref("");
const search = ref("");
const roleFilter = ref("");
const totalCount = ref(0);
const hasMore = ref(false);
const offset = ref(0);
const LIMIT = 20;

const showAdjustModal = ref(false);
const adjustTarget = ref<any>(null);
const adjustType = ref("add");
const adjustAmount = ref("");
const adjustNote = ref("");
const adjusting = ref(false);

let debounceTimer: any;
function debouncedSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => { offset.value = 0; users.value = []; fetchUsers(); }, 400);
}

async function fetchUsers() {
  loading.value = true;
  let q = supabase.from("users").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(offset.value, offset.value + LIMIT - 1);
  if (search.value) q = q.or(`username.ilike.%${search.value}%,phone_number.ilike.%${search.value}%`);
  if (roleFilter.value) q = q.eq("role", roleFilter.value);
  const { data, count } = await q;
  if (data) users.value = offset.value === 0 ? data : [...users.value, ...data];
  totalCount.value = count || 0;
  hasMore.value = (offset.value + LIMIT) < (count || 0);
  loading.value = false;
}
function loadMore() { offset.value += LIMIT; fetchUsers(); }

async function toggleBan(u: any) {
  await supabase.from("users").update({ is_banned: !u.is_banned }).eq("id", u.id);
  u.is_banned = !u.is_banned;
}
function openAdjust(u: any) { adjustTarget.value = u; adjustAmount.value = ""; adjustNote.value = ""; adjustType.value = "add"; showAdjustModal.value = true; }
async function confirmAdjust() {
  if (!adjustTarget.value || !Number(adjustAmount.value)) return;
  adjusting.value = true;
  const delta = adjustType.value === "add" ? Number(adjustAmount.value) : -Number(adjustAmount.value);
  const newBal = (adjustTarget.value.balance || 0) + delta;
  await supabase.from("users").update({ balance: newBal }).eq("id", adjustTarget.value.id);
  await supabase.from("transactions").insert({ user_id: adjustTarget.value.id, type: adjustType.value === "add" ? "bonus" : "withdraw", amount: Math.abs(delta), status: "approved", admin_note: adjustNote.value || "Admin Adjust", processed_by: authStore.user?.id });
  adjustTarget.value.balance = newBal;
  adjusting.value = false;
  showAdjustModal.value = false;
}

onMounted(fetchUsers);
</script>

<style scoped>
.volt-input { background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.2); color: var(--volt-white); }
.volt-input:focus { border-color: rgba(0,212,255,0.5); outline: none; }
.slide-enter-active, .slide-leave-active { transition: max-height 0.3s ease, opacity 0.3s; overflow: hidden; max-height: 300px; }
.slide-enter-from, .slide-leave-to { max-height: 0; opacity: 0; }
</style>
