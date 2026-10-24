"use client";
import { useState } from "react";
import { Avatar } from "./Avatar";
import { useStore } from "@/lib/store";

export function Composer({ groupId, pageId }: { groupId?: string; pageId?: string }) {
  const { current, createPost } = useStore();
  const [text, setText] = useState("");
  if (!current) return null;
  return (
    <form className="bg-white rounded-2xl shadow-sm border p-4" onSubmit={(e) => { e.preventDefault(); createPost(text, groupId, pageId); setText(""); }}>
      <div className="flex gap-2">
        <Avatar profile={current} />
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="شنو في بالك؟" rows={2} className="flex-1 border rounded-2xl px-3 py-2 text-sm resize-none" />
      </div>
      <button className="mt-3 w-full bg-nile text-white rounded-full py-2 font-bold">نشر</button>
    </form>
  );
}
