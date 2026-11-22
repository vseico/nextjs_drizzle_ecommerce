"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import AddressModal from "./AddressModal";
import { useCartStore } from "@/store/cartStore";
import { calculateTotals } from "@/lib/pricing";
import { placeOrder } from "@/server-actions/orders/orders";

export interface CheckoutAddress {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CheckoutPageComponentProps {
  initialAddresses: CheckoutAddress[];
  stripeEnabled: boolean;
}

const formatAddress = (a: CheckoutAddress) =>
  `${a.street}, ${a.city}, ${a.state} ${a.postalCode}, ${a.country}`;

export default function CheckoutPageComponent({
  initialAddresses,
  stripeEnabled,
}: CheckoutPageComponentProps) {
  const router = useRouter();
  const [showAddress, setShowAddress] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(initialAddresses[0]?.id ?? "");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "STRIPE">(
    stripeEnabled ? "STRIPE" : "COD",
  );
  const [placing, setPlacing] = useState(false);

  const items = useCartStore((state) => state.items);
  const loaded = useCartStore((state) => state.loaded);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const fetchCart = useCartStore((state) => state.fetchCart);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const { subtotal, shippingFee, tax, total } = calculateTotals(items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please add a delivery address.");
      setShowAddressModal(true);
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setPlacing(true);
    const result = await placeOrder({ addressId: selectedAddressId, paymentMethod });
    if (!result.success) {
      toast.error(result.message);
      setPlacing(false);
      fetchCart();
      return;
    }
    if (paymentMethod === "STRIPE") {
      window.location.href = result.redirectUrl;
      return;
    }
    await fetchCart();
    toast.success("Order placed successfully!");
    router.push(result.redirectUrl);
  };

  if (loaded && items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <FiShoppingCart size={40} className="mb-4 text-muted" />
        <h1 className="text-2xl font-medium text-text">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted">Add some products before checking out.</p>
        <Link
          href="/products"
          className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-hover"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 md:px-8 lg:flex-row lg:py-12">
      {/* cart  */}
      <div className="min-w-0 flex-1">
        <h1 className="mb-6 text-2xl font-medium text-text md:text-3xl">
          Shopping Cart{" "}
          <span className="text-sm font-normal text-primary">
            {itemCount} {itemCount === 1 ? "Item" : "Items"}
          </span>
        </h1>
        <AddressModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          onSaved={(saved) => {
            setAddresses((prev) => [saved, ...prev]);
            setSelectedAddressId(saved.id);
          }}
        />
        {/* desktop header  */}
        <div className="hidden grid-cols-[2fr_1fr_1fr] border-b border-border pb-3 text-sm font-medium text-muted sm:grid">
          <p>Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {!loaded && <p className="py-10 text-center text-sm text-muted">Loading your cart...</p>}

        {/* cart items  */}
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div
              key={item.productId}
              className="grid gap-4 py-5 sm:grid-cols-[2fr_1fr_1fr] sm:items-center"
            >
              {/* Product Detail  */}
              <div className="flex gap-3 sm:gap-5">
                <Link
                  href={`/products/${item.slug}`}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-background sm:h-28 sm:w-28"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={120}
                      height={120}
                      className="h-full object-contain p-2"
                    />
                  )}
                </Link>

