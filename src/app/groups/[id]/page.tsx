"use client";
import { Composer } from "@/components/Composer";
import { PostCard } from "@/components/PostCard";
import { Avatar } from "@/components/Avatar";
import { useStore } from "@/lib/store";

export default function GroupPage({ params }: { params: { id: string } }) {
  const { state, current, profileById, joinGroup, leaveGroup } = useStore();
  const group = state.groups.find((g) => g.id === params.id);
  if (!group) return <p>المجموعة ما موجودة.</p>;
  const member = current ? group.members.includes(current.id) : false;
  const posts = state.posts.filter((p) => p.groupId === group.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl shadow-sm border p-4">
        <h1 className="font-black text-xl">{group.name}</h1>
        <p className="text-gray-600">{group.description}</p>
        <p className="text-sm text-gray-500 mt-1">{group.members.length} أعضاء</p>
        <div className="flex gap-1 mt-3">{group.members.map((m) => { const p = profileById(m); return p ? <Avatar key={m} profile={p} size={32} /> : null; })}</div>
        {current && (member
          ? <button onClick={() => leaveGroup(group.id)} className="mt-3 border rounded-full px-4 py-1 font-bold text-sm">مغادرة</button>
          : <button onClick={() => joinGroup(group.id)} className="mt-3 bg-nile text-white rounded-full px-4 py-1 font-bold text-sm">انضمام</button>)}
      </div>
      {member && <Composer groupId={group.id} />}
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}
