"use client";

import { useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: "current-password" | "new-password";
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder = "Enter your password",
  autoComplete = "current-password",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <FiLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type={visible ? "text" : "password"}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        minLength={6}
        className="w-full rounded-lg border border-border bg-white py-3 pl-10 pr-11 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted transition hover:text-primary"
      >
        {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
      </button>
    </div>
  );
}
