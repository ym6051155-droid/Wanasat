"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APP_NAME } from "@/lib/brand";
import { supabaseConfigured } from "@/lib/supabase";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const { login, current, loaded } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (loaded && current) router.replace("/");
  }, [current, loaded, router]);
  const [email, setEmail] = useState("demo@wansat.sd");
  const [password, setPassword] = useState("demo");
  const [error, setError] = useState("");
  return (
    <div className="surface rounded-[32px] shadow-[0_16px_40px_rgba(23,32,42,0.10)] border p-6 max-w-md mx-auto w-full">
      <h1 className="text-3xl font-black text-nile text-center">{APP_NAME}</h1>
      <p className="text-sm text-gray-500 mt-2 text-center">دخول لحسابك</p>
      {!supabaseConfigured && <p className="text-xs text-gray-500 mt-2">الوضع الحالي: بيانات محلية تجريبية على جهازك (حساب تجريبي: demo@wansat.sd / demo).</p>}
      <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); const err = login(email, password); if (err) setError(err); else router.push("/"); }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" className="w-full border rounded-2xl px-4 py-3 bg-sand text-ink placeholder:text-gray-500" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="كلمة السر" className="w-full border rounded-2xl px-4 py-3 bg-sand text-ink placeholder:text-gray-500" />
        {error && <p className="text-red-600 text-sm font-bold">{error}</p>}
        <button className="w-full bg-gradient-to-l from-nile to-nile-dark text-white rounded-full py-3 font-black shadow-[0_8px_20px_rgba(14,124,123,0.35)]">دخول</button>
      </form>
      <p className="text-sm text-center mt-4">ما عندك حساب؟ <Link href="/signup" className="font-bold">سجّل</Link></p>
    </div>
  );
}
