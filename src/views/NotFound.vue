<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4" style="background: var(--volt-black);">
    <div class="text-center anim-fade-in-up">
      <div class="font-heading text-8xl font-black text-gold-gradient mb-4">404</div>
      <h2 class="font-heading text-xl mb-3" style="color: var(--volt-electric);">စာမျက်နှာ မတွေ့ပါ</h2>
      <p class="text-sm mb-6" style="color: var(--volt-gray);">သင်ရှာနေသောစာမျက်နှာ မရှိပါ</p>
      <button class="btn-primary w-40" @click="$router.push('/dashboard')">ပင်မစာမျက်နှာ</button>
    </div>
  </div>
</template>
