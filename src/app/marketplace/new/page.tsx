"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useStore } from "@/lib/store";

const MAX_MEDIA_BYTES = 2 * 1024 * 1024;

export default function NewListingPage() {
  const { createListing, current } = useStore();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stateName, setStateName] = useState("الخرطوم");
  const [desc, setDesc] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaKind, setMediaKind] = useState<"image" | "video">("image");
  const [mediaError, setMediaError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  if (!current) return <p>سجّل دخول أولاً.</p>;

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

  return (
    <div className="bg-white rounded-3xl shadow-sm border p-5 max-w-md mx-auto">
      <h1 className="font-black text-xl">إعلان جديد</h1>
      <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); const url = mediaUrl.trim(); const id = createListing(title.trim(), Number(price) || 0, stateName, desc.trim(), url ? { url, kind: mediaKind } : undefined); router.push(`/marketplace/${id}`); }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الإعلان" className="w-full border rounded-2xl px-3 py-2" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="السعر بالجنيه" className="w-full border rounded-2xl px-3 py-2" />
        <input value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="الولاية" className="w-full border rounded-2xl px-3 py-2" />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="وصف السلعة" rows={3} className="w-full border rounded-2xl px-3 py-2" />
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        <button type="button" onClick={() => fileRef.current?.click()} className="border rounded-full px-4 py-2.5 font-black text-sm">صورة / فيديو للإعلان</button>
        <select value={mediaKind} onChange={(e) => setMediaKind(e.target.value as "image" | "video")} className="border rounded-full px-3 py-2.5 text-sm bg-sand text-ink" aria-label="نوع الوسائط">
          <option value="image">صورة</option>
          <option value="video">فيديو</option>
        </select>
        <input value={mediaUrl.startsWith("data:") ? "" : mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="أو الصق رابط صورة أو فيديو هنا (اختياري)" className="w-full border rounded-2xl px-3 py-2" />
        {mediaUrl && (
          <div className="relative">
            {mediaKind === "video" ? (
              <video src={mediaUrl} controls playsInline className="w-full rounded-[20px] max-h-[320px] bg-black" />
            ) : (
              <img src={mediaUrl} alt="معاينة وسائط الإعلان" className="w-full rounded-[20px] object-cover max-h-[320px]" />
            )}
            <button type="button" onClick={() => setMediaUrl("")} className="absolute top-2 left-2 bg-black/70 text-white rounded-full px-3 py-1.5 text-xs font-black">إزالة</button>
          </div>
        )}
        {mediaError && <p className="text-red-600 text-sm font-bold">{mediaError}</p>}
        <button className="w-full bg-nile text-white rounded-full py-2 font-bold">نشر الإعلان</button>
      </form>
    </div>
  );
}
