import { Metadata } from "next";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Preview",
  description: "Generated by create next app",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center">
        <main className="container h-96 max-w-sm rounded-xl bg-background py-4">
          {children}
        </main>
      </body>
    </html>
  );
}
