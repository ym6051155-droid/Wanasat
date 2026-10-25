"use client";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

// صفحتا الدخول والتسجيل مستقلتان تماماً: بدون هيدر وبدون شريط سفلي.
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage) {
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
