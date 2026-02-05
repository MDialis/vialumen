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

export default function Home() {
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
        <Card
          className="
            relative mx-auto w-full max-w-md
            pt-0 rounded-4xl overflow-hidden
            border-2 border-b-6 border-chart-1/25
            bg-chart-1/10 hover:brightness-105 hover:scale-105 transition
        "
        >
          <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
          <img
            src="https://avatar.vercel.sh/shadcn1"
            alt="Event cover"
            className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
          />

          <CardHeader>
            <CardAction>
              <Badge variant="ghost">Featured</Badge>
            </CardAction>
            <CardTitle>Physiology</CardTitle>
            <CardDescription className="hidden md:block">
              The essentials for survival: air, water, food, and shelter. The
              foundation upon which all other growth is built.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Link href="/core" className="w-full">
              <Button className="w-full">Learn more</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card
          className="
            relative mx-auto w-full max-w-md
            pt-0 rounded-4xl overflow-hidden
            border-2 border-b-6 border-chart-2/25
            bg-chart-2/10 hover:brightness-105 hover:scale-105 transition
        "
        >
          <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
          <img
            src="https://avatar.vercel.sh/shadcn1"
            alt="Event cover"
            className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
          />

          <CardHeader>
            <CardAction>
              <Badge variant="ghost">Featured</Badge>
            </CardAction>
            <CardTitle>Safety</CardTitle>
            <CardDescription className="hidden md:block">
              Finding stability in a chaotic world. Securing your health,
              finances, and environment to build a worry-free future.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Link href="/core" className="w-full">
              <Button className="w-full">Learn more</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card
          className="
            relative mx-auto w-full max-w-md
            pt-0 rounded-4xl overflow-hidden
            border-2 border-b-6 border-chart-3/25
            bg-chart-3/10 hover:brightness-105 hover:scale-105 transition
        "
        >
          <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
          <img
            src="https://avatar.vercel.sh/shadcn1"
            alt="Event cover"
            className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
          />

          <CardHeader>
            <CardAction>
              <Badge variant="ghost">Featured</Badge>
            </CardAction>
            <CardTitle>Belonging</CardTitle>
            <CardDescription className="hidden md:block">
              Connecting with the world around you. Cultivating deep
              relationships, community roots, and the power of shared
              experiences.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Link href="/core" className="w-full">
              <Button className="w-full">Learn more</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card
          className="
            relative mx-auto w-full max-w-md
            pt-0 rounded-4xl overflow-hidden
            border-2 border-b-6 border-chart-4/25
            bg-chart-4/10 hover:brightness-105 hover:scale-105 transition
        "
        >
          <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
          <img
            src="https://avatar.vercel.sh/shadcn1"
            alt="Event cover"
            className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
          />

          <CardHeader>
            <CardAction>
              <Badge variant="ghost">Featured</Badge>
            </CardAction>
            <CardTitle>Esteem</CardTitle>
            <CardDescription className="hidden md:block">
              Building confidence and gaining respect. Recognizing your inner
              worth and achieving the mastery you deserve.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Link href="/core" className="w-full">
              <Button className="w-full">Learn more</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card
          className="
            relative mx-auto w-full max-w-md
            pt-0 rounded-4xl overflow-hidden
            border-2 border-b-6 border-chart-5/25
            bg-chart-5/10 hover:brightness-105 hover:scale-105 transition
        "
        >
          <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
          <img
            src="https://avatar.vercel.sh/shadcn1"
            alt="Event cover"
            className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
          />

          <CardHeader>
            <CardAction>
              <Badge variant="ghost">Featured</Badge>
            </CardAction>
            <CardTitle>Self-Actualization</CardTitle>
            <CardDescription className="hidden md:block">
              The peak of the journey. Realizing your full potential, pursuing
              creative growth, and becoming the best version of yourself.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Link href="/core" className="w-full">
              <Button className="w-full">Learn more</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
