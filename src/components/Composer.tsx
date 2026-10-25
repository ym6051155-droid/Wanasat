"use client";
import { useRef, useState } from "react";
import { Avatar } from "./Avatar";
import { useStore } from "@/lib/store";

const MAX_MEDIA_BYTES = 2 * 1024 * 1024;

export function Composer({ groupId, pageId }: { groupId?: string; pageId?: string }) {
  const { current, createPost } = useStore();
  const [text, setText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaKind, setMediaKind] = useState<"image" | "video">("image");
  const [mediaError, setMediaError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  if (!current) return null;

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
    createPost(text, groupId, pageId, url ? { url, kind: mediaKind } : undefined);
    setText("");
    setMediaUrl("");
    setMediaKind("image");
    setMediaError("");
  };

  return (
    <form className="surface rounded-[24px] shadow-[0_10px_30px_rgba(23,32,42,0.08)] border p-4" onSubmit={submit}>
      <div className="flex gap-2">
        <Avatar profile={current} />
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="شنو في بالك؟" rows={2} className="flex-1 border rounded-[20px] px-4 py-3 text-sm resize-none bg-sand text-ink placeholder:text-gray-500" />
      </div>
      {mediaUrl && (
        <div className="mt-3 relative">
          {mediaKind === "video" ? (
            <video src={mediaUrl} controls playsInline className="w-full rounded-[20px] max-h-[320px] bg-black" />
          ) : (
            <img src={mediaUrl} alt="معاينة الوسائط" className="w-full rounded-[20px] object-cover max-h-[320px]" />
          )}
          <button type="button" onClick={() => setMediaUrl("")} className="absolute top-2 left-2 bg-black/70 text-white rounded-full px-3 py-1.5 text-xs font-black">إزالة</button>
        </div>
      )}
      <div className="mt-3 flex gap-2">
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        <button type="button" onClick={() => fileRef.current?.click()} className="border rounded-full px-4 py-2.5 font-black text-sm">صورة / فيديو</button>
        <select value={mediaKind} onChange={(e) => setMediaKind(e.target.value as "image" | "video")} className="border rounded-full px-3 py-2.5 text-sm bg-sand text-ink" aria-label="نوع الوسائط">
          <option value="image">صورة</option>
          <option value="video">فيديو</option>
        </select>
      </div>
      <input value={mediaUrl.startsWith("data:") ? "" : mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="أو الصق رابط صورة أو فيديو هنا (اختياري)" className="mt-2 w-full border rounded-full px-4 py-2.5 text-sm bg-sand text-ink placeholder:text-gray-500" />
      {mediaError && <p className="mt-2 text-red-600 text-sm font-bold">{mediaError}</p>}
      <button className="mt-3 w-full bg-gradient-to-l from-nile to-nile-dark text-white rounded-full py-3 font-black shadow-[0_8px_20px_rgba(14,124,123,0.35)]">نشر</button>
    </form>
  );
}
