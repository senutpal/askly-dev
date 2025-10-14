import { DM_Sans } from "next/font/google";
import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@workspace/ui/components/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ASKLY - Multilingual Campus AI Assistant",
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

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <Toaster />
              {children}
            </Providers>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
