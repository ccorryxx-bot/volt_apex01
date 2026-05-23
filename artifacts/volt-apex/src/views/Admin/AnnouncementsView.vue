<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <div class="sticky top-0 z-50 px-4 h-14 flex items-center gap-3" style="background: rgba(10,14,26,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,212,255,0.1);">
      <button @click="$router.push('/admin')" class="text-xl" style="color: var(--volt-electric);">←</button>
      <span class="font-heading text-sm font-bold" style="color: var(--volt-white);">Announcements</span>
      <button class="ml-auto px-3 h-8 rounded-lg text-xs font-medium" style="background: var(--volt-gold); color: #050811;" @click="openAdd">+ ထည့်မည်</button>
    </div>

    <div class="px-4 pt-3 pb-8 max-w-lg mx-auto">
      <div v-if="loading" class="space-y-2"><VoltSkeleton v-for="i in 4" :key="i" height="100px" /></div>
      <div v-else class="space-y-2">
        <div v-for="a in announcements" :key="a.id" class="glass-card">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1 pr-3">
              <div class="text-sm font-medium" style="color: var(--volt-white);">{{ a.title_mm || a.title }}</div>
              <div class="text-xs mt-1 line-clamp-2" style="color: var(--volt-gray);">{{ a.content_mm || a.content }}</div>
            </div>
            <div class="flex flex-col gap-1 items-end">
              <span class="text-xs px-2 py-0.5 rounded-full" :style="a.type === 'ticker' ? 'background: rgba(0,212,255,0.1); color: var(--volt-electric);' : 'background: rgba(212,175,55,0.1); color: var(--volt-gold);'">{{ a.type }}</span>
              <button class="w-14 h-6 rounded-md text-xs" :style="a.is_active ? 'background: rgba(0,255,179,0.1); color: var(--volt-emerald);' : 'background: rgba(255,61,90,0.1); color: var(--volt-red);'" @click="toggleActive(a)">{{ a.is_active ? 'Active' : 'Off' }}</button>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="flex-1 h-8 rounded-lg text-xs font-medium" style="background: rgba(0,212,255,0.08); color: var(--volt-electric);" @click="openEdit(a)">✏️ ပြင်မည်</button>
            <button class="flex-1 h-8 rounded-lg text-xs font-medium" style="background: rgba(255,61,90,0.08); color: var(--volt-red);" @click="deleteAnn(a.id)">🗑 ဖျက်မည်</button>
          </div>
        </div>
        <div v-if="announcements.length === 0" class="text-center py-12">
          <div class="text-4xl mb-2">📢</div>
          <p class="text-sm" style="color: var(--volt-gray);">Announcement မရှိသေးပါ</p>
        </div>
      </div>
    </div>

    <VoltModal v-model="showModal" :title="editTarget ? 'Announcement ပြင်မည်' : 'Announcement ထည့်မည်'">
      <div class="space-y-2">
        <input v-model="form.title_mm" type="text" placeholder="ခေါင်းစဉ် (Myanmar)" class="volt-input w-full h-10 px-3 rounded-xl text-sm outline-none" />
        <textarea v-model="form.content_mm" rows="3" placeholder="အကြောင်းအရာ (Myanmar)" class="volt-input w-full p-3 rounded-xl text-sm outline-none resize-none"></textarea>
        <select v-model="form.type" class="volt-input w-full h-10 px-3 rounded-xl text-sm outline-none">
          <option value="ticker">Ticker (ပရောလိပ်ကြည့်)</option>
          <option value="popup">Popup</option>
          <option value="banner">Banner</option>
        </select>
        <label class="flex items-center gap-2 text-sm cursor-pointer" style="color: var(--volt-gray);">
          <input type="checkbox" v-model="form.is_active" class="accent-yellow-400" /> Active ဖြစ်မည်
        </label>
      </div>
      <template #footer>
        <button class="btn-primary h-10 px-6 text-sm" @click="save" :disabled="saving">{{ saving ? '...' : 'သိမ်းမည်' }}</button>
      </template>
    </VoltModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import VoltSkeleton from "@/components/ui/VoltSkeleton.vue";
import VoltModal from "@/components/ui/VoltModal.vue";
import type { Announcement } from "@/stores/announcements.store";

const announcements = ref<Announcement[]>([]);
const loading = ref(false);
const showModal = ref(false);
const editTarget = ref<Announcement | null>(null);
const saving = ref(false);
const form = ref({ title_mm: "", content_mm: "", type: "ticker" as Announcement["type"], is_active: true, priority: 1 });

async function fetchAnn() {
  loading.value = true;
  const { data } = await supabase.from("announcements").select("*").order("priority");
  if (data) announcements.value = data as Announcement[];
  loading.value = false;
}
async function toggleActive(a: Announcement) {
  a.is_active = !a.is_active;
  await supabase.from("announcements").update({ is_active: a.is_active }).eq("id", a.id);
}
async function deleteAnn(id: string) {
  await supabase.from("announcements").delete().eq("id", id);
  announcements.value = announcements.value.filter(a => a.id !== id);
}
function openAdd() { editTarget.value = null; form.value = { title_mm: "", content_mm: "", type: "ticker", is_active: true, priority: announcements.value.length + 1 }; showModal.value = true; }
function openEdit(a: Announcement) { editTarget.value = a; form.value = { title_mm: a.title_mm || "", content_mm: a.content_mm || "", type: a.type, is_active: a.is_active, priority: a.priority }; showModal.value = true; }
async function save() {
  saving.value = true;
  if (editTarget.value) await supabase.from("announcements").update({ ...form.value }).eq("id", editTarget.value.id);
  else await supabase.from("announcements").insert({ ...form.value });
  saving.value = false; showModal.value = false; fetchAnn();
}

onMounted(fetchAnn);
</script>

<style scoped>
.volt-input { background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.2); color: var(--volt-white); }
.volt-input:focus { outline: none; border-color: rgba(0,212,255,0.5); }
</style>
