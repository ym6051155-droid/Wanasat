import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/Header";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <StoreProvider>
          <Header />
          <main className="max-w-3xl mx-auto px-3 py-4">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
