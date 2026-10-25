import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0e7c7b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <StoreProvider>
          <Header />
          <main className="max-w-3xl mx-auto px-3 pt-4 pb-28">{children}</main>
          <BottomNav />
        </StoreProvider>
      </body>
    </html>
  );
}
