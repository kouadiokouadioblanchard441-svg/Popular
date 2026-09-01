import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { localeForLang, useI18n } from "@/lib/i18n";
import { Bell, CalendarDays, CircleDollarSign, HandCoins, MessagesSquare } from "lucide-react";
import type { Product } from "@shared/schema";
import homeHero from "@assets/generated_images/tgood-home-products-hero.jpg";
import electricScooter from "@assets/generated_images/tgood-scooter.jpg";
import electricMoped from "@assets/generated_images/tgood-moped.jpg";
import productBike from "@assets/generated_images/tgood-product-bike-card.jpg";
import chargingStation from "@assets/generated_images/tgood-charging-station-hero.jpg";
import chargingPile from "@assets/image_search/tgood-real-charging-pile-transparent.png";
import HomeAnnouncementModal from "@/components/home-announcement-modal";
import BannerCarousel from "@/components/banner-carousel";
import { FloatingSupport } from "@/components/floating-support";
import { getContent } from "@/lib/content";
import teslaLogo from "@/assets/partners/tesla.svg";
import bydLogo from "@/assets/partners/byd.svg";
import mercedesLogo from "@/assets/partners/mercedes.svg";
import binanceLogo from "@/assets/partners/binance.svg";
import netflixLogo from "@/assets/partners/netflix.svg";
import xpengLogo from "@assets/image_search/xpeng-official.svg";
import toyotaLogo from "@/assets/partners/toyota.svg";
import bmwLogo from "@/assets/partners/bmw.svg";
import audiLogo from "@/assets/partners/audi.svg";
import volkswagenLogo from "@/assets/partners/volkswagen.svg";
import fordLogo from "@/assets/partners/ford.svg";
import hondaLogo from "@/assets/partners/honda.svg";
import shellLogo from "@/assets/partners/shell.svg";
import huaweiLogo from "@/assets/partners/huawei.svg";
import xiaomiLogo from "@/assets/partners/xiaomi.svg";
import samsungLogo from "@/assets/partners/samsung.svg";
import appleLogo from "@/assets/partners/apple.svg";
import googleLogo from "@/assets/partners/google.svg";
import microsoftLogo from "@/assets/partners/microsoft.svg";
import amazonLogo from "@/assets/partners/amazon.svg";
import sonyLogo from "@/assets/partners/sony.svg";
import intelLogo from "@/assets/partners/intel.svg";
import visaLogo from "@/assets/partners/visa.svg";
import mastercardLogo from "@/assets/partners/mastercard.svg";
import paypalLogo from "@/assets/partners/paypal.svg";
import cocaColaLogo from "@/assets/partners/cocacola.svg";

const TGOOD_GREEN = "#08b83a";

const PARTNERS = [
  { name: "Tesla", logo: teslaLogo },
  { name: "BYD", logo: bydLogo },
  { name: "Mercedes-Benz", logo: mercedesLogo },
  { name: "Binance", logo: binanceLogo },
  { name: "XPENG", logo: xpengLogo },
  { name: "Netflix", logo: netflixLogo },
  { name: "Toyota", logo: toyotaLogo },
  { name: "BMW", logo: bmwLogo },
  { name: "Audi", logo: audiLogo },
  { name: "Volkswagen", logo: volkswagenLogo },
  { name: "Ford", logo: fordLogo },
  { name: "Honda", logo: hondaLogo },
  { name: "Shell", logo: shellLogo },
  { name: "Huawei", logo: huaweiLogo },
  { name: "Xiaomi", logo: xiaomiLogo },
  { name: "Samsung", logo: samsungLogo },
  { name: "Apple", logo: appleLogo },
  { name: "Google", logo: googleLogo },
  { name: "Microsoft", logo: microsoftLogo },
  { name: "Amazon", logo: amazonLogo },
  { name: "Sony", logo: sonyLogo },
  { name: "Intel", logo: intelLogo },
  { name: "Visa", logo: visaLogo },
  { name: "Mastercard", logo: mastercardLogo },
  { name: "PayPal", logo: paypalLogo },
  { name: "Coca-Cola", logo: cocaColaLogo },
];

