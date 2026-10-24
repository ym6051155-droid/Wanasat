"use client";
import { Composer } from "@/components/Composer";
import { PostCard } from "@/components/PostCard";
import { useStore } from "@/lib/store";

export default function PageDetail({ params }: { params: { id: string } }) {
  const { state, current, togglePageFollow } = useStore();
  const page = state.pages.find((p) => p.id === params.id);
  if (!page) return <p>الصفحة ما موجودة.</p>;
  const posts = state.posts.filter((p) => p.pageId === page.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const isOwner = current?.id === page.ownerId;
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl shadow-sm border p-4">
        <h1 className="font-black text-xl">{page.name}</h1>
        <p className="text-gray-600">{page.description}</p>
        <p className="text-sm text-gray-500 mt-1">{page.followers.length} متابعين</p>
        {current && !isOwner && <button onClick={() => togglePageFollow(page.id)} className="mt-3 bg-nile text-white rounded-full px-4 py-1 font-bold text-sm">{page.followers.includes(current.id) ? "إلغاء المتابعة" : "متابعة"}</button>}
      </div>
      {isOwner && <Composer pageId={page.id} />}
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}
