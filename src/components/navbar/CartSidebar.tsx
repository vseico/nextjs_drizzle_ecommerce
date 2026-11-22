"use client";

import Image from "next/image";
import Link from "next/link";
import { FiMinus, FiPlus, FiShoppingCart, FiTrash2, FiX } from "react-icons/fi";
import { selectCartCount, selectCartSubtotal, useCartStore } from "@/store/cartStore";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}
export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const items = useCartStore((state) => state.items);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <>
      {/* overlay  */}

      {open && (
        <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40"></div>
      )}
      <aside
        className={`fixed right-0 top-0 z-60 flex h-dvh w-full max-w-105 flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header  */}
        <div className="flex items-center justify-between border-b border-border px-5 py-5">
          <div>
            <h2 className="text-lg font-semibold text-text">Your Cart</h2>
            <p className="text-sm text-muted">
              {count} {count === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-background text-muted transition hover:bg-border hover:text-text"
          ><FiX size={19} /></button>
        </div>

        {/* cartItems  */}
        <div className="flex-1 overflow-y-auto px-5 py-5 ">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <FiShoppingCart size={36} className="mb-3 text-muted" />
              <p className="font-medium text-text">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted">Add some products to get started.</p>
              <Link
                href="/products"
                onClick={onClose}
                className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
              >
                Browse products
              </Link>
            </div>
          ) : (
          <div className="space-y-5">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 border-b border-border pb-5"
              >
                {/* Product Image  */}
                <Link
                  href={`/products/${item.slug}`}
                  onClick={onClose}
                  className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-contain"
                    />
                  )}
                </Link>
                {/* Product Details  */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="line-clamp-2 text-sm font-medium text-text">
                                {item.name}
                            </h3>
                            <p className="mt-1 text-xs text-muted">
                                {item.unit}
                            </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => removeItem(item.productId)}
                          className="shrink-0 cursor-pointer text-muted transition hover:text-error"
                        >
                            <FiTrash2 size={16}/>
                        </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center overflow-hidden rounded-md border border-border">
                                <button
                                  type="button"
                                  aria-label="Decrease quantity"
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className="flex h-7 w-7 cursor-pointer items-center justify-center text-muted transition hover:bg-background hover:text-primary"
                                >
                                    <FiMinus size={12}/>
                                </button>
                                <span className="flex h-7 w-8 items-center justify-center border-x border-border text-xs font-medium text-text">
                                    {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  aria-label="Increase quantity"
                                  disabled={item.quantity >= item.stock}
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  className="flex h-7 w-7 cursor-pointer items-center justify-center text-muted transition hover:bg-background hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <FiPlus size={12} />
                                </button>
                        </div>
                        {/* Price  */}
                        <p className="text-sm font-semibold text-text">${(item.price * item.quantity).toFixed(2)}</p>

                    </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
        {/* footer  */}
        {items.length > 0 && (
        <div className="border-t border-border bg-white px-5 py-5">
            <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="text-lg font-semibold text-text">${subtotal.toFixed(2)}</span>
            </div>
            <p className="mb-4 text-xs leading-5 text-muted">
                Delivery charges and taxes will be calculated at checkout.
            </p>
            <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={onClose} className="cursor-pointer rounded-lg border border-primary py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-white">
                    Cancel
                </button>
                <Link href="/checkout" className="flex cursor-pointer items-center justify-center rounded-lg bg-primary py-3 text-sm font-medium text-white transition hover:bg-primary-hover" onClick={onClose}>
                    Checkout
                </Link>
            </div>
        </div>
        )}
      </aside>
    </>
  );
}
