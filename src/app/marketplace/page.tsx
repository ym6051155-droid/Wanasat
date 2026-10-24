"use client";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { useStore } from "@/lib/store";

export default function MarketplacePage() {
  const { state, profileById } = useStore();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-black text-xl">السوق</h1>
        <Link href="/marketplace/new" className="bg-nile text-white rounded-full px-4 py-2 font-bold text-sm">إعلان جديد</Link>
      </div>
      {state.listings.map((l) => {
        const s = profileById(l.sellerId);
        return (
          <Link key={l.id} href={`/marketplace/${l.id}`} className="bg-white rounded-3xl shadow-sm border p-4 block">
            <div className="font-black">{l.title}</div>
            <div className="text-nile font-black mt-1">{l.price.toLocaleString("ar-SD")} جنيه</div>
            <div className="text-sm text-gray-500">{l.state} · {s?.name}</div>
            <p className="text-sm mt-1 line-clamp-2">{l.description}</p>
          </Link>
        );
      })}
    </div>
  );
}
