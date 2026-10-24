"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";

export default function EventsPage() {
  const { state, current, createEvent, toggleRsvp } = useStore();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <div className="space-y-4">
      <section className="bg-white rounded-3xl shadow-sm border p-4">
        <h1 className="font-black text-lg">إنشاء فعالية</h1>
        <form className="mt-3 space-y-2" onSubmit={(e) => { e.preventDefault(); if (title.trim() && date) { createEvent(title.trim(), date, location.trim(), desc.trim()); setTitle(""); setDate(""); setLocation(""); setDesc(""); } }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="اسم الفعالية" className="w-full border rounded-2xl px-3 py-2" />
          <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-full border rounded-2xl px-3 py-2" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="المكان" className="w-full border rounded-2xl px-3 py-2" />
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="وصف الفعالية" className="w-full border rounded-2xl px-3 py-2" />
          <button className="bg-nile text-white rounded-full px-5 py-2 font-bold">إنشاء</button>
        </form>
      </section>
      {state.events.map((ev) => (
        <div key={ev.id} className="bg-white rounded-3xl shadow-sm border p-4 flex items-center gap-3">
          <div className="flex-1">
            <Link href={`/events/${ev.id}`} className="font-black">{ev.title}</Link>
            <p className="text-sm text-gray-500">{ev.date} · {ev.location}</p>
            <p className="text-sm">{ev.description}</p>
            <p className="text-xs text-gray-400">{ev.attendees.length} مشاركين</p>
          </div>
          {current && <button onClick={() => toggleRsvp(ev.id)} className="bg-nile text-white rounded-full px-4 py-1 font-bold text-sm">{ev.attendees.includes(current.id) ? "مشارك ✓" : "مشاركة"}</button>}
        </div>
      ))}
    </div>
  );
}
