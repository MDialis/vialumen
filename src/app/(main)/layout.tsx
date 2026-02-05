import Navbar from "@/components/Navbar";

export default function CoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}