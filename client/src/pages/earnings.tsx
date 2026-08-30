import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ChevronLeft, Loader2 } from "lucide-react";

const TGOOD_GREEN = "#00c83c";

function EmptyEarningsIllustration() {
  return (
    <svg width="210" height="170" viewBox="0 0 210 170" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="earnings-silver" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#f5f5f5" />
          <stop offset="1" stopColor="#969696" />
        </linearGradient>
      </defs>
      <path d="M18 103h42v-50H18v50Z" fill="url(#earnings-silver)" />
      <path d="M145 103h40V24h-40v79Z" fill="url(#earnings-silver)" />
      <path d="M184 103h19V43h-19v60Z" fill="url(#earnings-silver)" />
      <rect x="63" y="23" width="85" height="99" rx="2" fill="#fafafa" />
      <rect x="71" y="32" width="69" height="69" rx="2" fill="#fff" />
      <rect x="85" y="45" width="41" height="6" rx="2" fill="#e6e8eb" />
      <rect x="85" y="62" width="41" height="6" rx="2" fill="#e6e8eb" />
      <rect x="85" y="79" width="41" height="6" rx="2" fill="#e6e8eb" />
      <rect x="51" y="101" width="111" height="36" fill="#ebedf0" />
      <rect x="90" y="114" width="35" height="7" rx="2" fill="#fff" />
      <path d="M39 29c7-11 25-5 23 7-2 9-14 8-23 8-10 0-13-9 0-15Z" fill="url(#earnings-silver)" />
      <path d="M127 10c13-20 43-7 39 13-3 14-22 12-39 12-17 0-22-15 0-25Z" fill="url(#earnings-silver)" />
    </svg>
  );
}

export default function EarningsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { data: userProducts = [], isLoading } = useQuery<any[]>({ queryKey: ["/api/user/products"] });

  if (!user) return null;

  const totalEarnings = Number.isFinite(Number(user.totalEarnings)) ? Number(user.totalEarnings) : 0;
  const hasProducts = userProducts.length > 0;

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <header className="flex h-[80px] items-center border-b border-[#e5e5e5] bg-white px-5">
        <button onClick={() => navigate("/invest")} className="w-12 active:opacity-60" aria-label="Retour aux produits">
          <ChevronLeft size={34} strokeWidth={1.8} />
        </button>
        <div className="flex flex-1 items-center justify-center">
          <img src="/tgood-logo.gif" alt="TGOOD" className="h-8 w-auto" />
        </div>
        <Link href="/my-products" className="w-[142px] text-center font-medium active:opacity-60" style={{ color: TGOOD_GREEN, fontSize: 19 }}>
          MES PRODUITS
        </Link>
      </header>
      <div className="flex h-[52px] items-center gap-3 bg-[#f1f2f4] px-7 text-[#5b616a]">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#626975] text-[10px] font-bold text-white">i</span>
        <div style={{ fontSize: 12, lineHeight: 1.55 }}>
          <p>Les revenus du produit sont réglés toutes les 24 heures</p>
          <p>Vous pouvez acheter plusieurs appareils pour augmenter vos revenus</p>
        </div>
      </div>
      <section className="flex flex-1 flex-col bg-black pb-20">
        <div className="pt-3 text-center text-white">
          <p className="font-semibold" style={{ fontSize: 42, lineHeight: 1.1 }}>USDT {totalEarnings.toLocaleString("fr-FR")}</p>
          <p className="mt-3" style={{ color: TGOOD_GREEN, fontSize: 16 }}>Revenus totaux</p>
        </div>
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>
        ) : !hasProducts ? (
          <div className="flex flex-1 flex-col items-center pt-28 text-center">
            <EmptyEarningsIllustration />
            <p className="mt-7 max-w-[230px]" style={{ color: "#a5a5a5", fontSize: 18, lineHeight: 1.45 }}>
              Aucun produit pour le moment
            </p>
          </div>
        ) : (
          <div className="space-y-3 px-5 pt-10">
            {userProducts.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between border-b border-white/15 py-4 text-white">
                <div>
                  <p className="font-medium">{item.product?.name || "Produit TGOOD"}</p>
                  <p className="mt-1 text-sm text-white/55">Revenu cumulé</p>
                </div>
                <p className="font-semibold" style={{ color: TGOOD_GREEN }}>USDT {Number(item.totalEarned || 0).toLocaleString("fr-FR")}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}