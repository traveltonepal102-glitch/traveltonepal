import type { Metadata } from "next";

import { fontVariables } from "@/lib/fonts";

import "@/styles/admin.css";

export const metadata: Metadata = {
  title: { default: "Admin · Travel To Nepal", template: "%s · Travel To Nepal admin" },
  robots: { index: false, follow: false },
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="en" className={`${fontVariables} antialiased`}>
    {/* Browser extensions add attributes to <body> before React loads; this ignores only those. */}
    <body className="bg-page font-sans text-body-sm text-text" suppressHydrationWarning>
      {children}
    </body>
  </html>
);

export default RootLayout;
