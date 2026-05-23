import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/lib/supabase";

export interface Announcement {
  id: string;
  title?: string;
  title_mm?: string;
  content?: string;
  content_mm?: string;
  type: "ticker" | "popup" | "banner";
  is_active: boolean;
  priority: number;
  created_at: string;
}

export const useAnnouncementsStore = defineStore("announcements", () => {
  const announcements = ref<Announcement[]>([]);
  const tickers = ref<Announcement[]>([]);
  const popups = ref<Announcement[]>([]);
  const loading = ref(false);

  const FALLBACK: Announcement[] = [
    { id: "1", title_mm: "🎉 VOLT APEX မှ ကြိုဆိုသည်!", content_mm: "Welcome Bonus 100% ရယူပါ · KPay, Wave, CBPay ဖြင့် ငွေသွင်းနိုင်သည်", type: "ticker", is_active: true, priority: 1, created_at: new Date().toISOString() },
    { id: "2", title_mm: "💬 Customer Service", content_mm: "24/7 ဝန်ဆောင်မှု · Viber: 09-xxx-xxxx", type: "ticker", is_active: true, priority: 2, created_at: new Date().toISOString() },
    { id: "3", title_mm: "⚡ Daily Bonus", content_mm: "နေ့တိုင်း 10% Reload Bonus ရယူပါ", type: "ticker", is_active: true, priority: 3, created_at: new Date().toISOString() },
  ];

  async function fetchAnnouncements() {
    loading.value = true;
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .order("priority");
    if (data && data.length > 0) {
      announcements.value = data as Announcement[];
    } else {
      announcements.value = FALLBACK;
    }
    tickers.value = announcements.value.filter(a => a.type === "ticker");
    popups.value = announcements.value.filter(a => a.type === "popup");
    loading.value = false;
  }

  return { announcements, tickers, popups, loading, fetchAnnouncements };
});
