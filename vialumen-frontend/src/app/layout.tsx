// src/app/layout.tsx
import type { Metadata } from "next";
import {
  Inter,
  Lora,
  JetBrains_Mono,
  Poppins,
  Playfair_Display,
  Nunito
} from "next/font/google";
import { ThemeProvider } from "@/contexts/theme-provider";
import { FontProvider } from "@/contexts/font-provider";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "Vialumen",
  description: "Project by Mateus Dialis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`
        ${inter.variable} 
        ${lora.variable} 
        ${jetbrains.variable} 
        ${poppins.variable} 
        ${playfair.variable} 
        ${nunito.variable} 
        `}
      suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <FontProvider>
            {children}
          </FontProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}