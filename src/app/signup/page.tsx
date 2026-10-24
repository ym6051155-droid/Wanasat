"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP_NAME } from "@/lib/brand";
import { useStore } from "@/lib/store";

const STATES = ["الخرطوم", "ولاية الجزيرة", "البحر الأحمر", "كسلا", "القضارف", "شمال كردفان", "جنوب كردفان", "النيل الأبيض", "النيل الأزرق", "سنار", "الشمالية", "نهر النيل", "دارفور", "خارج السودان"];

export default function SignupPage() {
  const { signup } = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stateName, setStateName] = useState(STATES[0]);
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-black text-nile">حساب جديد في {APP_NAME}</h1>
      <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); const err = signup(name, email, password, stateName, bio); if (err) setError(err); else router.push("/"); }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" className="w-full border rounded-2xl px-3 py-2" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" className="w-full border rounded-2xl px-3 py-2" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="كلمة السر" className="w-full border rounded-2xl px-3 py-2" />
        <select value={stateName} onChange={(e) => setStateName(e.target.value)} className="w-full border rounded-2xl px-3 py-2 bg-white">
          {STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="نبذة عنك" rows={2} className="w-full border rounded-2xl px-3 py-2" />
        {error && <p className="text-red-600 text-sm font-bold">{error}</p>}
        <button className="w-full bg-nile text-white rounded-full py-2 font-bold">إنشاء الحساب</button>
      </form>
      <p className="text-sm text-center mt-4">عندك حساب؟ <Link href="/login" className="font-bold">دخول</Link></p>
    </div>
  );
}
