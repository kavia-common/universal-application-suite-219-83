import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "AI Cloud Cost Optimizer",
  description: "Optimize cloud spend with AI insights."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <Providers>
          <div className="flex min-h-dvh flex-col">
            <header className="border-b">
              <div className="container flex h-14 items-center justify-between">
                <h1 className="text-base font-semibold">AI Cloud Cost Optimizer</h1>
                <ThemeToggle />
              </div>
            </header>
            <main className="container flex-1 py-8">{children}</main>
            <footer className="border-t">
              <div className="container py-4 text-sm text-muted-foreground">
                © {new Date().getFullYear()} AI Cloud Cost Optimizer
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
