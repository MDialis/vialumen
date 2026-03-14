import { ThemeSwitcher } from "@/components/theme-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Fredoka } from "next/font/google";
import Link from "next/link";

const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fredoka",
});

interface HierarchyLevel {
  title: string;
  theme: string;
  image: string;
  description: string;
  href: string;
}

export default async function Home() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/hierarchy`);
  const hierarchyLevels: HierarchyLevel[] = await response.json();

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-start bg-background text-foreground pt-32 px-1 gap-4 ${fredoka.variable}`}
    >
      <div className="pb-12 flex flex-col items-center max-w-6xl w-full gap-4">
        <div className="py-6">
          <h1
            className={`text-6xl font-semibold text-foreground ${fredoka.className}`}
          >
            VIALUMEN
          </h1>
          <p className="text-muted-foreground text-center">
            The beginning of our journey.
          </p>
        </div>

        <div className="w-full">
          <InputGroup className="bg-card">
            <InputGroupInput placeholder="Type to search..." />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="secondary">Search</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="flex gap-2">
          <Button>Start now</Button>
          <Button variant="ghost">Know more</Button>
          <ThemeSwitcher />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 w-full max-w-6xl m-5 rounded-4xl gap-2 md:gap-4">
        {hierarchyLevels.map((level: HierarchyLevel) => (
          <Card
            key={level.title}
            className={`
            relative mx-auto w-full max-w-md
            pt-0 overflow-hidden
            hover:brightness-105 hover:scale-105 
            transition ${level.theme}
            flex flex-col h-full
            `}
          >
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
              src={level.image}
              alt={`${level.title} cover`}
              className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />

            <CardHeader>
              <CardAction>
                <Badge variant="ghost">Featured</Badge>
              </CardAction>
              <CardTitle>{level.title}</CardTitle>
              <CardDescription className="hidden md:block">
                {level.description}
              </CardDescription>
            </CardHeader>

            <CardFooter className="mt-auto">
              <Link href={level.href} className="w-full">
                <Button className="w-full">Learn more</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
