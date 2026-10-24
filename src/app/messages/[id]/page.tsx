"use client";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { useStore } from "@/lib/store";

export default function ChatPage({ params }: { params: { id: string } }) {
  const { state, current, profileById, sendMessage } = useStore();
  const [text, setText] = useState("");
  const conv = state.conversations.find((c) => c.id === params.id);
  if (!conv || !current || !conv.participantIds.includes(current.id)) return <p>المحادثة ما موجودة.</p>;
  const otherId = conv.participantIds.find((id) => id !== current.id);
  const other = otherId ? profileById(otherId) : undefined;
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-4 flex flex-col min-h-[60vh]">
      <div className="flex items-center gap-2 border-b pb-3"><Avatar profile={other} /><span className="font-black">{other?.name}</span></div>
      <div className="flex-1 space-y-2 py-4">
        {conv.messages.map((m) => (
          <div key={m.id} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.senderId === current.id ? "bg-nile text-white mr-auto" : "bg-sand ml-auto"}`}>{m.text}</div>
        ))}
        {conv.messages.length === 0 && <p className="text-sm text-gray-500">ابدأ الونسة.</p>}
      </div>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); sendMessage(conv.id, text); setText(""); }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب رسالتك..." className="flex-1 border rounded-full px-3 py-2 text-sm" />
        <button className="bg-nile text-white rounded-full px-5 font-bold text-sm">إرسال</button>
      </form>
    </div>
  );
}
