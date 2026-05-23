import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "./auth.store";
import { useUiStore } from "./ui.store";

export type TxnType = "deposit" | "withdraw" | "bet" | "win" | "bonus" | "commission";
export type TxnStatus = "pending" | "approved" | "rejected" | "processing";
export type PaymentMethod = "kpay" | "wave" | "cbpay" | "uabpay";

export interface Transaction {
  id: string;
  user_id: string;
  type: TxnType;
  amount: number;
  balance_before?: number;
  balance_after?: number;
  status: TxnStatus;
  payment_method?: PaymentMethod;
  payment_account?: string;
  payment_ref?: string;
  screenshot_url?: string;
  admin_note?: string;
  processed_by?: string;
  created_at: string;
}

export interface PaymentAccount {
  id: string;
  method: PaymentMethod;
  account_name: string;
  account_number: string;
  display_name?: string;
  qr_code_url?: string;
  is_active: boolean;
  sort_order: number;
}

export const useTransactionsStore = defineStore("transactions", () => {
  const transactions = ref<Transaction[]>([]);
  const paymentAccounts = ref<PaymentAccount[]>([]);
  const loading = ref(false);
  const pendingDeposits = ref<Transaction[]>([]);
  const pendingWithdrawals = ref<Transaction[]>([]);

  const auth = useAuthStore();
  const ui = useUiStore();

  async function fetchTransactions(limit = 20, type?: TxnType) {
    if (!auth.user) return;
    loading.value = true;
    let q = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (type) q = q.eq("type", type);
    const { data } = await q;
    if (data) transactions.value = data as Transaction[];
    loading.value = false;
  }

  async function fetchPaymentAccounts() {
    const { data } = await supabase
      .from("payment_accounts")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (data) paymentAccounts.value = data as PaymentAccount[];
  }

  async function submitDeposit(payload: {
    amount: number;
    paymentMethod: PaymentMethod;
    paymentRef: string;
    screenshotFile?: File;
  }) {
    if (!auth.user) return { success: false, error: "Not authenticated" };
    loading.value = true;
    try {
      let screenshotUrl: string | undefined;
      if (payload.screenshotFile) {
        const ext = payload.screenshotFile.name.split(".").pop();
        const path = `deposits/${auth.user.id}/${Date.now()}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("payment-screenshots")
          .upload(path, payload.screenshotFile, { upsert: false });
        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from("payment-screenshots")
            .getPublicUrl(uploadData.path);
          screenshotUrl = urlData.publicUrl;
        }
      }
      const { error } = await supabase.from("transactions").insert({
        user_id: auth.user.id,
        type: "deposit",
        amount: payload.amount,
        status: "pending",
        payment_method: payload.paymentMethod,
        payment_ref: payload.paymentRef,
        screenshot_url: screenshotUrl,
      });
      if (error) throw error;
      await fetchTransactions();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  async function submitWithdraw(payload: {
    amount: number;
    paymentMethod: PaymentMethod;
    paymentAccount: string;
  }) {
    if (!auth.user) return { success: false, error: "Not authenticated" };
    const profile = auth.profile;
    if (!profile || profile.balance < payload.amount) {
      return { success: false, error: "ငွေပမာဏ မလုံလောက်ပါ" };
    }
    if (payload.amount < 5000) {
      return { success: false, error: "အနည်းဆုံး 5,000 MMK ထုတ်ယူနိုင်သည်" };
    }
    loading.value = true;
    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: auth.user.id,
        type: "withdraw",
        amount: payload.amount,
        status: "pending",
        payment_method: payload.paymentMethod,
        payment_account: payload.paymentAccount,
        balance_before: profile.balance,
      });
      if (error) throw error;
      await fetchTransactions();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  // Admin functions
  async function fetchPendingDeposits() {
    const { data } = await supabase
      .from("transactions")
      .select("*, users(username, phone_number)")
      .eq("type", "deposit")
      .eq("status", "pending")
      .order("created_at", { ascending: true });
    if (data) pendingDeposits.value = data as any;
  }

  async function fetchPendingWithdrawals() {
    const { data } = await supabase
      .from("transactions")
      .select("*, users(username, phone_number)")
      .eq("type", "withdraw")
      .eq("status", "pending")
      .order("created_at", { ascending: true });
    if (data) pendingWithdrawals.value = data as any;
  }

  async function approveDeposit(txnId: string) {
    const { error } = await supabase.rpc("admin_approve_deposit", { txn_id: txnId, admin_id: auth.user?.id });
    if (error) {
      // Fallback: manual update
      await supabase.from("transactions").update({ status: "approved", processed_by: auth.user?.id }).eq("id", txnId);
    }
    await fetchPendingDeposits();
  }

  async function rejectTransaction(txnId: string, note?: string) {
    await supabase.from("transactions").update({
      status: "rejected",
      admin_note: note || "ငွေပေးချေမှု စစ်ဆေးမရ",
      processed_by: auth.user?.id,
    }).eq("id", txnId);
    await fetchPendingDeposits();
    await fetchPendingWithdrawals();
  }

  async function approveWithdrawal(txnId: string) {
    await supabase.from("transactions").update({
      status: "approved",
      processed_by: auth.user?.id,
    }).eq("id", txnId);
    await fetchPendingWithdrawals();
  }

  return {
    transactions, paymentAccounts, loading, pendingDeposits, pendingWithdrawals,
    fetchTransactions, fetchPaymentAccounts, submitDeposit, submitWithdraw,
    fetchPendingDeposits, fetchPendingWithdrawals, approveDeposit, rejectTransaction, approveWithdrawal,
  };
});
