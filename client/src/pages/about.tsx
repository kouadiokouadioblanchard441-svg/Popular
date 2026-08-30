import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getContent } from "@/lib/content";

export default function AboutPage() {
  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings"],
  });

  const pageTitle = "About TGOOD";
  const s1Title   = getContent(settings, "content_about_s1Title",   "Qui sommes-nous ?");
  const s1Text1   = "TGOOD develops electric mobility and smart energy solutions for modern lifestyles.";
  const s1Text2   = "Our platform brings together simple, accessible, and transparent products and services for electric bikes, scooters, mopeds, and charging.";
  const s2Title   = "Nos produits & solutions";
  const s2Text    = "TGOOD offers a range of electric mobility products and charging equipment designed to be practical, reliable, and suited to every member's needs.";
  const s3Title   = "Notre fonctionnement";
  const s3Text    = "Members can explore available products, manage their USDT balance, track activity earnings, and request withdrawals according to the conditions shown on the platform.";
  const s4Title   = "Notre engagement";
  const s4Text    = "We prioritize clear information, account security, and service quality. Our team supports members and continuously improves the TGOOD experience.";

  return (
    <div className="flex min-h-screen flex-col text-[#26352d]" style={{ background: "#f8f9fa", color: "#26352d" }}>
      <header className="flex items-center border-b border-[#dbe8df] bg-[#087a38] px-4 py-3 text-white">
        <Link href="/account">
          <button className="p-1" data-testid="button-back">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </Link>
        <h1 className="flex-1 pr-6 text-center text-lg font-semibold text-white">{pageTitle}</h1>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-6 pb-20">
        <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#087a38]">{s1Title}</h2>
          <p className="leading-relaxed text-[#3f4d45]">{s1Text1}</p>
          <p className="leading-relaxed text-[#3f4d45]">{s1Text2}</p>
        </div>
        <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#087a38]">{s2Title}</h2>
          <p className="leading-relaxed text-[#3f4d45]">{s2Text}</p>
        </div>
        <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#087a38]">{s3Title}</h2>
          <p className="leading-relaxed text-[#3f4d45]">{s3Text}</p>
        </div>
        <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#087a38]">{s4Title}</h2>
          <p className="leading-relaxed text-[#3f4d45]">{s4Text}</p>
        </div>
      </div>
    </div>
  );
}
