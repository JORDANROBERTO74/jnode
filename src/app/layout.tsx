import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jnode.digital";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "J-NODE Digital Solutions | Software Development Agency",
  description:
    "Software development agency: web and app development, UI/UX design, maintenance, consulting, domains and hosting. Professional digital solutions.",
  keywords: ["software development", "digital agency", "web development", "design", "hosting", "domains", "maintenance"],
  openGraph: {
    title: "J-NODE Digital Solutions",
    description: "Software development agency and digital solutions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
