"use client";
import { Avatar } from "@/components/Avatar";
import { HeartIcon, VerifiedBadge } from "@/components/icons";
import { useStore } from "@/lib/store";

export default function ReelsPage() {
  const { state, current, profileById, toggleLike } = useStore();
  const reels = state.posts
    .filter((p) => p.mediaKind === "video" && (p.mediaUrl || p.imageUrl))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black">الريلز</h1>
      {reels.length === 0 && (
        <p className="surface rounded-[24px] border p-6 text-center text-gray-500">
          لسه ما في ريلز. انشر فيديو من الرئيسية وسيظهر هنا.
        </p>
      )}
      {reels.map((post) => {
        const author = profileById(post.authorId);
        const liked = current ? post.likes.includes(current.id) : false;
        return (
          <article key={post.id} className="surface rounded-[24px] shadow-[0_10px_30px_rgba(23,32,42,0.08)] border overflow-hidden">
            <video src={post.mediaUrl ?? post.imageUrl} controls playsInline className="w-full max-h-[560px] bg-black" />
            <div className="p-4">
              <div className="flex items-center gap-2">
                <Avatar profile={author} />
                <div className="font-black flex items-center gap-1.5">
                  {author?.name ?? "مستخدم"}
                  {author?.verified && <VerifiedBadge size={18} />}
                </div>
              </div>
              {post.text.trim() && <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[15px]">{post.text}</p>}
              <button
                onClick={() => toggleLike(post.id)}
                className={`mt-3 rounded-full px-5 py-2.5 font-black text-sm flex items-center gap-1.5 ${liked ? "bg-nile-light text-nile-dark" : "bg-sand text-ink"}`}
              >
                <HeartIcon size={18} filled={liked} /> {liked ? "أعجبني" : "إعجاب"} · {post.likes.length}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
