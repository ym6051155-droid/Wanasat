"use client";
import { useRef, useState } from "react";
import { Avatar } from "./Avatar";
import { useStore } from "@/lib/store";

const MAX_MEDIA_BYTES = 2 * 1024 * 1024;

export function StoryBar() {
  const { state, profileById, addStory, current } = useStore();
  const [text, setText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaKind, setMediaKind] = useState<"image" | "video">("image");
  const [mediaError, setMediaError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const live = state.stories.filter((s) => new Date(s.expiresAt).getTime() > Date.now())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const open = live.find((s) => s.id === openId);

  const onFile = (file: File | undefined) => {
    setMediaError("");
    if (!file) return;
    if (file.size > MAX_MEDIA_BYTES) {
      setMediaError("حجم الملف أكبر من 2 ميغابايت. اختار ملفاً أصغر.");
      return;
    }
    const kind: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
    const reader = new FileReader();
    reader.onload = () => {
      setMediaUrl(String(reader.result));
      setMediaKind(kind);
    };
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = mediaUrl.trim();
    if (!text.trim() && !url) return;
    addStory(text, url ? { url, kind: mediaKind } : undefined);
    setText("");
    setMediaUrl("");
    setMediaKind("image");
    setMediaError("");
  };

  return (
    <section className="surface rounded-[24px] shadow-[0_10px_30px_rgba(23,32,42,0.08)] border p-3">
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {live.map((s) => {
          const a = profileById(s.authorId);
          if (!a) return null;
          return (
            <button key={s.id} onClick={() => setOpenId(s.id)} className="flex flex-col items-center gap-1 shrink-0">
              <span className="rounded-full p-[3px] bg-gradient-to-tr from-saffron via-nile to-saffron"><span className="block rounded-full p-[2px] bg-white"><Avatar profile={a} size={52} /></span></span>
              <span className="text-xs font-bold max-w-[64px] truncate">{a.name}</span>
            </button>
          );
        })}
      </div>
      {current && (
        <form className="mt-3 space-y-2" onSubmit={submit}>
          <div className="flex gap-2">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="قصة جديدة (تختفي بعد 24 ساعة)" className="flex-1 border rounded-full px-4 py-2.5 text-sm bg-sand text-ink placeholder:text-gray-500" />
            <button className="bg-saffron rounded-full px-5 font-black text-sm">نشر قصة</button>
          </div>
          <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          <button type="button" onClick={() => fileRef.current?.click()} className="border rounded-full px-4 py-2 font-black text-sm">صورة / فيديو للقصة</button>
          {mediaUrl && (
            <div className="relative">
              {mediaKind === "video" ? (
                <video src={mediaUrl} controls playsInline className="w-full rounded-[20px] max-h-[320px] bg-black" />
              ) : (
                <img src={mediaUrl} alt="معاينة وسائط القصة" className="w-full rounded-[20px] object-cover max-h-[320px]" />
              )}
              <button type="button" onClick={() => setMediaUrl("")} className="absolute top-2 left-2 bg-black/70 text-white rounded-full px-3 py-1.5 text-xs font-black">إزالة</button>
            </div>
          )}
          {mediaError && <p className="text-red-600 text-sm font-bold">{mediaError}</p>}
        </form>
      )}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6" onClick={() => setOpenId(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <div className="font-black text-lg">{profileById(open.authorId)?.name}</div>
            {open.mediaUrl && (open.mediaKind === "video" ? (
              <video src={open.mediaUrl} controls playsInline className="mt-4 w-full rounded-[20px] max-h-[420px] bg-black" />
            ) : (
              <img src={open.mediaUrl} alt="وسائط القصة" className="mt-4 w-full rounded-[20px] object-cover max-h-[420px]" />
            ))}
            {open.text.trim() && <p className="mt-4 text-xl leading-relaxed whitespace-pre-wrap">{open.text}</p>}
            <button onClick={() => setOpenId(null)} className="mt-6 w-full bg-nile text-white rounded-full py-2 font-bold">إغلاق</button>
          </div>
        </div>
      )}
    </section>
  );
}
