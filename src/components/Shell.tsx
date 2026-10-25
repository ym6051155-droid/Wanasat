"use client";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { useStore } from "@/lib/store";

// صفحتا الدخول والتسجيل مستقلتان تماماً: بدون هيدر وبدون شريط سفلي.
// والضيف في الرئيسية أيضاً لا يرى الهيدر والشريط أثناء التحويل للدخول.
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { current, loaded } = useStore();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isGuestHome = pathname === "/" && loaded && !current;
  if (isAuthPage || isGuestHome) {
    return <main className="max-w-3xl mx-auto px-3 py-6 min-h-screen flex flex-col justify-center">{children}</main>;
  }
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-3 pt-4 pb-28">{children}</main>
      <BottomNav />
    </>
  );
}
