import { Button } from "@/components/ui/button";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({ subsets: ["latin"], display: "swap", variable: "--font-fredoka" });

export default function Home() {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-center bg-slate-50 gap-4 ${fredoka.variable}`}>
      <h1 className={`text-4xl font-semibold text-slate-900 ${fredoka.className}`}>
        VIALUMEN
      </h1>
      <p className="text-slate-600 max-w-lg text-center">
        The beginning of a journey.
      </p>
      
      <div className="flex gap-2">
        <Button>Start now</Button>
        <Button variant="outline">Know more</Button>
      </div>
    </main>
  );
}