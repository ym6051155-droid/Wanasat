"use client";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "./icons";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
};

export function PasswordField({ value, onChange, placeholder, className }: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className={className ?? "w-full border rounded-2xl px-4 pl-12 py-3 bg-sand text-ink placeholder:text-gray-500"}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-gray-500"
      >
        {show ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
      </button>
    </div>
  );
}
