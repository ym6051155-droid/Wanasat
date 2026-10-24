"use client";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { useStore } from "@/lib/store";

export default function MessagesPage() {
  const { state, current, profileById } = useStore();
  if (!current) return <p>سجّل دخول أولاً.</p>;
  const convs = state.conversations.filter((c) => c.participantIds.includes(current.id));
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-4">
      <h1 className="font-black text-lg">الدردشة</h1>
      {convs.length === 0 && <p className="text-sm text-gray-500 mt-2">لسه ما في محادثات. افتح ملف أي زول واضغط مراسلة.</p>}
      {convs.map((c) => {
        const otherId = c.participantIds.find((id) => id !== current.id);
        const other = otherId ? profileById(otherId) : undefined;
        const last = c.messages[c.messages.length - 1];
        return (
          <Link key={c.id} href={`/messages/${c.id}`} className="flex items-center gap-2 mt-3 border-b pb-3">
            <Avatar profile={other} />
            <div className="flex-1">
              <div className="font-bold">{other?.name}</div>
              <div className="text-sm text-gray-500 truncate">{last ? last.text : "محادثة جديدة"}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
