"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiMinus, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import GroceryAssistantInput from "./GroceryAssistantInput";

interface GroceryAssistantProps {
  open: boolean;
  onClose: () => void;
}
export default function GroceryAssistant({ open, onClose }: GroceryAssistantProps) {
    const [isLoading, setIsLoading] = useState(false);
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
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F7EF] text-primary">
                <LuSparkles size={18}/>
            </div>
            <div>
                <h2 className="text-sm font-semibold text-text">AI Grocery Assistant</h2>
                <p className="text-xs text-muted">Your smart shopping assistant</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-background text-muted transition hover:bg-border hover:text-text"
          ><FiX size={19} /></button>
        </div>

    {/* content  */}
        <div className="flex-1 overflow-y-auto p-5">
            <div className="flex h-full flex-col">
                <div>
                    <h3 className="text-lg font-semibold text-text">What are you cooking today?</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">Tell me what you want to cook and I&apos;ll find the groceries you need from our store.</p>
                </div>
                <div className="mt-6">
                    <GroceryAssistantInput onSearch={(prompt) => {
                        console.log(prompt)
                    }} isLoading={isLoading}/>
                </div>
            </div>  

        </div>

      </aside>
    </>
  );
}
