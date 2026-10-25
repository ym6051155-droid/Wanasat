"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { SearchIcon } from "@/components/icons";
import { useStore } from "@/lib/store";

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function previewOf(last: { text: string; mediaKind?: string } | undefined, mine: boolean) {
  if (!last) return "محادثة جديدة";
  const body = last.mediaKind === "image" ? "صورة" : last.mediaKind === "video" ? "فيديو" : last.mediaKind === "audio" ? "تسجيل صوتي" : last.text || "وسائط";
  return mine ? `أنت: ${body}` : body;
}

export default function MessagesPage() {
  const { state, current, loaded, profileById, markConversationsDelivered } = useStore();
  const [query, setQuery] = useState("");
  const deliveredOnce = useRef(false);
  // Delivered = the message reached the other person's device (their list
  // loaded). Read is only set when they open the conversation itself.
  // Wait for saved state to load first, or the provider's load would
  // overwrite the delivered flags with the pre-load state.
  useEffect(() => {
    if (loaded && !deliveredOnce.current) {
      deliveredOnce.current = true;
      markConversationsDelivered();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);
  if (!current) return <p>سجّل دخول أولاً.</p>;
  const convs = state.conversations
    .filter((c) => c.participantIds.includes(current.id))
    .map((c) => {
      const visible = c.messages.filter((m) => !(m.hiddenFor ?? []).includes(current.id));
      return { ...c, visible, last: visible[visible.length - 1] };
    })
    .sort((a, b) => (b.last?.createdAt ?? "").localeCompare(a.last?.createdAt ?? ""));
  const q = query.trim().toLowerCase();
  const shown = q
    ? convs.filter((c) => {
        const other = profileById(c.participantIds.find((id) => id !== current.id) ?? "");
        return (other?.name ?? "").toLowerCase().includes(q) || (c.last?.text ?? "").toLowerCase().includes(q);
      })
    : convs;
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-4">
      <h1 className="font-black text-lg">الدردشة</h1>
      <div className="mt-3 flex items-center gap-2 border rounded-full px-4 py-2.5 bg-sand">
        <SearchIcon size={18} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث في المحادثات..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500" />
      </div>
      {shown.length === 0 && <p className="text-sm text-gray-500 mt-3">{convs.length === 0 ? "لسه ما في محادثات. افتح ملف أي زول واضغط مراسلة." : "ما في نتائج مطابقة."}</p>}
      {shown.map((c) => {
        const otherId = c.participantIds.find((id) => id !== current.id);
        const other = otherId ? profileById(otherId) : undefined;
        const unread = c.visible.filter((m) => m.senderId !== current.id && !m.read).length;
        return (
          <Link key={c.id} href={`/messages/${c.id}`} className="flex items-center gap-2 mt-3 border-b pb-3">
            <Avatar profile={other} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold truncate">{other?.name}</span>
                {c.last && <span className="text-xs text-gray-500 shrink-0">{timeOf(c.last.createdAt)}</span>}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-500 truncate">{previewOf(c.last, c.last?.senderId === current.id)}</span>
                {unread > 0 && <span className="shrink-0 bg-nile text-white text-xs font-black rounded-full min-w-[22px] h-[22px] px-1 flex items-center justify-center">{unread}</span>}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
