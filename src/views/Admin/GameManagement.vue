<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <div class="sticky top-0 z-50 px-4 h-14 flex items-center gap-3" style="background: rgba(10,14,26,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,212,255,0.1);">
      <button @click="$router.push('/admin')" class="text-xl" style="color: var(--volt-electric);">←</button>
      <span class="font-heading text-sm font-bold" style="color: var(--volt-white);">Game Management</span>
      <button class="ml-auto px-3 h-8 rounded-lg text-xs font-medium" style="background: var(--volt-gold); color: #050811;" @click="openAdd">+ ထည့်မည်</button>
    </div>

    <div class="px-4 pt-3 pb-8 max-w-lg mx-auto">
      <!-- Category Filter -->
      <div class="flex gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
        <button v-for="c in ['all','slot','live','fishing','crash','sport','lottery']" :key="c"
          class="flex-shrink-0 px-3 h-8 rounded-full text-xs font-medium transition-all"
          :style="catFilter === c ? 'background: var(--volt-gold); color: #050811;' : 'background: rgba(13,27,62,0.7); color: var(--volt-gray); border: 1px solid rgba(0,212,255,0.15);'"
          @click="catFilter = c; fetchGames()">
          {{ c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1) }}
        </button>
      </div>

      <div v-if="loading" class="space-y-2"><VoltSkeleton v-for="i in 5" :key="i" height="80px" /></div>

      <div v-else class="space-y-2">
        <div v-for="g in games" :key="g.id" class="glass-card flex items-center gap-3">
          <img :src="g.thumbnail_url || `https://placehold.co/48x64/0D1B3E/D4AF37?text=${encodeURIComponent(g.provider||'G')}`"
            class="w-12 h-16 object-cover rounded-xl flex-shrink-0" loading="lazy" />
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium truncate" style="color: var(--volt-white);">{{ g.name }}</div>
            <div class="text-xs mt-0.5" style="color: var(--volt-gray);">{{ g.provider }} · {{ g.category }}</div>
            <div class="flex gap-1.5 mt-1.5 flex-wrap">
              <span v-if="g.is_featured" class="text-xs px-1.5 rounded-full" style="background: rgba(212,175,55,0.15); color: var(--volt-gold);">Featured</span>
              <span v-if="g.is_new"      class="text-xs px-1.5 rounded-full" style="background: rgba(0,255,179,0.12); color: var(--volt-emerald);">New</span>
              <span v-if="g.is_hot"      class="text-xs px-1.5 rounded-full" style="background: rgba(255,61,90,0.12); color: var(--volt-red);">Hot</span>
              <span v-if="!g.is_active"  class="text-xs px-1.5 rounded-full" style="background: rgba(255,255,255,0.06); color: var(--volt-gray);">Inactive</span>
            </div>
          </div>
          <div class="flex flex-col gap-1.5 flex-shrink-0">
            <button class="w-16 h-7 rounded-lg text-xs font-medium" :style="g.is_active ? 'background: rgba(0,255,179,0.1); color: var(--volt-emerald);' : 'background: rgba(255,61,90,0.1); color: var(--volt-red);'" @click="toggleActive(g)">
              {{ g.is_active ? '✓ ON' : '✕ OFF' }}
            </button>
            <button class="w-16 h-7 rounded-lg text-xs font-medium" style="background: rgba(0,212,255,0.1); color: var(--volt-electric);" @click="openEdit(g)">✏️ Edit</button>
          </div>
        </div>
        <div v-if="games.length === 0" class="text-center py-12">
          <div class="text-4xl mb-2">🎮</div>
          <p class="text-sm" style="color: var(--volt-gray);">ဂိမ်း မရှိသေးပါ</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Game Modal -->
    <VoltModal v-model="showModal" :title="editTarget ? 'ဂိမ်း ပြင်မည်' : 'ဂိမ်း အသစ် ထည့်မည်'">
      <div class="space-y-2">
        <input v-model="form.name"          type="text"   placeholder="Game Name (EN)"  class="volt-input w-full h-10 px-3 rounded-xl text-xs outline-none" />
        <input v-model="form.name_mm"       type="text"   placeholder="Game Name (MM)"  class="volt-input w-full h-10 px-3 rounded-xl text-xs outline-none" />
        <input v-model="form.provider"      type="text"   placeholder="Provider"         class="volt-input w-full h-10 px-3 rounded-xl text-xs outline-none" />
        <input v-model="form.thumbnail_url" type="url"    placeholder="Thumbnail URL"    class="volt-input w-full h-10 px-3 rounded-xl text-xs outline-none" />
        <input v-model="form.launch_url"    type="url"    placeholder="Launch URL"       class="volt-input w-full h-10 px-3 rounded-xl text-xs outline-none" />
        <select v-model="form.category" class="volt-input w-full h-10 px-3 rounded-xl text-xs outline-none">
          <option v-for="c in ['slot','live','fishing','crash','sport','lottery']" :key="c" :value="c">{{ c }}</option>
        </select>
        <div class="flex gap-3 text-xs" style="color: var(--volt-gray);">
          <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" v-model="form.is_featured" class="accent-yellow-400" /> Featured</label>
          <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" v-model="form.is_new"      class="accent-yellow-400" /> New</label>
          <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" v-model="form.is_hot"      class="accent-yellow-400" /> Hot</label>
          <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" v-model="form.is_active"   class="accent-yellow-400" /> Active</label>
        </div>
      </div>
      <template #footer>
        <button class="btn-primary h-10 text-sm px-6" @click="saveGame" :disabled="saving">{{ saving ? '...' : 'သိမ်းမည်' }}</button>
      </template>
    </VoltModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import VoltSkeleton from "@/components/ui/VoltSkeleton.vue";
