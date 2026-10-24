"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";

export default function NewListingPage() {
  const { createListing, current } = useStore();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stateName, setStateName] = useState("الخرطوم");
  const [desc, setDesc] = useState("");
  if (!current) return <p>سجّل دخول أولاً.</p>;
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-5 max-w-md mx-auto">
      <h1 className="font-black text-xl">إعلان جديد</h1>
      <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); const id = createListing(title.trim(), Number(price) || 0, stateName, desc.trim()); router.push(`/marketplace/${id}`); }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الإعلان" className="w-full border rounded-2xl px-3 py-2" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="السعر بالجنيه" className="w-full border rounded-2xl px-3 py-2" />
        <input value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="الولاية" className="w-full border rounded-2xl px-3 py-2" />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="وصف السلعة" rows={3} className="w-full border rounded-2xl px-3 py-2" />
        <button className="w-full bg-nile text-white rounded-full py-2 font-bold">نشر الإعلان</button>
      </form>
    </div>
  );
}
