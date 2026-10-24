"use client";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { useStore } from "@/lib/store";

export default function FriendsPage() {
  const { state, current, profileById, acceptFriend, rejectFriend, sendFriendRequest } = useStore();
  if (!current) return <p>سجّل دخول أولاً.</p>;
  const incoming = state.friendships.filter((f) => f.toId === current.id && f.status === "pending");
  const mine = state.friendships.filter((f) => f.status === "accepted" && (f.fromId === current.id || f.toId === current.id));
  const friendIds = new Set(mine.map((f) => (f.fromId === current.id ? f.toId : f.fromId)));
  const suggestions = state.profiles.filter((p) => p.id !== current.id && !friendIds.has(p.id));
  return (
    <div className="space-y-4">
      <section className="bg-white rounded-3xl shadow-sm border p-4">
        <h1 className="font-black text-lg">طلبات الصداقة</h1>
        {incoming.length === 0 && <p className="text-sm text-gray-500 mt-2">ما في طلبات جديدة.</p>}
        {incoming.map((f) => {
          const p = profileById(f.fromId); if (!p) return null;
          return (
            <div key={f.id} className="flex items-center gap-2 mt-3">
              <Avatar profile={p} /><span className="flex-1 font-bold">{p.name}</span>
              <button onClick={() => acceptFriend(f.id)} className="bg-nile text-white rounded-full px-3 py-1 text-sm font-bold">قبول</button>
              <button onClick={() => rejectFriend(f.id)} className="border rounded-full px-3 py-1 text-sm font-bold">رفض</button>
            </div>
          );
        })}
      </section>
      <section className="bg-white rounded-3xl shadow-sm border p-4">
        <h2 className="font-black text-lg">أصدقائي ({mine.length})</h2>
        {[...friendIds].map((id) => { const p = profileById(id); return p ? <Link key={id} href={`/profile/${id}`} className="flex items-center gap-2 mt-3"><Avatar profile={p} /><span className="font-bold">{p.name}</span></Link> : null; })}
      </section>
      <section className="bg-white rounded-3xl shadow-sm border p-4">
        <h2 className="font-black text-lg">ناس ممكن تعرفهم</h2>
        {suggestions.map((p) => (
          <div key={p.id} className="flex items-center gap-2 mt-3">
            <Avatar profile={p} /><span className="flex-1 font-bold">{p.name} <span className="text-gray-500 font-normal text-sm">· {p.state}</span></span>
            <button onClick={() => sendFriendRequest(p.id)} className="bg-nile text-white rounded-full px-3 py-1 text-sm font-bold">إضافة</button>
          </div>
        ))}
      </section>
    </div>
  );
}
