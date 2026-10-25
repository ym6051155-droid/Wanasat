"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { AttachIcon, CheckIcon, DoubleCheckIcon, MicIcon, SearchIcon } from "@/components/icons";
import { useStore } from "@/lib/store";
import type { ChatMessage } from "@/lib/types";

const MAX_MEDIA_BYTES = 2 * 1024 * 1024;
const REACTION_EMOJIS = ["❤️", "👍", "😂", "😮", "😢"];
const COMPOSER_EMOJIS = ["❤️", "👍", "😂", "😮", "😢", "🙏", "🔥", "👏", "😊", "🎉"];

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
function dayKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function dayLabel(iso: string) {
  return new Date(iso).toLocaleDateString("ar", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function mediaLabel(kind?: string) {
  return kind === "image" ? "صورة" : kind === "video" ? "فيديو" : kind === "audio" ? "تسجيل صوتي" : "وسائط";
}
function highlight(text: string, q: string) {
  if (!q) return text;
  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  const parts: React.ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (true) {
    const idx = lower.indexOf(needle, i);
    if (idx === -1) { parts.push(text.slice(i)); break; }
    parts.push(text.slice(i, idx));
    parts.push(<mark key={k++} className="bg-yellow-300 text-black rounded px-0.5">{text.slice(idx, idx + needle.length)}</mark>);
    i = idx + needle.length;
  }
  return <>{parts}</>;
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const { state, current, profileById, sendMessage, toggleReaction, deleteMessageForMe, deleteMessageForEveryone, forwardMessage, markConversationRead } = useStore();
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [forwarding, setForwarding] = useState(false);
  const [forwardedNotice, setForwardedNotice] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaKind, setMediaKind] = useState<"image" | "video">("image");
  const [mediaError, setMediaError] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const conv = state.conversations.find((c) => c.id === params.id);
  // Mark the other person's messages read when this conversation is opened.
  useEffect(() => {
    if (conv && current && conv.messages.some((m) => m.senderId !== current.id && !m.read)) {
      markConversationRead(conv.id);
    }
  });
  if (!conv || !current || !conv.participantIds.includes(current.id)) return <p>المحادثة ما موجودة.</p>;
  const otherId = conv.participantIds.find((id) => id !== current.id);
  const other = otherId ? profileById(otherId) : undefined;
  const visible = conv.messages.filter((m) => !(m.hiddenFor ?? []).includes(current.id));
  const q = search.trim().toLowerCase();
  const displayed = q ? visible.filter((m) => m.text.toLowerCase().includes(q)) : visible;
  const selected = conv.messages.find((m) => m.id === selectedId) ?? null;
  const replyTo = conv.messages.find((m) => m.id === replyToId) ?? null;
  const otherConvs = state.conversations.filter((c) => c.participantIds.includes(current.id) && c.id !== conv.id);

  const onFile = (file: File | undefined) => {
    setMediaError("");
    if (!file) return;
    if (file.size > MAX_MEDIA_BYTES) {
      setMediaError("حجم الملف أكبر من 2 ميغابايت. اختار ملفاً أصغر.");
      return;
    }
    const kind: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
    const reader = new FileReader();
    reader.onload = () => { setMediaUrl(String(reader.result)); setMediaKind(kind); };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    setVoiceError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : undefined;
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => setVoiceUrl(String(reader.result));
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      recRef.current = rec;
      rec.start();
      setRecording(true);
    } catch {
      setVoiceError("ما قدرنا نوصل للميكروفون. اسمح بالميكروفون من إعدادات المتصفح وحاول تاني.");
    }
  };
  const stopRecording = () => { recRef.current?.stop(); setRecording(false); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (voiceUrl) {
      sendMessage(conv.id, text, { url: voiceUrl, kind: "audio" }, replyToId ?? undefined);
    } else if (mediaUrl.trim()) {
      sendMessage(conv.id, text, { url: mediaUrl.trim(), kind: mediaKind }, replyToId ?? undefined);
    } else {
      if (!text.trim()) return;
      sendMessage(conv.id, text, undefined, replyToId ?? undefined);
    }
    setText(""); setMediaUrl(""); setMediaKind("image"); setMediaError(""); setVoiceUrl(""); setReplyToId(null);
  };

  const renderMedia = (m: ChatMessage) => {
    if (!m.mediaUrl) return null;
    if (m.mediaKind === "audio") return <audio src={m.mediaUrl} controls className="mt-1 max-w-full" />;
    if (m.mediaKind === "video") return <video src={m.mediaUrl} controls playsInline className="mt-1 w-full rounded-[16px] max-h-[320px] bg-black" />;
    return <img src={m.mediaUrl} alt="صورة في الدردشة" className="mt-1 w-full rounded-[16px] object-cover max-h-[320px]" />;
  };
  const renderQuote = (m: ChatMessage) => {
    const orig = conv.messages.find((x) => x.id === m.replyToId);
    if (!orig) return null;
    const author = profileById(orig.senderId)?.name ?? "زول";
    return (
      <div className="mb-1 border-r-2 border-saffron pr-2 text-xs opacity-80">
        <span className="font-black">{author}: </span>
        {orig.text ? orig.text : mediaLabel(orig.mediaKind)}
      </div>
    );
  };

  let lastDay = "";
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-4 flex flex-col min-h-[60vh]">
      <div className="flex items-center gap-2 border-b pb-3">
        <Link href="/messages" className="font-bold text-sm shrink-0">رجوع</Link>
        <Avatar profile={other} />
        <span className="font-black flex-1">{other?.name}</span>
      </div>
      <div className="mt-3 flex items-center gap-2 border rounded-full px-4 py-2 bg-sand">
        <SearchIcon size={18} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث في المحادثة..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500" />
      </div>
      {q && <p className="mt-2 text-xs text-gray-500">{displayed.length} نتيجة مطابقة</p>}
      <div className="flex-1 space-y-2 py-4">
        {displayed.map((m) => {
          const day = dayKey(m.createdAt);
          const showDay = day !== lastDay;
          lastDay = day;
          const mine = m.senderId === current.id;
          const counts = new Map<string, number>();
          (m.reactions ?? []).forEach((r) => counts.set(r.emoji, (counts.get(r.emoji) ?? 0) + 1));
          return (
            <div key={m.id}>
              {showDay && <div className="text-center my-3"><span className="bg-sand text-gray-600 text-xs font-bold rounded-full px-4 py-1.5">{dayLabel(m.createdAt)}</span></div>}
              <button type="button" onClick={() => setSelectedId(selectedId === m.id ? null : m.id)} className={`block max-w-[85%] rounded-2xl px-3 py-2 text-sm text-right ${mine ? "bg-nile text-white mr-auto" : "bg-sand ml-auto"}`}>
                {m.forwarded && <div className="text-xs opacity-70 mb-1">محولة</div>}
                {renderQuote(m)}
                {renderMedia(m)}
                {m.text && <div className="whitespace-pre-wrap">{highlight(m.text, q)}</div>}
                <div className={`flex items-center gap-1 mt-1 text-[11px] ${mine ? "text-white/80" : "text-gray-500"}`}>
                  <span>{timeOf(m.createdAt)}</span>
                  {mine && (m.read
                    ? <DoubleCheckIcon size={16} className="text-nile-dark" />
                    : m.delivered
                      ? <DoubleCheckIcon size={16} className="text-gray-400" />
                      : <CheckIcon size={16} className="text-gray-400" />)}
                </div>
              </button>
              {counts.size > 0 && (
                <div className={`flex gap-1 mt-1 ${mine ? "justify-start" : "justify-end"}`}>
                  {[...counts.entries()].map(([emoji, n]) => (
                    <span key={emoji} className="bg-sand border rounded-full px-2 py-0.5 text-xs font-bold">{emoji} {n}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {displayed.length === 0 && <p className="text-sm text-gray-500">{visible.length === 0 ? "ابدأ الونسة." : "ما في نتائج مطابقة."}</p>}
      </div>

      {selected && (
        <div className="border rounded-2xl p-3 mb-3 bg-sand">
          <div className="flex items-center justify-between">
            <span className="font-black text-sm">خيارات الرسالة</span>
            <button type="button" onClick={() => { setSelectedId(null); setForwarding(false); }} className="text-sm font-bold">إغلاق</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <button type="button" onClick={() => { setReplyToId(selected.id); setSelectedId(null); }} className="border bg-white rounded-full px-4 py-2 text-sm font-bold">رد</button>
            <button type="button" onClick={() => { deleteMessageForMe(conv.id, selected.id); setSelectedId(null); }} className="border bg-white rounded-full px-4 py-2 text-sm font-bold">حذف لي</button>
            <button type="button" onClick={() => { deleteMessageForEveryone(conv.id, selected.id); setSelectedId(null); }} className="border bg-white rounded-full px-4 py-2 text-sm font-bold">حذف للكل</button>
            <button type="button" onClick={() => setForwarding(!forwarding)} className="border bg-white rounded-full px-4 py-2 text-sm font-bold">تحويل</button>
          </div>
          <div className="flex gap-2 mt-2">
            {REACTION_EMOJIS.map((emoji) => (
              <button key={emoji} type="button" onClick={() => { toggleReaction(conv.id, selected.id, emoji); }} className="bg-white border rounded-full w-10 h-10 text-lg" aria-label={`تفاعل ${emoji}`}>{emoji}</button>
            ))}
          </div>
          {forwarding && (
            <div className="mt-3">
              <p className="text-sm font-bold mb-2">حوّل إلى:</p>
              {otherConvs.length === 0 && <p className="text-sm text-gray-500">ما في محادثات تانية للتحويل ليها.</p>}
              {otherConvs.map((c) => {
                const o = profileById(c.participantIds.find((id) => id !== current.id) ?? "");
                return (
                  <button key={c.id} type="button" onClick={() => { forwardMessage(conv.id, selected.id, c.id); setSelectedId(null); setForwarding(false); setForwardedNotice(`تم تحويل الرسالة إلى ${o?.name ?? "محادثة"}.`); }} className="block w-full text-right border bg-white rounded-2xl px-4 py-2.5 text-sm font-bold mt-1">{o?.name}</button>
                );
              })}
            </div>
          )}
        </div>
      )}
      {forwardedNotice && <p className="text-sm text-nile-dark font-bold mb-2">{forwardedNotice}</p>}

      {replyTo && (
        <div className="flex items-center justify-between border rounded-2xl px-4 py-2 mb-2 bg-sand text-sm">
          <span><span className="font-black">رد على: </span>{replyTo.text ? replyTo.text : mediaLabel(replyTo.mediaKind)}</span>
          <button type="button" onClick={() => setReplyToId(null)} className="font-bold">إلغاء</button>
        </div>
      )}
      {(mediaUrl || voiceUrl) && (
        <div className="mb-2 relative">
          {voiceUrl ? (
            <audio src={voiceUrl} controls className="w-full" />
          ) : mediaKind === "video" ? (
            <video src={mediaUrl} controls playsInline className="w-full rounded-[20px] max-h-[320px] bg-black" />
          ) : (
            <img src={mediaUrl} alt="معاينة الوسائط" className="w-full rounded-[20px] object-cover max-h-[320px]" />
          )}
          <button type="button" onClick={() => { setMediaUrl(""); setVoiceUrl(""); }} className="absolute top-2 left-2 bg-black/70 text-white rounded-full px-3 py-1.5 text-xs font-black">إزالة</button>
        </div>
      )}
      {showEmojis && (
        <div className="flex flex-wrap gap-2 mb-2">
          {COMPOSER_EMOJIS.map((emoji) => (
            <button key={emoji} type="button" onClick={() => setText((t) => t + emoji)} className="bg-sand border rounded-full w-10 h-10 text-lg" aria-label="إدراج إيموجي">{emoji}</button>
          ))}
        </div>
      )}
      <form className="flex gap-2 items-center" onSubmit={submit}>
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        <button type="button" onClick={() => fileRef.current?.click()} className="border rounded-full w-11 h-11 flex items-center justify-center shrink-0" aria-label="إرفاق صورة أو فيديو"><AttachIcon size={20} /></button>
        <button type="button" onClick={() => setShowEmojis(!showEmojis)} className="border rounded-full px-3 h-11 font-bold text-sm shrink-0">إيموجي</button>
        {recording ? (
          <button type="button" onClick={stopRecording} className="bg-red-600 text-white rounded-full px-4 h-11 font-bold text-sm shrink-0">إيقاف التسجيل</button>
        ) : (
          <button type="button" onClick={startRecording} className="border rounded-full w-11 h-11 flex items-center justify-center shrink-0" aria-label="تسجيل رسالة صوتية"><MicIcon size={20} /></button>
        )}
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب رسالتك..." className="flex-1 border rounded-full px-3 py-2.5 text-sm min-w-0" />
        <button className="bg-nile text-white rounded-full px-5 h-11 font-bold text-sm shrink-0">إرسال</button>
      </form>
      {recording && <p className="mt-2 text-sm font-bold text-red-600">جارٍ التسجيل... اضغط إيقاف التسجيل للإرسال.</p>}
      {mediaError && <p className="mt-2 text-red-600 text-sm font-bold">{mediaError}</p>}
      {voiceError && <p className="mt-2 text-red-600 text-sm font-bold">{voiceError}</p>}
      <p className="mt-2 text-xs text-gray-500">اضغط على أي رسالة لفتح خياراتها: رد، تفاعل، حذف، تحويل.</p>
    </div>
  );
}
