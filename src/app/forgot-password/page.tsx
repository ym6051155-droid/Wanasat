"use client";
import Link from "next/link";
import { useState } from "react";
import { APP_NAME } from "@/lib/brand";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { PasswordField } from "@/components/PasswordField";

export default function ForgotPasswordPage() {
  const { resetPassword } = useStore();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (supabaseConfigured) {
      // Live flow: never reveal whether the email exists.
      const client = getSupabase();
      if (client) await client.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/login` });
      setSent(true);
      return;
    }
    if (newPassword !== confirm) { setError("كلمتا السر ما متطابقتين."); return; }
    const err = resetPassword(email, newPassword);
    if (err) { setError(err); return; }
    setDone(true);
  };

  return (
    <div className="surface rounded-[32px] shadow-[0_16px_40px_rgba(23,32,42,0.10)] border p-6 max-w-md mx-auto w-full">
      <h1 className="text-3xl font-black text-nile text-center">هل نسيت كلمة السر؟</h1>
      <p className="text-sm text-gray-500 mt-2 text-center">
        {supabaseConfigured
          ? "اكتب بريدك، ولو الحساب موجود حتوصلك رسالة لإعادة تعيين كلمة السر."
          : "في الوضع التجريبي، اكتب بريد الحساب وكلمة سر جديدة مباشرة."}
      </p>
      {sent ? (
        <p className="mt-4 rounded-2xl bg-nile-light px-4 py-3 font-bold text-nile-dark text-center">
          لو البريد ده مسجّل عندنا، حتوصلك رسالة لإعادة تعيين كلمة السر. راجع بريدك.
        </p>
      ) : done ? (
        <div className="mt-4 text-center">
          <p className="rounded-2xl bg-nile-light px-4 py-3 font-bold text-nile-dark">تم تغيير كلمة السر. سجّل دخول بالكلمة الجديدة.</p>
          <Link href="/login" className="inline-block mt-4 font-black">الذهاب لصفحة الدخول</Link>
        </div>
      ) : (
        <form className="mt-4 space-y-3" onSubmit={submit}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" className="w-full border rounded-2xl px-4 py-3 bg-sand text-ink placeholder:text-gray-500" />
          {!supabaseConfigured && (
            <>
              <PasswordField value={newPassword} onChange={setNewPassword} placeholder="كلمة السر الجديدة" />
              <PasswordField value={confirm} onChange={setConfirm} placeholder="تأكيد كلمة السر الجديدة" />
            </>
          )}
          {error && <p className="text-red-600 text-sm font-bold">{error}</p>}
          <button className="w-full bg-gradient-to-l from-nile to-nile-dark text-white rounded-full py-3 font-black shadow-[0_8px_20px_rgba(14,124,123,0.35)]">
            {supabaseConfigured ? "إرسال رسالة إعادة التعيين" : "تغيير كلمة السر"}
          </button>
        </form>
      )}
      <p className="text-sm text-center mt-4"><Link href="/login" className="font-bold">الرجوع للدخول</Link> · <Link href="/signup" className="font-bold">إنشاء حساب</Link></p>
      {!supabaseConfigured && <p className="text-xs text-gray-500 text-center mt-2">الوضع التجريبي الحالي لا يرسل بريداً حقيقياً.</p>}
    </div>
  );
}