                <div className="min-w-0">
                  <p className="truncate text-base font-medium text-text">{item.name}</p>
                  <p className="mt-1 text-xs text-muted">{item.category}</p>
                  <p className="mt-1 text-sm text-muted">{item.unit}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-medium text-primary">${item.price.toFixed(2)}</span>
                    {item.oldPrice && (
                      <span className="text-xs text-muted line-through">
                        ${item.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {/* quantity buttons  */}
                  <div className="mt-3 flex w-fit items-center overflow-hidden rounded-md border border-border">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="flex h-7 w-7 cursor-pointer items-center justify-center text-muted hover:bg-background hover:text-primary"
                    >
                      <FiMinus size={13} />
                    </button>
                    <span className="flex h-7 w-8 items-center justify-center border-x border-border text-xs font-medium text-text">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={item.quantity >= item.stock}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="flex h-7 w-7 cursor-pointer items-center justify-center text-muted hover:bg-background hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FiPlus size={13} />
                    </button>
                  </div>
                  {item.quantity > item.stock && (
                    <p className="mt-2 text-xs text-error">
                      Only {item.stock} left in stock
                    </p>
                  )}
                </div>
              </div>
              <p className="text-left font-medium text-text sm:text-center">
                <span className="mr-2 text-sm text-muted sm:hidden">Subtotal:</span>
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                className="flex w-fit cursor-pointer items-center gap-2 text-sm text-error transition hover:opacity-70 sm:mx-auto "
              >
                <FiTrash2 size={17} />
                <span className="sm:hidden">Remove</span>
              </button>
            </div>
          ))}
        </div>
        <Link
          href={"/products"}
          className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary-hover"
        >
          <FiArrowLeft size={17} className="transition-transform group-hover:-translate-x-1" />
          Continue Shopping
        </Link>
      </div>
      {/* order summary  */}
      <div className="h-fit w-full rounded-lg border border-border bg-background p-5 lg:max-w-90">
        <h2 className="text-xl font-medium text-text">Order Summary</h2>
        <hr className="my-5 border-border" />
        {/* delivery address  */}
        <div>
          <p className="text-sm font-medium uppercase text-text">Delivery Address</p>
          <div className="relative mt-2 flex items-start justify-between gap-3">
            <p className="text-sm text-muted">
              {selectedAddress ? (
                <>
                  <span className="block font-medium text-text">
                    {selectedAddress.firstName} {selectedAddress.lastName}
                  </span>
                  {formatAddress(selectedAddress)}
                </>
              ) : (
                "No address found"
              )}
            </p>
            <button
              type="button"
              onClick={() =>
                addresses.length === 0 ? setShowAddressModal(true) : setShowAddress((prev) => !prev)
              }
              className="shrink-0 cursor-pointer text-sm font-medium text-primary hover:underline"
            >
              {addresses.length === 0 ? "Add" : "Change"}
            </button>
            {showAddress && (
              <div className="absolute right-0 top-8 z-20 w-full overflow-hidden rounded-lg border border-border bg-white shadow-lg">
                {addresses.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      setSelectedAddressId(a.id);
                      setShowAddress(false);
                    }}
                    className={`block w-full cursor-pointer p-3 text-left text-sm transition hover:bg-background ${a.id === selectedAddressId ? "text-primary" : "text-muted"}`}
                  >
                    {formatAddress(a)}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setShowAddress(false);
                    setShowAddressModal(true);
                  }}
                  type="button"
                  className="block w-full cursor-pointer border-t border-border p-3 text-center text-sm font-medium text-primary transition"
                >
                  + Add New Address
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method  */}
        <div className="mt-6">
          <p className="text-sm font-medium uppercase text-text">Payment Method</p>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as "COD" | "STRIPE")}
            className="mt-2 w-full cursor-pointer rounded-md border border-border bg-white px-3 py-2.5 text-sm text-text outline-none focus:border-primary"
          >
            {stripeEnabled && <option value="STRIPE">Pay online (card)</option>}
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>
        <hr className="my-5 border-border" />
        <div className="space-y-3 text-sm text-muted">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            {shippingFee === 0 ? (
              <span className="text-success">Free</span>
            ) : (
              <span>${shippingFee.toFixed(2)}</span>
            )}
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>${tax.toFixed(2)}</span>
          </p>
          <hr className="border-border" />
          <p className="flex justify-between text-lg font-medium text-text">
            <span>Total Amount</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </p>

          {/* place order  */}
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={placing || !loaded || items.length === 0}
            className="mt-6 w-full cursor-pointer rounded-lg bg-primary py-3.5 font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {placing
              ? paymentMethod === "STRIPE"
                ? "Redirecting to payment..."
                : "Placing order..."
              : paymentMethod === "STRIPE"
                ? "Proceed to payment"
                : "Place order"}
          </button>
        </div>
      </div>
    </div>
  );
}
