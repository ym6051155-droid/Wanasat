"use client";
import { useState } from "react";
import { Avatar } from "./Avatar";
import { useStore } from "@/lib/store";

export function Composer({ groupId, pageId }: { groupId?: string; pageId?: string }) {
  const { current, createPost } = useStore();
  const [text, setText] = useState("");
  if (!current) return null;
  return (
    <form className="surface rounded-[24px] shadow-[0_10px_30px_rgba(23,32,42,0.08)] border p-4" onSubmit={(e) => { e.preventDefault(); createPost(text, groupId, pageId); setText(""); }}>
      <div className="flex gap-2">
        <Avatar profile={current} />
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="شنو في بالك؟" rows={2} className="flex-1 border rounded-[20px] px-4 py-3 text-sm resize-none bg-sand text-ink placeholder:text-gray-500" />
      </div>
      <button className="mt-3 w-full bg-gradient-to-l from-nile to-nile-dark text-white rounded-full py-3 font-black shadow-[0_8px_20px_rgba(14,124,123,0.35)]">نشر</button>
    </form>
  );
}
