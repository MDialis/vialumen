import { ThemeSwitcher } from "./theme-switcher";
import { Fredoka } from "next/font/google";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";

const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fredoka",
});

export default function Navbar() {
  return (
    <nav
      className={`sticky top-0 w-full bg-constant-black ${fredoka.variable}`}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
        <div className="flex-1 flex justify-start">
          <a href="/" className="hover:opacity-85 px-2 py-1 rounded-lg">
            <h1
              className={`text-2xl font-semibold text-constant-white ${fredoka.className}`}
            >
              VIALUMEN
            </h1>
          </a>
        </div>

        <div className="max-w-sm w-full">
          <InputGroup className="bg-muted text-muted-foreground">
            <InputGroupInput placeholder="Type to search..." />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="secondary">Search</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="flex-1 flex justify-end">
          <ThemeSwitcher className="text-constant-white" />
        </div>
      </div>
    </nav>
  );
}
