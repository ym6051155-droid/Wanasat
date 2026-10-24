"use client";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { useStore } from "@/lib/store";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { state, current, profileById, sendFriendRequest, toggleFollow, startConversation } = useStore();
  const profile = profileById(params.id);
  if (!profile) return <p>الملف ما موجود.</p>;
  const isMe = current?.id === profile.id;
  const friends = state.friendships.filter((f) => f.status === "accepted" && (f.fromId === profile.id || f.toId === profile.id));
  const followers = state.follows.filter((f) => f.followingId === profile.id).length;
  const posts = state.posts.filter((p) => p.authorId === profile.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const alreadyFriend = current ? state.friendships.some((f) => (f.fromId === current.id && f.toId === profile.id) || (f.fromId === profile.id && f.toId === current.id)) : false;
  const following = current ? state.follows.some((f) => f.followerId === current.id && f.followingId === profile.id) : false;
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <div className="h-28" style={{ background: profile.coverColor }} />
        <div className="p-4 -mt-10 flex items-end gap-3">
          <Avatar profile={profile} size={80} />
          <div className="flex-1">
            <h1 className="text-xl font-black">{profile.name}</h1>
            <p className="text-sm text-gray-500">{profile.state} · {friends.length} أصدقاء · {followers} متابعين</p>
          </div>
        </div>
        <p className="px-4 pb-4">{profile.bio}</p>
        {!isMe && current && (
          <div className="px-4 pb-4 flex gap-2">
            {!alreadyFriend && <button onClick={() => sendFriendRequest(profile.id)} className="bg-nile text-white rounded-full px-4 py-2 font-bold text-sm">إضافة صديق</button>}
            <button onClick={() => toggleFollow(profile.id)} className="border rounded-full px-4 py-2 font-bold text-sm">{following ? "إلغاء المتابعة" : "متابعة"}</button>
            <Link href={`/messages/${startConversation(profile.id)}`} className="border rounded-full px-4 py-2 font-bold text-sm">مراسلة</Link>
          </div>
        )}
      </div>
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}
