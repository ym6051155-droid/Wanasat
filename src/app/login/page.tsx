"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP_NAME } from "@/lib/brand";
import { supabaseConfigured } from "@/lib/supabase";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("demo@wansat.sd");
  const [password, setPassword] = useState("demo");
  const [error, setError] = useState("");
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-black text-nile">{APP_NAME}</h1>
      <p className="text-sm text-gray-500 mt-1">دخول لحسابك</p>
      {!supabaseConfigured && <p className="text-xs text-gray-500 mt-2">الوضع الحالي: بيانات محلية تجريبية على جهازك (حساب تجريبي: demo@wansat.sd / demo).</p>}
      <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); const err = login(email, password); if (err) setError(err); else router.push("/"); }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" className="w-full border rounded-2xl px-3 py-2" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="كلمة السر" className="w-full border rounded-2xl px-3 py-2" />
        {error && <p className="text-red-600 text-sm font-bold">{error}</p>}
        <button className="w-full bg-nile text-white rounded-full py-2 font-bold">دخول</button>
      </form>
      <p className="text-sm text-center mt-4">ما عندك حساب؟ <Link href="/signup" className="font-bold">سجّل</Link></p>
    </div>
  );
}
