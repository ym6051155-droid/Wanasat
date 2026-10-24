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
      <div className="bg-white rounded-3xl shadow-sm border p-6 text-center">
        <h1 className="text-3xl font-black text-nile">{APP_NAME}</h1>
        <p className="mt-2 text-gray-600">ونسة سودانية أصيلة — أصدقاء، مجموعات، صفحات، سوق، وفعاليات.</p>
        <div className="mt-5 flex gap-2 justify-center">
          <Link href="/login" className="bg-nile text-white rounded-full px-6 py-2 font-bold">دخول</Link>
          <Link href="/signup" className="border rounded-full px-6 py-2 font-bold">حساب جديد</Link>
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
