"use client";
import Link from "next/link";
import { useState } from "react";
import { Avatar } from "./Avatar";
import { timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  const { current, profileById, state, toggleLike, addComment, sharePost, deletePost } = useStore();
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const author = profileById(post.authorId);
  const group = post.groupId ? state.groups.find((g) => g.id === post.groupId) : undefined;
  const page = post.pageId ? state.pages.find((p) => p.id === post.pageId) : undefined;
  const liked = current ? post.likes.includes(current.id) : false;
  return (
    <article className="bg-white rounded-2xl shadow-sm border p-4">
      <div className="flex items-center gap-2">
        <Avatar profile={author} />
        <div className="flex-1">
          <div className="font-bold">{author?.name ?? "مستخدم"}</div>
          <div className="text-xs text-gray-500">
            {timeAgo(post.createdAt)}
            {group && <> · في <Link href={`/groups/${group.id}`} className="font-bold">{group.name}</Link></>}
            {page && <> · في <Link href={`/pages/${page.id}`} className="font-bold">{page.name}</Link></>}
          </div>
        </div>
        {current?.id === post.authorId && (
          <button onClick={() => deletePost(post.id)} className="text-xs text-red-600 font-bold">حذف</button>
        )}
      </div>
      <p className="mt-3 whitespace-pre-wrap leading-relaxed">{post.text}</p>
      <div className="mt-3 text-xs text-gray-500">{post.likes.length} إعجاب · {post.comments.length} تعليق · {post.shares} مشاركة</div>
      <div className="mt-2 pt-2 border-t flex gap-2 text-sm font-bold">
        <button onClick={() => toggleLike(post.id)} className={liked ? "text-nile flex-1" : "flex-1"}>{liked ? "♥ أعجبني" : "♡ إعجاب"}</button>
        <button onClick={() => setShowComments((v) => !v)} className="flex-1">💬 تعليق</button>
        <button onClick={() => sharePost(post.id)} className="flex-1">↗ مشاركة</button>
      </div>
      {showComments && (
        <div className="mt-3 space-y-2">
          {post.comments.map((c) => {
            const ca = profileById(c.authorId);
            return (
              <div key={c.id} className="flex gap-2 items-start">
                <Avatar profile={ca} size={28} />
                <div className="bg-sand rounded-2xl px-3 py-2 flex-1">
                  <div className="font-bold text-sm">{ca?.name}</div>
                  <div className="text-sm">{c.text}</div>
                </div>
              </div>
            );
          })}
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); addComment(post.id, comment); setComment(""); }}>
            <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="اكتب تعليقك..." className="flex-1 border rounded-full px-3 py-2 text-sm" />
            <button className="bg-nile text-white rounded-full px-4 font-bold text-sm">إرسال</button>
          </form>
        </div>
      )}
    </article>
  );
}
