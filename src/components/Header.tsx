"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP_NAME } from "@/lib/brand";
import { useStore } from "@/lib/store";
import { Avatar } from "./Avatar";
import { BellIcon } from "./icons";

export function Header() {
  const { current, state } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const unread = current ? state.notifications.filter((n) => n.userId === current.id && !n.read).length : 0;
  return (
    <header className="surface sticky top-0 z-40 border-b shadow-[0_4px_20px_rgba(23,32,42,0.06)]">
      <div className="max-w-3xl mx-auto px-3 py-2.5 flex items-center gap-2.5">
        <Link href="/" className="font-black text-[22px] leading-none text-nile shrink-0" aria-label={APP_NAME}>
          {APP_NAME}
        </Link>
        <form className="flex-1 min-w-0" onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${encodeURIComponent(q)}`); }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن ناس، مجموعات، صفحات..."
            className="w-full border rounded-full px-4 py-2.5 text-sm bg-sand text-ink placeholder:text-gray-500"
          />
        </form>
        <Link
          href="/notifications"
          className="relative shrink-0 w-11 h-11 rounded-full bg-nile-light text-nile-dark flex items-center justify-center text-lg font-bold"
          aria-label="الإشعارات"
        >
          <BellIcon size={22} />
          {unread > 0 && (
            <span className="absolute -top-1 -left-1 bg-red-600 text-white text-[10px] font-black rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
              {unread}
            </span>
          )}
        </Link>
        {current ? (
          <Avatar profile={current} size={44} />
        ) : (
          <Link href="/login" className="shrink-0 bg-nile text-white rounded-full px-5 h-11 flex items-center text-sm font-black shadow-[0_6px_16px_rgba(14,124,123,0.35)]">
            دخول
          </Link>
        )}
      </div>
    </header>
  );
}
