import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/lib/supabase";

export type GameCategory = "slot" | "live" | "fishing" | "sport" | "lottery" | "crash";

export interface Game {
  id: string;
  name: string;
  name_mm?: string;
  provider?: string;
  category: GameCategory;
  game_code?: string;
  thumbnail_url?: string;
  launch_url?: string;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_hot: boolean;
  rtp?: number;
  min_bet?: number;
  sort_order: number;
  play_count: number;
}

const FALLBACK_GAMES: Game[] = [
  { id: "1", name: "Fortune Tiger", name_mm: "ကျား", provider: "JILI", category: "slot", thumbnail_url: "https://placehold.co/120x160/0D1B3E/D4AF37?text=JILI", is_active: true, is_featured: true, is_new: false, is_hot: true, sort_order: 1, play_count: 9821 },
  { id: "2", name: "Baccarat Live", name_mm: "ဘက်ကာရတ်", provider: "Evolution", category: "live", thumbnail_url: "https://placehold.co/120x160/0D1B3E/00D4FF?text=LIVE", is_active: true, is_featured: true, is_new: true, is_hot: false, sort_order: 2, play_count: 5432 },
  { id: "3", name: "Aviator", name_mm: "လေယာဉ်", provider: "Spribe", category: "crash", thumbnail_url: "https://placehold.co/120x160/0D1B3E/FF3D5A?text=CRASH", is_active: true, is_featured: true, is_new: false, is_hot: true, sort_order: 3, play_count: 12340 },
  { id: "4", name: "Fish Prawn Crab", name_mm: "ငါး ပုဇွန် ကဏန်း", provider: "PG", category: "fishing", thumbnail_url: "https://placehold.co/120x160/0D1B3E/00FFB3?text=FISH", is_active: true, is_featured: false, is_new: false, is_hot: true, sort_order: 4, play_count: 7654 },
  { id: "5", name: "Dragon Tiger", name_mm: "နဂါး ကျား", provider: "PP", category: "live", thumbnail_url: "https://placehold.co/120x160/0D1B3E/D4AF37?text=DRAGON", is_active: true, is_featured: false, is_new: false, is_hot: false, sort_order: 5, play_count: 3210 },
  { id: "6", name: "Sweet Bonanza", name_mm: "Sweet Bonanza", provider: "Pragmatic", category: "slot", thumbnail_url: "https://placehold.co/120x160/0D1B3E/F0D060?text=SLOT", is_active: true, is_featured: false, is_new: true, is_hot: false, sort_order: 6, play_count: 2980 },
  { id: "7", name: "Roulette Pro", name_mm: "ရောလိတ်", provider: "Evolution", category: "live", thumbnail_url: "https://placehold.co/120x160/0D1B3E/00D4FF?text=ROUL", is_active: true, is_featured: false, is_new: false, is_hot: false, sort_order: 7, play_count: 1890 },
  { id: "8", name: "Lucky Fishing", name_mm: "ငါးဖမ်း", provider: "JILI", category: "fishing", thumbnail_url: "https://placehold.co/120x160/0D1B3E/00FFB3?text=FISH2", is_active: true, is_featured: false, is_new: true, is_hot: false, sort_order: 8, play_count: 4320 },
  { id: "9", name: "Soccer Betting", name_mm: "ဘောလုံးလောင်း", provider: "SABA", category: "sport", thumbnail_url: "https://placehold.co/120x160/0D1B3E/00FFB3?text=SPORT", is_active: true, is_featured: false, is_new: false, is_hot: false, sort_order: 9, play_count: 6780 },
  { id: "10", name: "2D 3D Lottery", name_mm: "၂D ၃D", provider: "Local", category: "lottery", thumbnail_url: "https://placehold.co/120x160/0D1B3E/D4AF37?text=2D3D", is_active: true, is_featured: false, is_new: false, is_hot: true, sort_order: 10, play_count: 15670 },
  { id: "11", name: "Gates of Olympus", name_mm: "Gates of Olympus", provider: "Pragmatic", category: "slot", thumbnail_url: "https://placehold.co/120x160/0D1B3E/F0D060?text=SLOT2", is_active: true, is_featured: false, is_new: true, is_hot: true, sort_order: 11, play_count: 8910 },
  { id: "12", name: "Lightning Dice", name_mm: "မြင်းကောင်", provider: "Evolution", category: "live", thumbnail_url: "https://placehold.co/120x160/0D1B3E/00D4FF?text=DICE", is_active: true, is_featured: false, is_new: false, is_hot: false, sort_order: 12, play_count: 2100 },
];

export const useGamesStore = defineStore("games", () => {
  const games = ref<Game[]>([]);
  const loading = ref(false);
  const activeCategory = ref<GameCategory | "all">("all");
  const search = ref("");

  const filteredGames = computed(() => {
    let list = games.value.filter(g => g.is_active);
    if (activeCategory.value !== "all") list = list.filter(g => g.category === activeCategory.value);
    if (search.value) list = list.filter(g => g.name.toLowerCase().includes(search.value.toLowerCase()) || (g.name_mm || "").includes(search.value));
    return list;
  });

  const featuredGames = computed(() => games.value.filter(g => g.is_featured && g.is_active).slice(0, 5));

  async function fetchGames() {
    loading.value = true;
    const { data, error } = await supabase.from("games").select("*").eq("is_active", true).order("sort_order");
    if (data && data.length > 0) {
      games.value = data as Game[];
    } else {
      games.value = FALLBACK_GAMES;
    }
    loading.value = false;
  }

  async function recordPlay(gameId: string) {
    await supabase.from("games").update({ play_count: supabase.rpc as any }).eq("id", gameId);
  }

  return { games, loading, activeCategory, search, filteredGames, featuredGames, fetchGames, recordPlay };
});
