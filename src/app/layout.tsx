import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Keshav Uppal | Portfolio",
    template: "%s | Keshav Uppal",
  },
  description: "A modern, premium, OLED-black portfolio inspired by Linux system customization, dotfiles, and clean engineering.",
  keywords: [
    "Keshav Uppal",
    "Linux Enthusiast",
    "Developer",
    "Arch Linux Ricing",
    "System Customization",
    "Python",
    "Open Source",
  ],
  authors: [{ name: "Keshav Uppal" }],
  creator: "Keshav Uppal",
  metadataBase: new URL("https://manveer.dev"), // Fallback base URL for canonicals
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://manveer.dev",
    title: "Keshav Uppal | Portfolio",
    description: "A modern, premium, OLED-black portfolio inspired by Linux system customization, dotfiles, and clean engineering.",
    siteName: "Keshav Uppal Portfolio",
    images: [
      {
        url: "/og-image.png", // Placeholder path
        width: 1200,
        height: 630,
        alt: "Keshav Uppal | Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keshav Uppal | Portfolio",
    description: "A modern, premium, OLED-black portfolio inspired by Linux system customization, dotfiles, and clean engineering.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Keshav Uppal",
    "jobTitle": "Student & Developer",
    "url": "https://manveer.dev",
    "email": "uppalkeshav0912@gmail.com",
    "sameAs": [
      "https://www.linkedin.com/in/keshav-uppal-296846365/",
      "https://github.com/Manveer1209"
    ],
    "description": "Student interested in Linux system administration, backend development, and open-source contributions.",
    "knowsAbout": [
      "Python",
      "Linux",
      "Arch Linux",
      "System Customization",
      "Open Source",
      "Git",
    ],
  };

  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
      style={{ scrollBehavior: "smooth" }}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#000000] text-white overflow-x-hidden selection:bg-violet-500/30 selection:text-white">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
