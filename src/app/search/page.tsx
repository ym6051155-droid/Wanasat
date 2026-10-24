"use client";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { useStore } from "@/lib/store";

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const { state, profileById } = useStore();
  const q = (searchParams.q ?? "").trim().toLowerCase();
  if (!q) return <p>اكتب كلمة بحث في الأعلى.</p>;
  const people = state.profiles.filter((p) => p.name.toLowerCase().includes(q) || p.state.includes(q));
  const groups = state.groups.filter((g) => g.name.toLowerCase().includes(q));
  const pages = state.pages.filter((p) => p.name.toLowerCase().includes(q));
  const posts = state.posts.filter((p) => p.text.toLowerCase().includes(q));
  return (
    <div className="space-y-4">
      <h1 className="font-black text-xl">نتائج البحث: {searchParams.q}</h1>
      {people.length > 0 && (
        <section className="bg-white rounded-3xl shadow-sm border p-4">
          <h2 className="font-black">ناس</h2>
          {people.map((p) => <Link key={p.id} href={`/profile/${p.id}`} className="flex items-center gap-2 mt-3"><Avatar profile={p} /><span className="font-bold">{p.name} <span className="text-gray-500 font-normal text-sm">· {p.state}</span></span></Link>)}
        </section>
      )}
      {groups.length > 0 && (
        <section className="bg-white rounded-3xl shadow-sm border p-4">
          <h2 className="font-black">مجموعات</h2>
          {groups.map((g) => <Link key={g.id} href={`/groups/${g.id}`} className="block mt-2 font-bold">{g.name}</Link>)}
        </section>
      )}
      {pages.length > 0 && (
        <section className="bg-white rounded-3xl shadow-sm border p-4">
          <h2 className="font-black">صفحات</h2>
          {pages.map((p) => <Link key={p.id} href={`/pages/${p.id}`} className="block mt-2 font-bold">{p.name}</Link>)}
        </section>
      )}
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
      {people.length + groups.length + pages.length + posts.length === 0 && <p className="text-gray-500">ما لقينا نتائج مطابقة.</p>}
    </div>
  );
}
