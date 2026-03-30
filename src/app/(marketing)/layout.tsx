import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col w-full relative pt-20 lg:pt-24 min-h-screen overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </>
  );
}
