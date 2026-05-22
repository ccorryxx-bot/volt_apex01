<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <TopNavBar />
    <div class="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <h2 class="font-heading text-base tracking-wider mb-4" style="color: var(--volt-electric);">💰 ငွေသွင်းမည်</h2>

      <div class="grid grid-cols-2 gap-2 mb-4">
        <button v-for="m in methods" :key="m.key"
          class="flex flex-col items-center p-3 rounded-xl transition-all"
          :style="selected === m.key ? `background: rgba(212,175,55,0.15); border: 1px solid var(--volt-gold); color: var(--volt-gold);` : `background: rgba(13,27,62,0.7); border: 1px solid rgba(0,212,255,0.15); color: var(--volt-gray);`"
          @click="selected = m.key">
          <span class="text-2xl mb-1">{{ m.icon }}</span>
          <span class="text-sm font-medium">{{ m.name }}</span>
        </button>
      </div>

      <transition name="slide-down">
        <div v-if="selected" class="glass-card mb-4">
          <div class="text-center mb-3">
            <p class="text-xs mb-2" style="color: var(--volt-gray);">{{ selectedMethod?.name }} ကို ငွေလွှဲပါ</p>
            <div class="font-number text-xl font-bold" style="color: var(--volt-gold);">09-xxx-xxxx</div>
            <p class="text-xs mt-1" style="color: var(--volt-gray);">VOLT APEX</p>
          </div>
          <div class="border-t my-3" style="border-color: rgba(0,212,255,0.1);"></div>
          <div class="space-y-3">
            <div>
              <label class="block text-xs mb-1.5" style="color: var(--volt-gray);">ငွေပမာဏ (MMK)</label>
              <input v-model="amount" type="number" placeholder="10000" inputmode="numeric"
                class="volt-input w-full h-11 px-4 rounded-xl text-sm outline-none" />
            </div>
            <div>
              <label class="block text-xs mb-1.5" style="color: var(--volt-gray);">Reference နံပါတ်</label>
              <input v-model="refNo" type="text" placeholder="Transaction ID"
                class="volt-input w-full h-11 px-4 rounded-xl text-sm outline-none" />
            </div>
            <div>
              <label class="block text-xs mb-1.5" style="color: var(--volt-gray);">Screenshot တင်မည်</label>
              <div class="upload-zone" @click="triggerUpload" @dragover.prevent @drop.prevent="onDrop">
                <img v-if="previewImg" :src="previewImg" class="w-full h-full object-cover rounded-lg" />
                <div v-else class="flex flex-col items-center gap-1">
                  <span class="text-2xl">📷</span>
                  <span class="text-xs" style="color: var(--volt-gray);">Tap ထိ Upload</span>
                </div>
              </div>
              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
            </div>
          </div>
          <div class="mt-3 p-2 rounded-lg text-xs" style="background: rgba(0,212,255,0.05); color: var(--volt-gray);">
            🔒 လုံခြုံသောငွေပေးချေမှု · ၁၅ မိနစ်အတွင်း အတည်ပြုမည်
          </div>
          <button class="btn-primary mt-3 anim-glow-pulse flex items-center justify-center gap-2" @click="submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'တင်သွင်းနေသည်...' : 'Submit လုပ်မည်' }}
          </button>
        </div>
      </transition>

      <div v-if="!selected" class="text-center py-8">
        <p class="text-sm" style="color: var(--volt-gray);">ငွေပေးချေနည်း ရွေးချယ်ပါ ↑</p>
      </div>
    </div>
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useUiStore } from "@/stores/ui.store";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";

const ui = useUiStore();
const selected = ref("");
const amount = ref("");
const refNo = ref("");
const previewImg = ref("");
const loading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const methods = [
  { key: "kpay", name: "KPay", icon: "💙" },
  { key: "wave", name: "Wave Pay", icon: "💚" },
  { key: "cbpay", name: "CB Pay", icon: "🟡" },
  { key: "uabpay", name: "UAB Pay", icon: "🔵" },
];

const selectedMethod = computed(() => methods.find(m => m.key === selected.value));

function triggerUpload() { fileInput.value?.click(); }
function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) previewImg.value = URL.createObjectURL(f);
}
function onDrop(e: DragEvent) {
  const f = e.dataTransfer?.files?.[0];
  if (f) previewImg.value = URL.createObjectURL(f);
}

async function submit() {
  if (!amount.value || !refNo.value) { ui.toast.error("အချက်အလက်များ ဖြည့်ပါ"); return; }
  loading.value = true;
  await new Promise(r => setTimeout(r, 1500));
  loading.value = false;
  ui.toast.success("ငွေသွင်းမှု တင်သွင်းမှု အောင်မြင်ပါသည်! Admin မှ စစ်ဆေးမည်");
  selected.value = ""; amount.value = ""; refNo.value = ""; previewImg.value = "";
}
</script>

<style scoped>
.volt-input { background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.2); color: var(--volt-white); }
.volt-input:focus { border-color: rgba(0,212,255,0.5); outline: none; }
.upload-zone {
  width: 100%; height: 100px; border-radius: 12px;
  border: 2px dashed rgba(0,212,255,0.3);
  background: rgba(5,8,17,0.6);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; overflow: hidden; transition: border-color 0.2s;
}
.upload-zone:hover { border-color: rgba(0,212,255,0.6); }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; overflow: hidden; max-height: 600px; }
.slide-down-enter-from, .slide-down-leave-to { max-height: 0; opacity: 0; }
.spinner { width: 18px; height: 18px; border: 2px solid rgba(5,8,17,0.3); border-top-color: #050811; border-radius: 50%; animation: rotate-ring 0.7s linear infinite; }
</style>
