"use client";

import { ORDER_STATUSES, orderStatusLabel, type OrderStatus } from "@/lib/pricing";
import { updateOrderStatus } from "@/server-actions/admin/orders";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface OrderStatusFormProps {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusForm({ orderId, currentStatus }: OrderStatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus as OrderStatus);
  const [saving, setSaving] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const locked = currentStatus === "cancelled";

  const save = async () => {
    setSaving(true);
    const result = await updateOrderStatus(orderId, status);
    setSaving(false);
    setConfirmCancel(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    router.refresh();
  };

  return (
    <div>
      <select
        value={status}
        disabled={locked || saving}
        onChange={(e) => {
          setStatus(e.target.value as OrderStatus);
          setConfirmCancel(false);
        }}
        className="mt-5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary disabled:opacity-60"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {orderStatusLabel[s]}
          </option>
        ))}
      </select>

      {confirmCancel ? (
        <div className="mt-3 rounded-lg border border-error/30 bg-error/5 p-3 text-sm">
          <p className="text-text">Cancel this order? Stock will be returned to inventory.</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="flex-1 cursor-pointer rounded-lg bg-error py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Cancelling..." : "Yes, cancel order"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmCancel(false)}
              className="flex-1 cursor-pointer rounded-lg border border-border py-2 text-sm font-medium text-text"
            >
              Keep order
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={locked || saving || status === currentStatus}
          onClick={() => (status === "cancelled" ? setConfirmCancel(true) : save())}
          className="mt-3 w-full cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Status"}
        </button>
      )}
      {locked && <p className="mt-2 text-xs text-muted">Cancelled orders cannot be changed.</p>}
    </div>
  );
}
