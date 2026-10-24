"use client";
import { useEffect } from "react";
import { timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function NotificationsPage() {
  const { state, current, markNotificationsRead } = useStore();
  useEffect(() => { markNotificationsRead(); }, []);
  if (!current) return <p>سجّل دخول أولاً.</p>;
  const items = state.notifications.filter((n) => n.userId === current.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-4">
      <h1 className="font-black text-lg">الإشعارات</h1>
      {items.length === 0 && <p className="text-sm text-gray-500 mt-2">ما في إشعارات.</p>}
      {items.map((n) => (
        <div key={n.id} className={`border-b py-3 ${n.read ? "text-gray-600" : "font-bold"}`}>
          <div>{n.text}</div>
          <div className="text-xs text-gray-400">{timeAgo(n.createdAt)}</div>
        </div>
      ))}
    </div>
  );
}
