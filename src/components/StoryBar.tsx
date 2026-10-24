"use client";
import { useState } from "react";
import { Avatar } from "./Avatar";
import { useStore } from "@/lib/store";

export function StoryBar() {
  const { state, profileById, addStory, current } = useStore();
  const [text, setText] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const live = state.stories.filter((s) => new Date(s.expiresAt).getTime() > Date.now())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const open = live.find((s) => s.id === openId);
  return (
    <section className="bg-white rounded-2xl shadow-sm border p-3">
      <div className="flex gap-3 overflow-x-auto pb-1">
        {live.map((s) => {
          const a = profileById(s.authorId);
          if (!a) return null;
          return (
            <button key={s.id} onClick={() => setOpenId(s.id)} className="flex flex-col items-center gap-1 shrink-0">
              <span className="rounded-full p-0.5 border-2 border-saffron"><Avatar profile={a} size={52} /></span>
              <span className="text-xs max-w-[64px] truncate">{a.name}</span>
            </button>
          );
        })}
      </div>
      {current && (
        <form className="flex gap-2 mt-3" onSubmit={(e) => { e.preventDefault(); addStory(text); setText(""); }}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="قصة جديدة (تختفي بعد 24 ساعة)" className="flex-1 border rounded-full px-3 py-2 text-sm" />
          <button className="bg-saffron rounded-full px-4 font-bold text-sm">نشر قصة</button>
        </form>
      )}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6" onClick={() => setOpenId(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <div className="font-black text-lg">{profileById(open.authorId)?.name}</div>
            <p className="mt-4 text-xl leading-relaxed whitespace-pre-wrap">{open.text}</p>
            <button onClick={() => setOpenId(null)} className="mt-6 w-full bg-nile text-white rounded-full py-2 font-bold">إغلاق</button>
          </div>
        </div>
      )}
    </section>
  );
}
