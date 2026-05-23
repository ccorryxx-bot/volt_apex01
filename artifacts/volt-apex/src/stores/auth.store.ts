import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, type UserProfile } from "@/lib/supabase";

function generateReferralCode(): string {
  return "VA" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const profile = ref<UserProfile | null>(null);
  const session = ref<Session | null>(null);
  const initialized = ref(false);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => profile.value?.role === "admin");
  const isAgent = computed(() => profile.value?.role === "agent" || profile.value?.role === "admin");

  async function init() {
    if (initialized.value) return;
    const { data } = await supabase.auth.getSession();
    session.value = data.session;
    user.value = data.session?.user ?? null;
    if (user.value) await fetchProfile();
    initialized.value = true;

    supabase.auth.onAuthStateChange(async (_event, s) => {
      session.value = s;
      user.value = s?.user ?? null;
      if (user.value) {
        await fetchProfile();
      } else {
        profile.value = null;
      }
    });
  }

  async function fetchProfile() {
    if (!user.value) return;
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.value.id)
      .single();
    if (data) profile.value = data as UserProfile;
  }

  async function login(phone: string, password: string) {
    loading.value = true;
    try {
      const email = phoneToEmail(phone);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      user.value = data.user;
      session.value = data.session;
      await fetchProfile();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: translateError(err.message) };
    } finally {
      loading.value = false;
    }
  }

  async function register(payload: {
    phone: string;
    username: string;
    password: string;
    referralCode?: string;
  }) {
    loading.value = true;
    try {
      const email = phoneToEmail(payload.phone);
      const cleanPhone = payload.phone.replace(/\D/g, "");

      // Check username uniqueness
      const { data: existing } = await supabase.from("users").select("id").eq("username", payload.username).limit(1);
      if (existing && existing.length > 0) throw new Error("Username ရှိပြီး ဖြစ်သည်");

      // Check phone uniqueness
      const { data: existingPhone } = await supabase.from("users").select("id").eq("phone_number", cleanPhone).limit(1);
      if (existingPhone && existingPhone.length > 0) throw new Error("ဖုန်းနံပါတ် ရှိပြီး ဖြစ်သည်");

      // Find referrer
      let referrerId: string | null = null;
      if (payload.referralCode) {
        const { data: referrer } = await supabase.from("users").select("id").eq("referral_code", payload.referralCode.toUpperCase()).single();
        if (referrer) referrerId = referrer.id;
      }

      const avatarSeed = payload.username.toLowerCase().replace(/\s/g, "");
      const avatarUrl = `https://api.dicebear.com/7.x/rings/svg?seed=${avatarSeed}`;
      const refCode = generateReferralCode();

      const { data, error } = await supabase.auth.signUp({
        email,
        password: payload.password,
        options: {
          data: {
            username: payload.username,
            phone_number: cleanPhone,
          },
          emailRedirectTo: undefined,
        },
      });
      if (error) throw error;

      const authUser = data.user;
      if (authUser) {
        // Manually insert into users table (needed if trigger not set up)
        await supabase.from("users").upsert({
          id: authUser.id,
          username: payload.username,
          phone_number: cleanPhone,
          email,
          role: "player",
          balance: 0,
          bonus_balance: 0,
          total_deposited: 0,
          total_withdrawn: 0,
          affiliate_tier: "standard",
          referral_code: refCode,
          referred_by: referrerId,
          nft_avatar_url: avatarUrl,
          is_active: true,
          is_banned: false,
        });

        user.value = authUser;
        session.value = data.session;
        await fetchProfile();
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: translateError(err.message) };
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    user.value = null;
    session.value = null;
    profile.value = null;
  }

  async function refreshProfile() {
    await fetchProfile();
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!user.value) return;
    const { error } = await supabase.from("users").update(updates).eq("id", user.value.id);
    if (!error) await fetchProfile();
    return !error;
  }

  function phoneToEmail(phone: string) {
    const clean = phone.replace(/\D/g, "");
    return `${clean}@voltapex.mm`;
  }

  function translateError(msg: string): string {
    if (msg.includes("Invalid login credentials")) return "ဖုန်းနံပါတ် သို့မဟုတ် စကားဝှက် မမှန်ကန်ပါ";
    if (msg.includes("Email not confirmed"))       return "Email မှ Confirm မပြုလုပ်သေးပါ";
    if (msg.includes("User already registered"))   return "ဖုန်းနံပါတ် ရှိပြီး ဖြစ်သည်";
    if (msg.includes("Password should be"))        return "စကားဝှက် အနည်းဆုံး 6 လုံး ရှိရမည်";
    return msg;
  }

  return {
    user, profile, session, initialized, loading,
    isAuthenticated, isAdmin, isAgent,
    init, login, register, logout, refreshProfile, fetchProfile, updateProfile,
  };
});
