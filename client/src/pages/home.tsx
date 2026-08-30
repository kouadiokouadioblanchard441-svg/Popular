import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { localeForLang, useI18n } from "@/lib/i18n";
import { Bell, CircleDollarSign, HandCoins, MessagesSquare, CalendarDays } from "lucide-react";
import type { Product } from "@shared/schema";
import homeHero from "@assets/generated_images/tgood-home-products-hero.jpg";
import electricScooter from "@assets/generated_images/tgood-scooter.jpg";
import electricMoped from "@assets/generated_images/tgood-moped.jpg";
import productBike from "@assets/generated_images/tgood-product-bike-card.jpg";
import chargingStation from "@assets/generated_images/tgood-charging-station-hero.jpg";
import chargingPile from "@assets/image_search/tgood-real-charging-pile-transparent.png";
import HomeAnnouncementModal from "@/components/home-announcement-modal";
import { FloatingSupport } from "@/components/floating-support";
import teslaLogo from "@/assets/partners/tesla.svg";
import bydLogo from "@/assets/partners/byd.svg";
import binanceLogo from "@/assets/partners/binance.svg";
import netflixLogo from "@/assets/partners/netflix.svg";

const TGOOD_GREEN = "#08b83a";

const ACTIVITY_MESSAGES = [
  "****1847 a rechargé 125 USDT",
  "****6521 a retiré 480 USDT",
  "****3074 a reçu un bonus de 35 USDT",
  "****9186 a rechargé 860 USDT",
  "****2468 a effectué un retrait de 190 USDT",
  "****7315 a reçu un bonus de bienvenue de 10 USDT",
  "****5639 a rechargé 1250 USDT",
  "****8093 a gagné un bonus quotidien de 75 USDT",
  "****4217 a retiré 320 USDT",
  "****6754 a rechargé 45 USDT",
  "****1382 a reçu une commission de 210 USDT",
  "****9546 a effectué un retrait de 1000 USDT",
];

const ACTIONS = [
  { labelKey: "deposit", href: "/deposit", Icon: CircleDollarSign },
  { labelKey: "withdraw", href: "/withdrawal", Icon: HandCoins },
  { labelKey: "customerService", href: "/service", Icon: MessagesSquare },
  { labelKey: "checkinBtn", href: "/checkin", Icon: CalendarDays },
];

