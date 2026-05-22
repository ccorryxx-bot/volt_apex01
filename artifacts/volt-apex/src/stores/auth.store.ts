import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, type UserProfile } from "@/lib/supabase";

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
      return { success: false, error: err.message };
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password: payload.password,
        options: {
          data: {
            username: payload.username,
            phone_number: payload.phone,
            referral_code: payload.referralCode,
          },
        },
      });
      if (error) throw error;
      user.value = data.user;
      session.value = data.session;
      if (user.value) await fetchProfile();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
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

  function phoneToEmail(phone: string) {
    const clean = phone.replace(/\D/g, "");
    return `${clean}@voltapex.mm`;
  }

  return {
    user,
    profile,
    session,
    initialized,
    loading,
    isAuthenticated,
    isAdmin,
    isAgent,
    init,
    login,
    register,
    logout,
    refreshProfile,
    fetchProfile,
  };
});
