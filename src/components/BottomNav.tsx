"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { BellIcon, EventsIcon, FriendsIcon, GroupsIcon, HomeIcon, MarketplaceIcon, MessagesIcon, MoreIcon, PagesIcon, ProfileIcon } from "./icons";

const tabs = [
  { href: "/", label: "الرئيسية", Icon: HomeIcon },
  { href: "/friends", label: "الأصدقاء", Icon: FriendsIcon },
  { href: "/groups", label: "المجموعات", Icon: GroupsIcon },
  { href: "/marketplace", label: "السوق", Icon: MarketplaceIcon },
  { href: "/messages", label: "الدردشة", Icon: MessagesIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { current, logout } = useStore();
  const [moreOpen, setMoreOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
  const closeAndGo = (href: string) => { setMoreOpen(false); router.push(href); };
  return (
    <>
      <nav className="surface fixed bottom-0 inset-x-0 z-40 border-t shadow-[0_-6px_24px_rgba(23,32,42,0.10)]">
        <div className="max-w-3xl mx-auto px-2 pt-1.5 pb-safe flex">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[58px] rounded-2xl text-[11px] font-black ${
                isActive(t.href) ? "text-nile" : "text-gray-500"
              }`}
            >
              <span className={`leading-none px-3 py-1.5 rounded-full flex items-center ${isActive(t.href) ? "bg-nile-light" : ""}`}><t.Icon size={24} /></span>
              {t.label}
            </Link>
          ))}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[58px] rounded-2xl text-[11px] font-black text-gray-500"
            aria-label="المزيد"
          >
            <span className="leading-none px-3 py-1.5 rounded-full flex items-center"><MoreIcon size={24} /></span>
            المزيد
          </button>
        </div>
      </nav>
      {moreOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={() => setMoreOpen(false)}>
          <div
            className="surface w-full max-w-3xl rounded-t-[28px] border-t p-4 pb-safe shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 rounded-full bg-gray-300 mx-auto mb-4" />
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => closeAndGo("/pages")} className="rounded-2xl border px-4 py-3.5 font-black text-right flex items-center gap-2"><PagesIcon size={20} /> الصفحات</button>
              <button onClick={() => closeAndGo("/events")} className="rounded-2xl border px-4 py-3.5 font-black text-right flex items-center gap-2"><EventsIcon size={20} /> الفعاليات</button>
              <button onClick={() => closeAndGo("/notifications")} className="rounded-2xl border px-4 py-3.5 font-black text-right flex items-center gap-2"><BellIcon size={20} /> الإشعارات</button>
              {current ? (
                <>
                  <button onClick={() => closeAndGo(`/profile/${current.id}`)} className="rounded-2xl border px-4 py-3.5 font-black text-right flex items-center gap-2"><ProfileIcon size={20} /> ملفي</button>
                  <button
                    onClick={() => { setMoreOpen(false); logout(); router.push("/login"); }}
                    className="rounded-2xl border px-4 py-3.5 font-black text-right text-red-600 col-span-2"
                  >
                    خروج
                  </button>
                </>
              ) : (
                <button onClick={() => closeAndGo("/login")} className="rounded-2xl border px-4 py-3.5 font-black text-right">دخول</button>
              )}
            </div>
            <button onClick={() => setMoreOpen(false)} className="mt-3 w-full rounded-full bg-sand py-3 font-black text-ink">
              إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
}
