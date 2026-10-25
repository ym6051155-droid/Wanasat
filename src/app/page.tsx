"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Composer } from "@/components/Composer";
import { PostCard } from "@/components/PostCard";
import { StoryBar } from "@/components/StoryBar";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const { state, current, loaded } = useStore();
  const router = useRouter();
  // غير المسجّل يذهب أولاً إلى صفحة الدخول المستقلة، لا إلى بطاقة ترحيب داخل التطبيق.
  useEffect(() => {
    if (loaded && !current) router.replace("/login");
  }, [current, loaded, router]);
  if (!current) return null;
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
