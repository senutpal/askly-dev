import { DM_Sans } from "next/font/google";
import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Metadata } from "next";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Askly-Widget",
  description:
    "Revolutionize campus communication with AI-powered multilingual chatbot support in Hindi, English, and regional languages. 24/7 automated student assistance.",
  keywords: [
    "campus chatbot",
    "multilingual AI",
    "student support",
    "educational technology",
    "conversational AI",
  ],
  openGraph: {
    title: "ASKLY - Multilingual Campus AI Assistant",
    description:
      "Transform campus communication with intelligent multilingual chatbot support",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <Providers>
          <div className="w-screen h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
