import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SITE_CONFIG } from "@/lib/constants";

import { GlobalWarpBackground } from "@/components/layout/global-warp-background";
import { NexoraFloatingBot } from "@/components/ai/nexora-floating-bot";
import { ClickEffects } from "@/components/effects/click-effects";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} | AI Personalized Learning Ecosystem`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "Skillora",
    "Skillora AI",
    "TechNova",
    "Autonomous AI Personalized Learning Ecosystem",
    "Adaptive Learning Ecosystem",
    "Skill DNA",
    "Connecting Skills Bridging Opportunities",
    "Employability & Mentorship Platform",
    "AI Career Copilot",
  ],
  authors: [{ name: "TechNova" }],
  creator: "TechNova",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#02040A" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#02040A] font-sans text-foreground antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <GlobalWarpBackground />
            {/* Global Interactive Click / Hover Effect Overlay */}
            <ClickEffects color="#06b6d4" interactionMode="sniper" effectSize={80} duration={0.45} />
            <div className="relative z-10 flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            {/* Global Nexora.ai RAG Chatbot */}
            <NexoraFloatingBot />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
