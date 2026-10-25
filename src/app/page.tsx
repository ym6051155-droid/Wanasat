"use client";
import Link from "next/link";
import { APP_NAME } from "@/lib/brand";
import { Composer } from "@/components/Composer";
import { PostCard } from "@/components/PostCard";
import { StoryBar } from "@/components/StoryBar";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const { state, current } = useStore();
  if (!current) {
    return (
      <div className="surface rounded-[32px] shadow-[0_16px_40px_rgba(23,32,42,0.10)] border p-8 text-center">
        <h1 className="text-4xl font-black text-nile">{APP_NAME}</h1>
        <p className="mt-3 text-gray-600 leading-relaxed">أصدقاء، مجموعات، صفحات، سوق، وفعاليات.</p>
        <div className="mt-6 flex gap-2 justify-center">
          <Link href="/login" className="bg-gradient-to-l from-nile to-nile-dark text-white rounded-full px-8 py-3 font-black shadow-[0_8px_20px_rgba(14,124,123,0.35)]">دخول</Link>
          <Link href="/signup" className="border rounded-full px-8 py-3 font-black">حساب جديد</Link>
        </div>
      </div>
    );
  }
  const posts = [...state.posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="space-y-4">
      <StoryBar />
      <Composer />
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
      {posts.length === 0 && <p className="text-center text-gray-500">لسه ما في منشورات.</p>}
    </div>
  );
}
