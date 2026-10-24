"use client";
import { Avatar } from "@/components/Avatar";
import { useStore } from "@/lib/store";

export default function EventPage({ params }: { params: { id: string } }) {
  const { state, current, profileById, toggleRsvp } = useStore();
  const ev = state.events.find((e) => e.id === params.id);
  if (!ev) return <p>الفعالية ما موجودة.</p>;
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-5 space-y-3">
      <h1 className="font-black text-xl">{ev.title}</h1>
      <p className="text-gray-600">{ev.date} · {ev.location}</p>
      <p>{ev.description}</p>
      <div className="flex gap-1">{ev.attendees.map((a) => { const p = profileById(a); return p ? <Avatar key={a} profile={p} size={32} /> : null; })}</div>
      {current && <button onClick={() => toggleRsvp(ev.id)} className="bg-nile text-white rounded-full px-5 py-2 font-bold">{ev.attendees.includes(current.id) ? "إلغاء المشاركة" : "مشاركة في الفعالية"}</button>}
    </div>
  );
}