const ACTIONS = [
  { labelKey: "deposit", href: "/deposit", Icon: CircleDollarSign },
  { labelKey: "withdraw", href: "/withdrawal", Icon: HandCoins },
  { labelKey: "customerService", href: "/service", Icon: MessagesSquare },
  { labelKey: "checkinBtn", href: "/checkin", Icon: CalendarDays },
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

const ACTIVITY_PREFIXES = {
  fr: {
    checkin: "Pointage quotidien",
    dailyBonus: "Bonus quotidien",
    signupBonus: "Bonus d'inscription",
    deposit: "Dépôt",
    withdrawal: "Retrait",
    commission: "Commission",
    earnings: "Gains",
    finalCollection: "Collecte finale",
    wheelReward: "Gain roue",
    purchase: "Achat",
    refund: "Remboursement du retrait",
    giftBonus: "Bonus code cadeau",
  },
  en: {
    checkin: "Daily check-in",
    dailyBonus: "Daily bonus",
    signupBonus: "Registration bonus",
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    commission: "Commission",
    earnings: "Earnings",
    finalCollection: "Final collection",
    wheelReward: "Wheel reward",
    purchase: "Purchase",
    refund: "Withdrawal refund",
    giftBonus: "Gift code bonus",
  },
  ar: {
    checkin: "تسجيل الحضور اليومي",
    dailyBonus: "المكافأة اليومية",
    signupBonus: "مكافأة التسجيل",
    deposit: "إيداع",
    withdrawal: "سحب",
    commission: "عمولة",
    earnings: "الأرباح",
    finalCollection: "التحصيل النهائي",
    wheelReward: "مكافأة العجلة",
    purchase: "شراء",
    refund: "استرداد السحب",
    giftBonus: "مكافأة رمز الهدية",
  },
  zh: {
    checkin: "每日签到",
    dailyBonus: "每日奖励",
    signupBonus: "注册奖励",
    deposit: "充值",
    withdrawal: "提现",
    commission: "佣金",
    earnings: "收益",
    finalCollection: "最终领取",
    wheelReward: "转盘奖励",
    purchase: "购买",
    refund: "提现退款",
    giftBonus: "礼品码奖励",
  },
} as const;

function localizeActivityDescription(
  description: string,
  type: string,
  amountLabel: string,
  lang: keyof typeof ACTIVITY_PREFIXES,
) {
  const labels = ACTIVITY_PREFIXES[lang];
  const source = description.trim();

  if (/pointage quotidien/i.test(source)) return `${labels.checkin}: +${amountLabel}`;
  if (/bonus quotidien/i.test(source)) return labels.dailyBonus;
  if (/bonus d['’]inscription/i.test(source)) return labels.signupBonus;
  if (/bonus code cadeau/i.test(source)) return labels.giftBonus;
  if (/commission niveau\s+([123])/i.test(source)) {
    const level = source.match(/commission niveau\s+([123])/i)?.[1];
    return `${labels.commission} ${lang === "zh" ? `等级${level}` : lang === "ar" ? `المستوى ${level}` : `level ${level}`}${source.match(/ de (.+)$/i)?.[1] ? ` ${lang === "fr" ? "de" : lang === "ar" ? "من" : lang === "zh" ? "" : "from"} ${source.match(/ de (.+)$/i)?.[1]}` : ""}`;
  }
  if (/collecte finale/i.test(source)) {
    return source.replace(/^Collecte finale/i, labels.finalCollection);
  }
  if (/gain roue/i.test(source)) {
    return source.replace(/^Gain roue/i, labels.wheelReward);
  }
  if (/remboursement du retrait/i.test(source)) {
    return source.replace(/^Remboursement du retrait/i, labels.refund);
  }
  if (/^gains?\s/i.test(source)) return source.replace(/^Gains?/i, labels.earnings);
  if (/^achat\s/i.test(source)) return source.replace(/^Achat/i, labels.purchase);
  if (/^retrait/i.test(source)) return source.replace(/^Retrait/i, labels.withdrawal);
  if (/^dépôt/i.test(source)) return source.replace(/^Dépôt/i, labels.deposit);
  if (type === "commission") return labels.commission;
  if (type === "earning") return labels.earnings;
  if (type === "deposit") return labels.deposit;
  if (type === "withdrawal") return labels.withdrawal;
  if (type === "bonus") return labels.dailyBonus;
  return source || "TGOOD activity";
}

export default function HomePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { t, lang } = useI18n();
  const { data: products = [] } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { data: settings = {} } = useQuery<Record<string, string>>({ queryKey: ["/api/settings"] });
  const { data: transactions = [] } = useQuery<any[]>({ queryKey: ["/api/transactions"] });

  if (!user) return null;

  const rawBalance = parseFloat(user.balance || "0");
  const rawTotalEarnings = parseFloat(user.totalEarnings || "0");
  const balance = Number.isFinite(rawBalance) ? rawBalance : 0;
  const totalEarnings = Number.isFinite(rawTotalEarnings) ? rawTotalEarnings : 0;
  const formatAmount = (value: number) => value.toLocaleString(localeForLang(lang), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const defaultBanners = [homeHero, chargingStation, electricScooter];
  let bannerImages = defaultBanners;
  try {
    const configured = JSON.parse(settings.banner1Images || "[]");
    if (Array.isArray(configured) && configured.length > 0) {
      const usable = configured.filter((url): url is string =>
        typeof url === "string" &&
        (url.startsWith("/uploads/") || url.startsWith("/assets/") || url.startsWith("data:image/")),
      );
      if (usable.length > 0) bannerImages = usable;
    }
  } catch {
    // The TGOOD assets remain the explicit, safe visual fallback.
  }
  const activityMessages = transactions.slice(0, 8).map((item: any) => {
    const amount = Number(item.amount);
    const amountLabel = Number.isFinite(amount) ? `${amount.toLocaleString(localeForLang(lang))} USDT` : "";
    const description = localizeActivityDescription(
      String(item.description || ""),
      String(item.type || ""),
      amountLabel,
      lang,
    );
    const descriptionAlreadyContainsAmount = /\bUSDT\b/i.test(description);
    return [description, descriptionAlreadyContainsAmount ? "" : amountLabel].filter(Boolean).join(" · ");
  });
  const activityLabel = getContent(settings, "content_home_activityLabel", "Votre activité récente");

  return (
    <main className="home-page pb-4" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <section className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-[#f8f9fa]">
        <BannerCarousel
          images={bannerImages}
          height={382}
          rounded={false}
          overlay={
            <div className="absolute left-5 top-5 flex items-center justify-center bg-white/95 shadow-sm" style={{ height: 46, width: 112, borderRadius: 7 }}>
              <img src="/tgood-logo.gif" alt="TGOOD" style={{ height: 35, maxWidth: 94, objectFit: "contain" }} />
            </div>
          }
        />

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
                <span className="font-normal" style={{ fontSize: 16, lineHeight: 1 }}>
                  {t[labelKey as keyof typeof t]}
                </span>
            </button>
          ))}
        </section>

        {activityMessages.length > 0 && (
          <section className="mx-3 mt-3 flex h-[58px] items-center overflow-hidden bg-white" style={{ borderRadius: 8 }} aria-label={activityLabel}>
            <Bell className="ml-4 shrink-0" size={25} fill={TGOOD_GREEN} color={TGOOD_GREEN} strokeWidth={2.3} />
            <div className="ml-3 overflow-hidden">
              <p className="whitespace-nowrap" style={{ color: "#535963", fontSize: 16, animation: "home-ticker 14s linear infinite" }}>
                {activityMessages.join("   •   ")}
              </p>
            </div>
          </section>
        )}

        <section className="mt-5 grid grid-cols-2 items-stretch gap-5 px-3">
          <button
            onClick={() => navigate("/wallet")}
            className="flex h-full min-w-0 flex-col text-center active:scale-[0.98]"
            style={{ transition: "transform 120ms ease" }}
            data-testid="button-account-balance"
          >
            <div className="relative h-[164px] overflow-hidden bg-[#f1f1f1] shadow-sm">
              <img src={electricScooter} alt="Green electric scooter" className="h-full w-full scale-[1.02] object-contain blur-[2px]" />
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
              {getContent(settings, "content_home_balanceLabel", "Solde du compte")}
            </p>
          </button>

          <button
            onClick={() => navigate("/history")}
            className="flex h-full min-w-0 flex-col text-center active:scale-[0.98]"
            style={{ transition: "transform 120ms ease" }}
            data-testid="button-cumulative-earnings"
          >
            <div className="relative h-[164px] overflow-hidden bg-[#f1f1f1] shadow-sm">
              <img src={electricMoped} alt="Green electric moped" className="h-full w-full scale-[1.02] object-contain blur-[2px]" />
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
              {getContent(settings, "content_home_earningsLabel", "Total des revenus")}
            </p>
          </button>
        </section>

        <section className="mt-12 px-3 pb-8">
          <h2 className="text-center font-normal" style={{ color: TGOOD_GREEN, fontSize: 25 }}>
            {getContent(settings, "content_home_experienceTitle", "Expérience")}
          </h2>
          <p className="mt-4 text-center font-normal" style={{ color: "#50545a", fontSize: 24 }}>
            {getContent(settings, "content_home_sustainabilityTitle", "Durabilité")}
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
              {getContent(settings, "content_home_specialProductsTitle", "Produits vedettes")}
            </h2>
            <button
              onClick={() => navigate("/invest")}
              className="active:opacity-60"
              style={{ color: TGOOD_GREEN, fontSize: 14 }}
            >
              {getContent(settings, "content_home_viewAllLabel", "Voir tout")} &gt;
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
               {getContent(settings, "content_home_noProductsLabel", "Aucun produit vedette disponible")}
            </div>
          )}
        </section>

        <section className="px-3 pb-10">
          <h2 className="mb-4 text-center font-normal" style={{ color: TGOOD_GREEN, fontSize: 25 }}>
             {getContent(settings, "content_home_partnersTitle", "Nos partenaires")}
          </h2>
          <div className="partner-marquee overflow-hidden rounded-[14px]" role="region" aria-label="Liste des partenaires">
            <div className="partner-marquee-track flex w-max gap-3 py-1">
              {[0, 1].map((groupIndex) => (
                <div
                  key={`partner-group-${groupIndex}`}
                  className="partner-marquee-group grid grid-flow-col grid-rows-2 auto-cols-max gap-3"
                  aria-hidden={groupIndex === 1}
                >
                  {PARTNERS.map((partner) => (
                    <div
                      key={`${groupIndex}-${partner.name}`}
                      className="flex h-[82px] w-[116px] shrink-0 flex-col items-center justify-center gap-2 rounded-[10px] bg-white px-2 shadow-sm sm:w-[132px]"
                    >
                      {partner.name === "XPENG" ? (
                        <span className="flex h-8 w-full items-center justify-center rounded-[4px] bg-[#111827] px-3">
                          <img
                            src={partner.logo}
                            alt={`Logo ${partner.name}`}
                            className="h-7 w-auto object-contain"
                            loading="lazy"
                          />
                        </span>
                      ) : (
                        <img
                          src={partner.logo}
                          alt={`Logo ${partner.name}`}
                          className="h-8 w-full object-contain"
                          loading="lazy"
                        />
                      )}
                      <span className="w-full truncate text-center text-[10px] font-medium text-[#65756c]">{partner.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

      </section>

      <FloatingSupport bottomOffset={72} />

      <style>{`
        @keyframes home-ticker {
          0%, 12% { transform: translateX(0); }
          88%, 100% { transform: translateX(-42%); }
        }
        .partner-marquee-track {
          animation: partner-scroll 72s linear infinite;
        }
        .partner-marquee:hover .partner-marquee-track,
        .partner-marquee:focus-within .partner-marquee-track {
          animation-play-state: paused;
        }
        @keyframes partner-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 0.375rem)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .home-page [style*="home-ticker"] {
            animation: none !important;
          }
          .partner-marquee-track {
            animation: none !important;
          }
        }
      `}</style>
      <HomeAnnouncementModal />
    </main>
  );
}