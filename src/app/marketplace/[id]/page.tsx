"use client";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function ListingPage({ params }: { params: { id: string } }) {
  const { state, profileById, startConversation, current } = useStore();
  const item = state.listings.find((l) => l.id === params.id);
  if (!item) return <p>الإعلان ما موجود.</p>;
  const seller = profileById(item.sellerId);
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-5 space-y-3">
      <h1 className="font-black text-xl">{item.title}</h1>
      <div className="text-nile font-black text-lg">{item.price.toLocaleString("ar-SD")} جنيه</div>
      <p>{item.description}</p>
      <p className="text-sm text-gray-500">{item.state} · {timeAgo(item.createdAt)}</p>
      <div className="flex items-center gap-2 border-t pt-3">
        <Avatar profile={seller} />
        <div className="flex-1"><div className="font-bold">{seller?.name}</div><div className="text-sm text-gray-500">البائع</div></div>
        {current && seller && current.id !== seller.id && <Link href={`/messages/${startConversation(seller.id)}`} className="bg-nile text-white rounded-full px-4 py-2 font-bold text-sm">مراسلة البائع</Link>}
      </div>
    </div>
  );
}
