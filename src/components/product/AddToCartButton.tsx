"use client";

import { authClient } from "@/lib/auth-client";
import { useAuthModal } from "@/store/authModalStore";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoCartOutline } from "react-icons/io5";

interface AddToCartButtonProps {
  productId: string;
  variant?: "card" | "primary" | "secondary" | "buy-now";
  disabled?: boolean;
  quantity?: number;
}

export default function AddToCartButton({
  productId,
  variant = "card",
  disabled = false,
  quantity = 1,
}: AddToCartButtonProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const openLogin = useAuthModal((state) => state.openLogin);
  const addItem = useCartStore((state) => state.addItem);
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    if (!session) {
      openLogin();
      return;
    }
    setPending(true);
    const ok = await addItem(productId, quantity);
    setPending(false);
    if (ok && variant === "buy-now") {
      router.push("/checkout");
    }
  };

  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || pending}
        className="flex h-[34px] w-[64px] cursor-pointer items-center justify-center gap-1 rounded border border-primary-hover bg-[#E8F7EF] font-medium text-primary disabled:cursor-not-allowed disabled:opacity-50 md:w-[80px]"
      >
        <IoCartOutline size={16} className="text-primary" />
        {disabled ? "Sold" : pending ? "..." : "Add"}
      </button>
    );
  }

  const styles =
    variant === "secondary"
      ? "bg-gray-100 text-text hover:bg-border"
      : "bg-primary text-white hover:bg-primary-hover";

  const label =
    variant === "buy-now"
      ? pending ? "Please wait..." : "Buy Now"
      : pending ? "Adding..." : "Add to Cart";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || pending}
      className={`w-full cursor-pointer rounded-lg py-3.5 font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}
    >
      {disabled ? "Out of stock" : label}
    </button>
  );
}
