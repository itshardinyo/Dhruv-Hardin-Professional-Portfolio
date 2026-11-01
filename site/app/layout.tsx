import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Mouse_Memoirs, VT323 } from "next/font/google";
import "./globals.css";
import { IntroProvider } from "@/components/intro/intro-controller";
import { Landing } from "@/components/intro/landing";
import { BOOT_SCRIPT } from "@/components/intro/boot-script";
import { Header } from "@/components/site/header";
import { SiteFooter } from "@/components/site/site-footer";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { RoughFilter } from "@/components/site/rough-filter";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "block" });
const mouse = Mouse_Memoirs({ weight: "400", subsets: ["latin"], variable: "--font-mouse", display: "block" });
const vt323 = VT323({ weight: "400", subsets: ["latin"], variable: "--font-vt323", display: "block" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Dhruv Hardin",
  description: "You’ve reached Dhruv Hardin. SONDR rules the world · Est. 2022.",
  openGraph: { title: "Dhruv Hardin", description: "You’ve reached Dhruv Hardin.", type: "website", siteName: "Dhruv Hardin" },
  twitter: { card: "summary_large_image", title: "Dhruv Hardin" },
};

export const viewport: Viewport = { themeColor: "#FFFFFF", colorScheme: "light" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <link rel="preload" as="image" href="/logo-patch.webp" type="image/webp" fetchPriority="high" />
      </head>
      <body className={`${bebas.variable} ${mouse.variable} ${vt323.variable}`}>
        <RoughFilter />
        <IntroProvider>
          <SmoothScroll />
          <Landing />
          <div id="site">
            <Header />
            <main id="main">{children}</main>
            <SiteFooter />
          </div>
        </IntroProvider>
      </body>
    </html>
  );
}
