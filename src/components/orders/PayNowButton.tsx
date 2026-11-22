"use client";

import { payForOrder } from "@/server-actions/orders/orders";
import { useState } from "react";
import toast from "react-hot-toast";

export default function PayNowButton({ orderId }: { orderId: string }) {
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        const result = await payForOrder(orderId);
        if (!result.success) {
          toast.error(result.message);
          setPending(false);
          return;
        }
        window.location.href = result.redirectUrl;
      }}
      className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition hover:bg-primary-hover disabled:opacity-60"
    >
      {pending ? "Redirecting..." : "Pay now"}
    </button>
  );
}
