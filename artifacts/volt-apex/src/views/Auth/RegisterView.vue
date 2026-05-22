<template>
  <div class="min-h-screen relative flex flex-col items-center justify-center px-4 py-8 overflow-hidden" style="background: var(--volt-black);">
    <ParticleField />

    <div class="relative z-10 w-full max-w-sm anim-fade-in-up">
      <div class="text-center mb-6">
        <div class="logo-glass inline-block px-6 py-3 mb-2 cursor-pointer" @click="$router.push('/login')">
          <span class="font-heading text-2xl font-black text-gold-gradient tracking-widest">VOLT APEX</span>
        </div>
        <p class="text-xs" style="color: var(--volt-gray);">အကောင့်အသစ် ဖွင့်ရန်</p>
      </div>

      <div class="glass-card p-6 hud-bracket relative">
        <div class="scanning-line"></div>

        <div class="flex mb-6">
          <div v-for="s in 2" :key="s" class="flex-1 flex flex-col items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-all"
              :style="step >= s ? 'background: var(--volt-gold); color: #050811;' : 'background: rgba(0,212,255,0.1); color: var(--volt-gray); border: 1px solid rgba(0,212,255,0.2);'">
              {{ s }}
            </div>
            <span class="text-xs" :style="step >= s ? 'color: var(--volt-gold);' : 'color: var(--volt-gray);'">
              {{ s === 1 ? 'အချက်အလက်' : 'ရည်ညွှန်းကုဒ်' }}
            </span>
            <div v-if="s < 2" class="w-full h-px mt-2" :style="step > s ? 'background: var(--volt-gold);' : 'background: rgba(0,212,255,0.2);'"></div>
          </div>
        </div>

        <div v-if="step === 1">
          <div class="flex justify-center mb-5">
            <div class="nft-preview relative w-20 h-20">
              <img v-if="avatarUrl" :src="avatarUrl" class="w-20 h-20 rounded-full" :class="{ 'anim-float-y': !!avatarUrl }" />
              <div v-else class="w-20 h-20 rounded-full flex items-center justify-center text-2xl" style="background: rgba(13,27,62,0.8); border: 2px dashed rgba(0,212,255,0.3);">🎮</div>
              <div class="ring-anim absolute inset-0 rounded-full" v-if="avatarUrl"></div>
            </div>
          </div>
          <p class="text-center text-xs mb-4" style="color: var(--volt-gray);">Username ရိုက်သောအခါ Avatar အလိုအလျောက် ထွက်ပေါ်မည်</p>

          <div class="mb-4">
            <label class="block text-xs mb-1.5 font-medium" style="color: var(--volt-gray);">Username</label>
            <input v-model="username" type="text" placeholder="voltplayer01" maxlength="20"
              class="volt-input w-full h-12 px-4 rounded-xl text-sm outline-none"
              @input="onUsernameInput" />
            <p v-if="errors.username" class="text-xs mt-1" style="color: var(--volt-red);">{{ errors.username }}</p>
          </div>

          <div class="mb-4">
            <label class="block text-xs mb-1.5 font-medium" style="color: var(--volt-gray);">ဖုန်းနံပါတ်</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style="color: var(--volt-electric);">+95</span>
              <input v-model="phone" type="tel" placeholder="9xxxxxxxxx" inputmode="tel"
                class="volt-input w-full h-12 pl-12 pr-4 rounded-xl text-sm outline-none"
                @focus="errors.phone = ''" />
            </div>
            <p v-if="errors.phone" class="text-xs mt-1" style="color: var(--volt-red);">{{ errors.phone }}</p>
          </div>

          <div class="mb-4">
            <label class="block text-xs mb-1.5 font-medium" style="color: var(--volt-gray);">စကားဝှက်</label>
            <div class="relative">
              <input v-model="password" :type="showPwd ? 'text' : 'password'" placeholder="အနည်းဆုံး ၈ လုံး"
                class="volt-input w-full h-12 pl-4 pr-11 rounded-xl text-sm outline-none"
                @focus="errors.password = ''" />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2" style="color: var(--volt-gray);" @click="showPwd = !showPwd">
                {{ showPwd ? '🙈' : '👁️' }}
              </button>
            </div>
            <p v-if="errors.password" class="text-xs mt-1" style="color: var(--volt-red);">{{ errors.password }}</p>
          </div>

          <div class="mb-5">
            <label class="block text-xs mb-1.5 font-medium" style="color: var(--volt-gray);">စကားဝှက် အတည်ပြုပါ</label>
            <input v-model="confirm" :type="showPwd ? 'text' : 'password'" placeholder="ထပ်မံ ထည့်ပါ"
              class="volt-input w-full h-12 px-4 rounded-xl text-sm outline-none"
              @focus="errors.confirm = ''" />
            <p v-if="errors.confirm" class="text-xs mt-1" style="color: var(--volt-red);">{{ errors.confirm }}</p>
          </div>

          <button class="btn-primary anim-glow-pulse" @click="goStep2">
            နောက်တဆင့် →
          </button>
        </div>

        <div v-if="step === 2">
          <div class="mb-5">
            <button class="flex items-center gap-2 text-sm w-full p-3 rounded-xl transition-all"
              style="background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.15); color: var(--volt-electric);"
              @click="showReferral = !showReferral">
              <span>🎁 ရည်ညွှန်းကုဒ် ရှိပါသလား?</span>
              <span class="ml-auto transition-transform" :style="showReferral ? 'transform: rotate(180deg)' : ''">▾</span>
            </button>
            <transition name="slide-down">
              <div v-if="showReferral" class="mt-2 overflow-hidden">
                <input v-model="referralCode" type="text" placeholder="ရည်ညွှန်းကုဒ် ထည့်ပါ (ရွေးချယ်နိုင်)"
                  class="volt-input w-full h-12 px-4 rounded-xl text-sm outline-none" />
                <p class="text-xs mt-1.5" style="color: var(--volt-gray);">✓ ရည်ညွှန်းကုဒ် ထည့်ခြင်းဖြင့် Bonus ရရှိနိုင်သည်</p>
              </div>
            </transition>
          </div>

          <div class="mb-5 p-3 rounded-xl" style="background: rgba(0,255,179,0.05); border: 1px solid rgba(0,255,179,0.15);">
            <p class="text-xs" style="color: var(--volt-emerald);">✓ အကောင့်ဖွင့်ခ အခမဲ့</p>
            <p class="text-xs mt-1" style="color: var(--volt-gray);">⚡ ချက်ချင်း ကစားနိုင်သည် · 🔒 လုံခြုံသောချိတ်ဆက်မှု</p>
          </div>

          <div v-if="registerError" class="mb-3 p-3 rounded-xl text-sm text-center" style="background: rgba(255,61,90,0.1); border: 1px solid rgba(255,61,90,0.3); color: var(--volt-red);">
            {{ registerError }}
          </div>

          <button class="btn-primary anim-glow-pulse mb-3 flex items-center justify-center gap-2" @click="handleRegister" :disabled="regLoading">
            <span v-if="regLoading" class="spinner"></span>
            <span>{{ regLoading ? 'ဖွင့်နေသည်...' : 'အကောင့်ဖွင့်မည်' }}</span>
          </button>

          <button class="w-full text-sm py-2" style="color: var(--volt-gray);" @click="step = 1">
            ← နောက်သို့
          </button>
        </div>
      </div>

      <div class="mt-4 text-center">
        <button class="text-sm" style="color: var(--volt-gray);" @click="$router.push('/login')">
          အကောင့်ရှိပြီးသား? <span style="color: var(--volt-electric);">ဝင်ရောက်မည်</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import ParticleField from "@/components/three/ParticleField.vue";

