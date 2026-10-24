"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP_NAME } from "@/lib/brand";
import { useStore } from "@/lib/store";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/friends", label: "الأصدقاء" },
  { href: "/groups", label: "المجموعات" },
  { href: "/pages", label: "الصفحات" },
  { href: "/marketplace", label: "السوق" },
  { href: "/events", label: "الفعاليات" },
  { href: "/messages", label: "الدردشة" },
];

export function Header() {
  const { current, state, logout } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const unread = current ? state.notifications.filter((n) => n.userId === current.id && !n.read).length : 0;
  return (
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="max-w-3xl mx-auto px-3 py-2 flex items-center gap-3">
        <Link href="/" className="font-black text-xl text-nile shrink-0">{APP_NAME}</Link>
        <form className="flex-1" onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${encodeURIComponent(q)}`); }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن ناس، مجموعات، صفحات..." className="w-full border rounded-full px-3 py-1.5 text-sm bg-sand" />
        </form>
        <Link href="/notifications" className="relative shrink-0 font-bold text-sm">
          🔔{unread > 0 && <span className="absolute -top-2 -left-2 bg-red-600 text-white text-[10px] rounded-full px-1.5">{unread}</span>}
        </Link>
        {current ? (
          <button onClick={() => { logout(); router.push("/login"); }} className="shrink-0 text-sm font-bold">خروج</button>
        ) : (
          <Link href="/login" className="shrink-0 text-sm font-bold">دخول</Link>
        )}
      </div>
      <nav className="max-w-3xl mx-auto px-3 pb-2 flex gap-3 overflow-x-auto text-sm whitespace-nowrap">
        {links.map((l) => <Link key={l.href} href={l.href} className="font-bold">{l.label}</Link>)}
        {current && <Link href={`/profile/${current.id}`} className="font-bold">ملفي</Link>}
      </nav>
    </header>
  );
}
