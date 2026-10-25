"use client";
import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { VerifiedBadge } from "@/components/icons";
import { PasswordField } from "@/components/PasswordField";
import { useStore } from "@/lib/store";

const STATES = ["الخرطوم", "ولاية الجزيرة", "البحر الأحمر", "كسلا", "القضارف", "شمال كردفان", "جنوب كردفان", "النيل الأبيض", "النيل الأزرق", "سنار", "الشمالية", "نهر النيل", "دارفور", "خارج السودان"];
const AVATAR_COLORS = ["#0e7c7b", "#0a5e5d", "#b45309", "#1d4ed8", "#be185d", "#15803d", "#7c3aed", "#334155"];

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { state, current, profileById, sendFriendRequest, toggleFollow, startConversation, updateProfile, changePassword, toggleVerification } = useStore();
  const profile = profileById(params.id);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [stateName, setStateName] = useState("");
  const [avatarColor, setAvatarColor] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);
  if (!profile) return <p>الملف ما موجود.</p>;
  const isMe = current?.id === profile.id;
  const isAdmin = current?.isAdmin === true;
  const friends = state.friendships.filter((f) => f.status === "accepted" && (f.fromId === profile.id || f.toId === profile.id));
  const followers = state.follows.filter((f) => f.followingId === profile.id).length;
  const posts = state.posts.filter((p) => p.authorId === profile.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const alreadyFriend = current ? state.friendships.some((f) => (f.fromId === current.id && f.toId === profile.id) || (f.fromId === profile.id && f.toId === current.id)) : false;
  const following = current ? state.follows.some((f) => f.followerId === current.id && f.followingId === profile.id) : false;

  const openEdit = () => {
    setName(profile.name);
    setBio(profile.bio);
    setStateName(profile.state);
    setAvatarColor(profile.avatarColor);
    setNewPassword("");
    setFormError("");
    setSaved(false);
    setEditing(true);
  };
  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = updateProfile(name, bio, stateName, avatarColor);
    if (err) { setFormError(err); return; }
    if (newPassword) {
      const perr = changePassword(newPassword);
      if (perr) { setFormError(perr); return; }
    }
    setSaved(true);
    setEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="surface rounded-[24px] shadow-[0_10px_30px_rgba(23,32,42,0.08)] border overflow-hidden">
        <div className="h-28" style={{ background: profile.coverColor }} />
        <div className="p-4 -mt-10 flex items-end gap-3">
          <Avatar profile={profile} size={80} />
          <div className="flex-1">
            <h1 className="text-xl font-black flex items-center gap-1.5 flex-wrap">
              {profile.name}
              {profile.verified && <VerifiedBadge size={20} />}
              {profile.isAdmin && <span className="bg-nile-light text-nile-dark text-xs font-black rounded-full px-2.5 py-1">مسؤول</span>}
            </h1>
            <p className="text-sm text-gray-500">{profile.state} · {friends.length} أصدقاء · {followers} متابعين</p>
            {profile.provider === "google" && <p className="text-xs text-gray-500">مرتبط بحساب قوقل</p>}
          </div>
        </div>
        <p className="px-4 pb-4">{profile.bio}</p>
        {saved && <p className="mx-4 mb-4 rounded-2xl bg-nile-light px-4 py-2.5 font-bold text-nile-dark text-sm">تم حفظ تعديلات الملف.</p>}
        <div className="px-4 pb-4 flex gap-2 flex-wrap">
          {isMe && (
            <button onClick={openEdit} className="bg-gradient-to-l from-nile to-nile-dark text-white rounded-full px-5 py-2.5 font-black text-sm">تعديل الملف</button>
          )}
          {isAdmin && !isMe && (
            <button onClick={() => toggleVerification(profile.id)} className="border rounded-full px-5 py-2.5 font-black text-sm">
              {profile.verified ? "إلغاء التوثيق" : "توثيق الحساب"}
            </button>
          )}
          {!isMe && current && (
            <>
              {!alreadyFriend && <button onClick={() => sendFriendRequest(profile.id)} className="bg-nile text-white rounded-full px-4 py-2 font-bold text-sm">إضافة صديق</button>}
              <button onClick={() => toggleFollow(profile.id)} className="border rounded-full px-4 py-2 font-bold text-sm">{following ? "إلغاء المتابعة" : "متابعة"}</button>
              <Link href={`/messages/${startConversation(profile.id)}`} className="border rounded-full px-4 py-2 font-bold text-sm">مراسلة</Link>
            </>
          )}
        </div>
        {isMe && editing && (
          <form onSubmit={saveEdit} className="mx-4 mb-4 rounded-[24px] border p-4 space-y-3">
            <h2 className="font-black">تعديل الملف الشخصي</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" className="w-full border rounded-2xl px-4 py-3 bg-sand text-ink placeholder:text-gray-500" />
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="نبذة عنك" rows={2} className="w-full border rounded-2xl px-4 py-3 bg-sand text-ink placeholder:text-gray-500" />
            <select value={stateName} onChange={(e) => setStateName(e.target.value)} className="w-full border rounded-2xl px-4 py-3 bg-sand text-ink">
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <div>
              <p className="text-sm font-bold mb-2">لون الصورة الرمزية</p>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAvatarColor(c)}
                    aria-label={`لون ${c}`}
                    className={`w-10 h-10 rounded-full ${avatarColor === c ? "ring-4 ring-nile" : "ring-1 ring-gray-300"}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <PasswordField value={newPassword} onChange={setNewPassword} placeholder="كلمة سر جديدة (اختياري، 4 أحرف على الأقل)" />
            {formError && <p className="text-red-600 text-sm font-bold">{formError}</p>}
            <div className="flex gap-2">
              <button className="flex-1 bg-gradient-to-l from-nile to-nile-dark text-white rounded-full py-3 font-black">حفظ التعديلات</button>
              <button type="button" onClick={() => setEditing(false)} className="flex-1 border rounded-full py-3 font-black">إلغاء</button>
            </div>
          </form>
        )}
      </div>
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}
