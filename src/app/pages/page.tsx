"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";

export default function PagesPage() {
  const { state, current, createPage, togglePageFollow } = useStore();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <div className="space-y-4">
      <section className="bg-white rounded-3xl shadow-sm border p-4">
        <h1 className="font-black text-lg">إنشاء صفحة</h1>
        <form className="mt-3 space-y-2" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { createPage(name.trim(), desc.trim()); setName(""); setDesc(""); } }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم الصفحة" className="w-full border rounded-2xl px-3 py-2" />
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="وصف الصفحة" className="w-full border rounded-2xl px-3 py-2" />
          <button className="bg-nile text-white rounded-full px-5 py-2 font-bold">إنشاء</button>
        </form>
      </section>
      {state.pages.map((p) => (
        <div key={p.id} className="bg-white rounded-3xl shadow-sm border p-4 flex items-center gap-3">
          <div className="flex-1">
            <Link href={`/pages/${p.id}`} className="font-black">{p.name}</Link>
            <p className="text-sm text-gray-500">{p.description}</p>
            <p className="text-xs text-gray-400">{p.followers.length} متابعين</p>
          </div>
          {current && <button onClick={() => togglePageFollow(p.id)} className="bg-nile text-white rounded-full px-4 py-1 font-bold text-sm">{p.followers.includes(current.id) ? "متابَع" : "متابعة"}</button>}
        </div>
      ))}
    </div>
  );
}