const PARTNERS = [
  { name: "Tesla", logo: teslaLogo },
  { name: "BYD", logo: bydLogo },
  { name: "Mercedes-Benz", logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg" },
  { name: "Binance", logo: binanceLogo },
  { name: "XPENG", logo: "/xpeng-logo-full.jpg" },
  { name: "Netflix", logo: netflixLogo },
];

const EXPERIENCE_PRODUCTS = [
  { image: productBike, label: "TGOOD electric bike" },
  { image: electricScooter, label: "TGOOD electric scooter" },
  { image: electricMoped, label: "TGOOD electric moped" },
  { image: chargingStation, label: "TGOOD charging station" },
  { image: chargingPile, label: "TGOOD charging pile" },
];

const SPECIAL_PRODUCT_IMAGES = [
  productBike,
  electricScooter,
  electricMoped,
  chargingStation,
];

export default function HomePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { t, lang } = useI18n();
  const { data: products = [] } = useQuery<Product[]>({ queryKey: ["/api/products"] });

  if (!user) return null;

  const rawBalance = parseFloat(user.balance || "0");
  const rawTotalEarnings = parseFloat(user.totalEarnings || "0");
  const balance = Number.isFinite(rawBalance) ? rawBalance : 0;
  const totalEarnings = Number.isFinite(rawTotalEarnings) ? rawTotalEarnings : 0;
  const formatAmount = (value: number) => value.toLocaleString(localeForLang(lang), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <main className="home-page pb-4" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <section className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-[#f8f9fa]">
        <div className="relative h-[382px] overflow-hidden">
          <img
            src={homeHero}
            alt="Gamme de mobilité électrique et recharge TGOOD avec vélo, scooter et cyclomoteur"
            className="h-full w-full object-cover"
            style={{ objectPosition: "center 42%" }}
          />
          <div
            className="absolute left-5 top-5 flex items-center justify-center bg-white/95 shadow-sm"
            style={{ height: 46, width: 112, borderRadius: 7 }}
          >
            <img src="/tgood-logo.gif" alt="TGOOD" style={{ height: 35, maxWidth: 94, objectFit: "contain" }} />
          </div>
        </div>

        <section
          className="relative z-10 mx-[10px] -mt-10 grid grid-cols-4 bg-white"
          style={{ minHeight: 102, borderRadius: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          {ACTIONS.map(({ labelKey, href, Icon }, index) => (
            <button
              key={labelKey}
              onClick={() => navigate(href)}
              className="flex min-w-0 flex-col items-center justify-center gap-2 active:scale-95"
              style={{
                borderRight: index < ACTIONS.length - 1 ? "1px solid #f1f1f1" : "none",
                color: "#070707",
                transition: "transform 120ms ease",
              }}
              data-testid={`button-action-${index}`}
            >
              <Icon size={43} strokeWidth={2.7} aria-hidden="true" />
              <span className="font-normal" style={{ fontSize: 16, lineHeight: 1 }}>{t[labelKey as keyof typeof t]}</span>
            </button>
          ))}
        </section>

        <section
          className="mx-3 mt-3 flex h-[58px] items-center overflow-hidden bg-white"
          style={{ borderRadius: 8 }}
          aria-label={lang === "en" ? "Latest transactions" : "Dernières transactions"}
        >
          <Bell className="ml-4 shrink-0" size={25} fill={TGOOD_GREEN} color={TGOOD_GREEN} strokeWidth={2.3} />
          <div className="ml-3 overflow-hidden">
            <p
              className="whitespace-nowrap"
              style={{
                color: "#535963",
                fontSize: 16,
                animation: "home-ticker 14s linear infinite",
              }}
            >
              {ACTIVITY_MESSAGES.join("   •   ")}
            </p>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 items-stretch gap-5 px-3">
          <button
            onClick={() => navigate("/wallet")}
            className="flex h-full min-w-0 flex-col text-center active:scale-[0.98]"
            style={{ transition: "transform 120ms ease" }}
            data-testid="button-account-balance"
          >
            <div className="relative h-[164px] overflow-hidden bg-[#f1f1f1] shadow-sm">
              <img src={electricScooter} alt="Trottinette électrique verte" className="h-full w-full scale-[1.02] object-contain blur-[2px]" />
              <div
                className="absolute inset-x-0 bottom-6 text-center font-normal"
                style={{
                  color: "#000000",
                  fontSize: 27,
                  fontWeight: 700,
                  textShadow: "0 1px 2px rgba(255,255,255,.8)",
                }}
                data-testid="text-balance"
              >
                USDT {formatAmount(balance)}
              </div>
            </div>
            <p className="mt-3 min-h-[24px] font-normal" style={{ color: TGOOD_GREEN, fontSize: 20, lineHeight: 1.2 }}>
              Solde du compte
            </p>
          </button>

          <button
            onClick={() => navigate("/history")}
            className="flex h-full min-w-0 flex-col text-center active:scale-[0.98]"
            style={{ transition: "transform 120ms ease" }}
            data-testid="button-cumulative-earnings"
          >
            <div className="relative h-[164px] overflow-hidden bg-[#f1f1f1] shadow-sm">
              <img src={electricMoped} alt="Scooter électrique vert" className="h-full w-full scale-[1.02] object-contain blur-[2px]" />
              <div
                className="absolute inset-x-0 bottom-6 text-center font-normal"
                style={{
                  color: "#000000",
                  fontSize: 27,
                  fontWeight: 700,
                  textShadow: "0 1px 2px rgba(255,255,255,.8)",
                }}
                data-testid="text-earnings"
              >
                USDT {formatAmount(totalEarnings)}
              </div>
            </div>
            <p className="mt-3 min-h-[24px] font-normal" style={{ color: TGOOD_GREEN, fontSize: 20, lineHeight: 1.2 }}>
              Revenus cumulés
            </p>
          </button>
        </section>

        <section className="mt-12 px-3 pb-8">
          <h2 className="text-center font-normal" style={{ color: TGOOD_GREEN, fontSize: 25 }}>
            Expérience
          </h2>
          <p className="mt-4 text-center font-normal" style={{ color: "#50545a", fontSize: 24 }}>
            Durabilité
          </p>

          <div className="mt-5 grid grid-cols-4 gap-[7px]">
            {Array.from({ length: 12 }, (_, index) => {
              const product = EXPERIENCE_PRODUCTS[index % EXPERIENCE_PRODUCTS.length];
              return (
                <div
                  key={index}
                  className="aspect-[1.55] overflow-hidden active:opacity-80"
                  style={{
                    borderRadius: 7,
                    background: "#f0f5f2",
                    transition: "opacity 120ms ease",
                  }}
                  aria-label={product.label}
                >
                  <img
                    src={product.image}
                    alt={product.label}
                    className="h-full w-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-3 pb-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-normal" style={{ color: TGOOD_GREEN, fontSize: 25 }}>
              {lang === "en" ? "Special products" : "Produits spéciaux"}
            </h2>
            <button
              onClick={() => navigate("/invest")}
              className="active:opacity-60"
              style={{ color: TGOOD_GREEN, fontSize: 14 }}
            >
              {lang === "en" ? "View all" : "Voir tout"} &gt;
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {products.filter(product => !product.isFree).slice(0, 4).map((product, index) => (
              <button
                key={product.id}
                onClick={() => navigate("/invest")}
                className="overflow-hidden bg-white text-left shadow-sm active:scale-[0.98]"
                style={{ borderRadius: 10, transition: "transform 120ms ease" }}
                data-testid={`special-product-${product.id}`}
              >
                <div className="h-[125px] bg-[#f0f0f0]">
                  <img
                    src={SPECIAL_PRODUCT_IMAGES[index % SPECIAL_PRODUCT_IMAGES.length]}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="px-3 py-3">
                  <p className="truncate font-medium" style={{ color: "#222", fontSize: 14 }}>{product.name}</p>
                  <p className="mt-1 font-normal" style={{ color: TGOOD_GREEN, fontSize: 16 }}>
                    USDT {Number(product.price).toLocaleString(localeForLang(lang))}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {products.filter(product => !product.isFree).length === 0 && (
            <div className="bg-white py-8 text-center" style={{ borderRadius: 10, color: "#777", fontSize: 14 }}>
              {lang === "en" ? "No special products available" : "Aucun produit spécial disponible"}
            </div>
          )}
        </section>

        <section className="px-3 pb-10">
          <h2 className="mb-4 text-center font-normal" style={{ color: TGOOD_GREEN, fontSize: 25 }}>
            {lang === "en" ? "Our partners" : "Nos partenaires"}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="flex h-[76px] flex-col items-center justify-center gap-2 rounded-[10px] bg-white px-2 shadow-sm"
              >
                <img
                  src={partner.logo}
                  alt={`Logo ${partner.name}`}
                  className="h-8 w-full object-contain"
                  loading="lazy"
                />
                <span className="truncate text-center text-[10px] font-medium text-[#65756c]">{partner.name}</span>
              </div>
            ))}
          </div>
        </section>
      </section>

      <FloatingSupport bottomOffset={72} />

      <style>{`
        @keyframes home-ticker {
          0%, 12% { transform: translateX(0); }
          88%, 100% { transform: translateX(-42%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .home-page [style*="home-ticker"] {
            animation: none !important;
          }
        }
      `}</style>
      <HomeAnnouncementModal />
    </main>
  );
}