import VoltModal from "@/components/ui/VoltModal.vue";
import type { Game } from "@/stores/games.store";

const games = ref<Game[]>([]);
const loading = ref(false);
const catFilter = ref("all");
const showModal = ref(false);
const editTarget = ref<Game | null>(null);
const saving = ref(false);

const form = ref({ name: "", name_mm: "", provider: "", category: "slot" as Game["category"], thumbnail_url: "", launch_url: "", is_featured: false, is_new: false, is_hot: false, is_active: true });

async function fetchGames() {
  loading.value = true;
  let q = supabase.from("games").select("*").order("sort_order");
  if (catFilter.value !== "all") q = q.eq("category", catFilter.value);
  const { data } = await q;
  if (data) games.value = data as Game[];
  loading.value = false;
}

async function toggleActive(g: Game) {
  g.is_active = !g.is_active;
  await supabase.from("games").update({ is_active: g.is_active }).eq("id", g.id);
}

function openAdd() {
  editTarget.value = null;
  form.value = { name: "", name_mm: "", provider: "", category: "slot", thumbnail_url: "", launch_url: "", is_featured: false, is_new: false, is_hot: false, is_active: true };
  showModal.value = true;
}
function openEdit(g: Game) {
  editTarget.value = g;
  form.value = { name: g.name, name_mm: g.name_mm || "", provider: g.provider || "", category: g.category, thumbnail_url: g.thumbnail_url || "", launch_url: g.launch_url || "", is_featured: g.is_featured, is_new: g.is_new, is_hot: g.is_hot, is_active: g.is_active };
  showModal.value = true;
}
async function saveGame() {
  saving.value = true;
  if (editTarget.value) {
    await supabase.from("games").update({ ...form.value }).eq("id", editTarget.value.id);
  } else {
    await supabase.from("games").insert({ ...form.value, sort_order: games.value.length + 1 });
  }
  saving.value = false;
  showModal.value = false;
  fetchGames();
}

onMounted(fetchGames);
</script>

<style scoped>
.volt-input { background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.2); color: var(--volt-white); }
.volt-input:focus { outline: none; border-color: rgba(0,212,255,0.5); }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