const router = useRouter();
const auth = useAuthStore();
const ui = useUiStore();

const step = ref(1);
const username = ref("");
const phone = ref("");
const password = ref("");
const confirm = ref("");
const showPwd = ref(false);
const referralCode = ref("");
const showReferral = ref(false);
const avatarUrl = ref("");
const regLoading = ref(false);
const registerError = ref("");
const errors = ref({ username: "", phone: "", password: "", confirm: "" });

let debounceTimer: ReturnType<typeof setTimeout>;
function onUsernameInput() {
  errors.value.username = "";
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (username.value.length >= 3) {
      const seed = encodeURIComponent(username.value);
      avatarUrl.value = `https://api.dicebear.com/7.x/rings/svg?seed=${seed}&backgroundColor=0A0E1A&ringColors=D4AF37,00D4FF`;
    } else {
      avatarUrl.value = "";
    }
  }, 400);
}

function goStep2() {
  errors.value = { username: "", phone: "", password: "", confirm: "" };
  let valid = true;
  if (!username.value || username.value.length < 3) { errors.value.username = "Username အနည်းဆုံး ၃ လုံး"; valid = false; }
  if (!phone.value || phone.value.replace(/\D/g, "").length < 7) { errors.value.phone = "ဖုန်းနံပါတ် မှန်ကန်စွာ ထည့်ပါ"; valid = false; }
  if (!password.value || password.value.length < 8) { errors.value.password = "စကားဝှက် အနည်းဆုံး ၈ လုံး"; valid = false; }
  if (password.value !== confirm.value) { errors.value.confirm = "စကားဝှက် မကိုက်ညီပါ"; valid = false; }
  if (valid) step.value = 2;
}

async function handleRegister() {
  regLoading.value = true;
  registerError.value = "";
  const result = await auth.register({
    phone: phone.value,
    username: username.value,
    password: password.value,
    referralCode: referralCode.value || undefined,
  });
  regLoading.value = false;
  if (result.success) {
    ui.toast.success("အကောင့်ဖွင့်မှု အောင်မြင်ပါသည်! 🎉");
    router.push("/dashboard");
  } else {
    registerError.value = result.error || "အကောင့်ဖွင့်မှု မအောင်မြင်ပါ။ နောက်မှ ထပ်ကြိုးစားပါ";
  }
}
</script>

<style scoped>
.volt-input {
  background: rgba(5, 8, 17, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.2);
  color: var(--volt-white);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.volt-input:focus {
  border-color: rgba(0, 212, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.1);
}
.logo-glass {
  background: rgba(13, 27, 62, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
}
.nft-preview img { border: 2px solid rgba(212,175,55,0.4); }
.ring-anim {
  border: 2px solid transparent;
  border-top-color: var(--volt-electric);
  border-right-color: var(--volt-gold);
  animation: rotate-ring 3s linear infinite;
}
.slide-down-enter-active, .slide-down-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  max-height: 120px;
}
.slide-down-enter-from, .slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}
.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(5,8,17,0.3);
  border-top-color: #050811;
  border-radius: 50%;
  animation: rotate-ring 0.7s linear infinite;
}
</style>
