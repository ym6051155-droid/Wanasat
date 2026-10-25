"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APP_NAME } from "@/lib/brand";
import { useStore } from "@/lib/store";

const STATES = ["الخرطوم", "ولاية الجزيرة", "البحر الأحمر", "كسلا", "القضارف", "شمال كردفان", "جنوب كردفان", "النيل الأبيض", "النيل الأزرق", "سنار", "الشمالية", "نهر النيل", "دارفور", "خارج السودان"];

export default function SignupPage() {
  const { signup, current, loaded } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (loaded && current) router.replace("/");
  }, [current, loaded, router]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stateName, setStateName] = useState(STATES[0]);
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="surface rounded-[32px] shadow-[0_16px_40px_rgba(23,32,42,0.10)] border p-6 max-w-md mx-auto w-full">
      <h1 className="text-3xl font-black text-nile text-center">حساب جديد في {APP_NAME}</h1>
      <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); const err = signup(name, email, password, stateName, bio); if (err) setError(err); else router.push("/"); }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" className="w-full border rounded-2xl px-4 py-3 bg-sand text-ink placeholder:text-gray-500" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" className="w-full border rounded-2xl px-4 py-3 bg-sand text-ink placeholder:text-gray-500" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="كلمة السر" className="w-full border rounded-2xl px-4 py-3 bg-sand text-ink placeholder:text-gray-500" />
        <select value={stateName} onChange={(e) => setStateName(e.target.value)} className="w-full border rounded-2xl px-4 py-3 bg-sand text-ink">
          {STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="نبذة عنك" rows={2} className="w-full border rounded-2xl px-4 py-3 bg-sand text-ink placeholder:text-gray-500" />
        {error && <p className="text-red-600 text-sm font-bold">{error}</p>}
        <button className="w-full bg-gradient-to-l from-nile to-nile-dark text-white rounded-full py-3 font-black shadow-[0_8px_20px_rgba(14,124,123,0.35)]">إنشاء الحساب</button>
      </form>
      <p className="text-sm text-center mt-4">عندك حساب؟ <Link href="/login" className="font-bold">دخول</Link></p>
    </div>
  );
}
