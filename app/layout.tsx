import AnalyticsGate from "@/components/analytics/analytics-gate";
import CookieConsent from "@/components/ui/cookie-consent";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { UserProvider } from "@/contexts/UserContext";
import { getUser } from "@/lib/db/queries";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { SWRConfig } from "swr";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unvios - Your Personal Memory Assistant",
  description: "Never forget anything again with Unvios.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "Unvios - Your Personal Memory Assistant",
    description: "Never forget anything again with Unvios.",
    type: "website",
    images: [
      {
        url: "/metadata-img.png",
        width: 1200,
        height: 630,
        alt: "Unvios - Your Personal Memory Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unvios - Your Personal Memory Assistant",
    description: "Never forget anything again with Unvios.",
    images: ["/metadata-img.png"],
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  // resolve user on the server to decide whether to show the public footer
  const user = await getUser();

  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body suppressHydrationWarning className="min-h-[100dvh] bg-gray-50">
        <SWRConfig
          value={{
            fallback: {
              // provide the resolved user as the SWR fallback for /api/user
              "/api/user": user,
            },
          }}
        >
          <UserProvider>
            <Header />
            {children}
          </UserProvider>
        </SWRConfig>
        {/* show public footer only when there is no authenticated user */}
        {!user && <Footer />}
        <CookieConsent />
        <AnalyticsGate />
      </body>
    </html>
  );
}
