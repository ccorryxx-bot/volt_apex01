import { onUnmounted } from "vue";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

/**
 * Subscribe to real-time changes on a Supabase table.
 * Auto-unsubscribes on component unmount.
 */
export function useTableRealtime(
  table: string,
  filter: { column: string; value: string } | null,
  callbacks: {
    onInsert?: (row: any) => void;
    onUpdate?: (row: any) => void;
    onDelete?: (row: any) => void;
  }
) {
  let channel: RealtimeChannel;

  const setup = () => {
    let builder = supabase.channel(`realtime:${table}:${Date.now()}`);
    const filterStr = filter ? `${filter.column}=eq.${filter.value}` : undefined;

    builder = builder.on(
      "postgres_changes" as any,
      { event: "INSERT", schema: "public", table, ...(filterStr && { filter: filterStr }) },
      (payload: any) => callbacks.onInsert?.(payload.new)
    ).on(
      "postgres_changes" as any,
      { event: "UPDATE", schema: "public", table, ...(filterStr && { filter: filterStr }) },
      (payload: any) => callbacks.onUpdate?.(payload.new)
    ).on(
      "postgres_changes" as any,
      { event: "DELETE", schema: "public", table, ...(filterStr && { filter: filterStr }) },
      (payload: any) => callbacks.onDelete?.(payload.old)
    );

    channel = builder.subscribe();
  };

  setup();

  onUnmounted(() => {
    if (channel) supabase.removeChannel(channel);
  });

  return { channel: () => channel };
}

/** Subscribe to own balance updates */
export function useBalanceRealtime(userId: string, onUpdate: (balance: number) => void) {
  return useTableRealtime(
    "users",
    { column: "id", value: userId },
    { onUpdate: (row) => onUpdate(row.balance) }
  );
}

/** Subscribe to pending transaction status changes */
export function useTransactionRealtime(userId: string, onUpdate: (txn: any) => void) {
  return useTableRealtime(
    "transactions",
    { column: "user_id", value: userId },
    { onUpdate, onInsert: onUpdate }
  );
}
