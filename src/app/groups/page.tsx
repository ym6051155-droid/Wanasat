"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";

export default function GroupsPage() {
  const { state, current, createGroup, joinGroup } = useStore();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <div className="space-y-4">
      <section className="bg-white rounded-3xl shadow-sm border p-4">
        <h1 className="font-black text-lg">إنشاء مجموعة</h1>
        <form className="mt-3 space-y-2" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { createGroup(name.trim(), desc.trim()); setName(""); setDesc(""); } }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم المجموعة" className="w-full border rounded-2xl px-3 py-2" />
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="وصف المجموعة" className="w-full border rounded-2xl px-3 py-2" />
          <button className="bg-nile text-white rounded-full px-5 py-2 font-bold">إنشاء</button>
        </form>
      </section>
      {state.groups.map((g) => (
        <div key={g.id} className="bg-white rounded-3xl shadow-sm border p-4 flex items-center gap-3">
          <div className="flex-1">
            <Link href={`/groups/${g.id}`} className="font-black">{g.name}</Link>
            <p className="text-sm text-gray-500">{g.description}</p>
            <p className="text-xs text-gray-400">{g.members.length} أعضاء</p>
          </div>
          {current && !g.members.includes(current.id) && <button onClick={() => joinGroup(g.id)} className="bg-nile text-white rounded-full px-4 py-1 font-bold text-sm">انضمام</button>}
          {current && g.members.includes(current.id) && <Link href={`/groups/${g.id}`} className="font-bold text-sm">فتح</Link>}
        </div>
      ))}
    </div>
  );
}
