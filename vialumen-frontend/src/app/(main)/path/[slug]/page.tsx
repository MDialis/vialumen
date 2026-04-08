import { ThemeWrapper } from "@/components/theme-wrapper";

export default async function PathPage({ params }: { params: { slug: string } }) {
  return (
    <ThemeWrapper>
      <div className="text-primary text-2xl">Primary!</div> 
      <div className="text-secondary text-2xl">Secondary!</div> 
      <div className="text-accent-foreground text-2xl">Accent!</div> 
    </ThemeWrapper>
  );
}