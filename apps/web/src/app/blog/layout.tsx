import { LandingNav, Footer } from "@/components/landing-shared";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden">
      <LandingNav />
      {children}
      <Footer />
    </div>
  );
}
