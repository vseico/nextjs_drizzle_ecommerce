"use client";

import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import Avatar from "./Avatar";
import { useEffect, useState } from "react";
import CartSidebar from "./CartSidebar";
import GroceryAssistant from "./GroceryAssistant";
import { LuSparkles } from "react-icons/lu";
import { useAuthModal } from "@/store/authModalStore";
import { authClient } from "@/lib/auth-client";
import { selectCartCount, useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

function SearchBox({ mobile = false, onSearch }: { mobile?: boolean; onSearch?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        router.push(`/search?q=${encodeURIComponent(q)}`);
        onSearch?.();
      }}
      className={
        mobile
          ? "flex w-full items-center gap-2 rounded-full border border-border px-3"
          : "hidden items-center gap-2 rounded-full border border-border px-3 lg:flex"
      }
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products"
        className={`w-full bg-transparent text-sm outline-none placeholder:text-muted ${mobile ? "py-2" : "py-1.5"}`}
      />
      <button type="submit" aria-label="Search" className="cursor-pointer">
        <FaSearch className="text-muted" size={14} />
      </button>
    </form>
  );
}

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const { openLogin } = useAuthModal();

  const cartOpen = useCartStore((state) => state.isOpen);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const resetCart = useCartStore((state) => state.reset);
  const cartCount = useCartStore(selectCartCount);

  const userId = session?.user.id;

  useEffect(() => {
    if (isPending) return;
    if (userId) {
      fetchCart();
    } else {
      resetCart();
    }
  }, [userId, isPending, fetchCart, resetCart]);

  const handleCartClick = () => {
    if (!session) {
      openLogin();
      return;
    }
    openCart();
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-primary-hover"
        type="button"
        onClick={() => setIsAIOpen(true)}
      >
        <LuSparkles size={18} />
        <span>Ask AI</span>
      </button>
      <nav
        className="relative z-40 flex items-center justify-between
                        border-b border-border bg-white px-6
                        py-4 transition-all md:px-16 lg:px-24 xl:px-32"
      >
        {/* logo */}
        <Link className="flex items-center gap-2" href="/">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <FiPackage size={22} />
          </div>
          <span className="text-xl font-bold text-text">
            Grocery <span className="text-primary">Cart</span>
          </span>
        </Link>

        {/* desktop menu  */}
        <div className="hidden items-center gap-8 sm:flex">
          <Link href={"/"} className="transition hover:text-primary">
            Home
          </Link>
          <Link href={"/products"} className="transition hover:text-primary">
            Products
          </Link>
          {/* search input  */}
          <SearchBox />
          {/* cart */}
          <button
            onClick={handleCartClick}
            type="button"
            aria-label="Open cart"
            className="relative cursor-pointer"
          >
            <IoCartOutline size={22} className="text-muted transition hover:text-primary" />
            {cartCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </button>
          {/* login  */}

          <div className="flex items-center gap-2">
            {session ? (
              <Avatar image={session.user.image} />
            ) : (
              <button onClick={openLogin} className="cursor-pointer rounded-full bg-primary px-6 py-2 text-sm text-white transition hover:bg-primary-hover">
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button  */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          type="button"
          aria-label="Toggle menu"
          className="sm:hidden"
        >
          <span className="flex flex-col gap-1.5">
            <span className="h-0.5 w-5 rounded-full bg-muted"></span>
            <span className="ml-2 h-0.5 w-4 rounded-full bg-muted"></span>
            <span className="ml-1 h-0.5 w-4.5 rounded-full bg-muted"></span>
          </span>
        </button>
        {/* mobile menu  */}

        <div
          className={`absolute left-0 top-full z-50 w-full flex-col items-start gap-4 border-b border-border bg-white px-5 py-5 text-sm shadow-md sm:hidden ${open ? "flex" : "hidden"}`}
        >
          <Link href={"/"} className="transition hover:text-primary">
            Home
          </Link>
          <Link href={"/products"} className="transition hover:text-primary">
            Products
          </Link>
          {/* mobile search  */}
          <SearchBox mobile onSearch={() => setOpen(false)} />
          {/* mobile cart  */}
          <button
            onClick={() => {
              setOpen(false);
              handleCartClick();
            }}
            className="flex w-full cursor-pointer items-center gap-3 text-left transition hover:text-primary"
          >
            <div className="relative ">
              <IoCartOutline size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] text-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Cart</span>
          </button>
          <div className="flex items-center gap-2">
            {session ? (
              <Avatar mobile={true} image={session.user.image} />
            ) : (
              <button onClick={openLogin} className="cursor-pointer rounded-full bg-primary px-6 py-2 text-sm text-white transition hover:bg-primary-hover">
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
      {/* cartsidebar  */}
      <CartSidebar onClose={closeCart} open={cartOpen} />
      <GroceryAssistant onClose={() => setIsAIOpen(false)} open={isAIOpen} />
    </>
  );
};

export default Navbar;
