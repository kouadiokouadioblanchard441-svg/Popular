import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ChevronLeft, CheckCircle2, Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import productBike from "@assets/generated_images/tgood-product-bike-card.jpg";
import productScooter from "@assets/generated_images/tgood-scooter.jpg";
import productMoped from "@assets/generated_images/tgood-moped.jpg";

const TGOOD_GREEN = "#00c83c";
const PRODUCT_VISUALS = [productBike, productScooter, productMoped];

function EmptyProductsIllustration() {
  return (
    <svg width="210" height="170" viewBox="0 0 210 170" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="empty-silver" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#f5f5f5" />
          <stop offset="1" stopColor="#969696" />
        </linearGradient>
      </defs>
      <path d="M18 103h42v-50H18v50Z" fill="url(#empty-silver)" />
      <path d="M145 103h40V24h-40v79Z" fill="url(#empty-silver)" />
      <path d="M184 103h19V43h-19v60Z" fill="url(#empty-silver)" />
      <rect x="63" y="23" width="85" height="99" rx="2" fill="#fafafa" />
      <rect x="71" y="32" width="69" height="69" rx="2" fill="#fff" />
      <rect x="85" y="45" width="41" height="6" rx="2" fill="#e6e8eb" />
      <rect x="85" y="62" width="41" height="6" rx="2" fill="#e6e8eb" />
      <rect x="85" y="79" width="41" height="6" rx="2" fill="#e6e8eb" />
      <rect x="51" y="101" width="111" height="36" fill="#ebedf0" />
      <rect x="90" y="114" width="35" height="7" rx="2" fill="#fff" />
      <path d="M39 29c7-11 25-5 23 7-2 9-14 8-23 8-10 0-13-9 0-15Z" fill="url(#empty-silver)" />
      <path d="M127 10c13-20 43-7 39 13-3 14-22 12-39 12-17 0-22-15 0-25Z" fill="url(#empty-silver)" />
    </svg>
  );
}

function PageHeader() {
  const [, navigate] = useLocation();
  return (
    <>
      <header className="flex h-[80px] items-center border-b border-[#e5e5e5] bg-white px-5">
        <button onClick={() => navigate("/invest")} className="w-12 active:opacity-60" aria-label="Retour aux produits">
          <ChevronLeft size={34} strokeWidth={1.8} />
        </button>
        <div className="flex flex-1 items-center justify-center">
          <img src="/tgood-logo.gif" alt="TGOOD" className="h-8 w-auto" />
        </div>
        <Link href="/earnings" className="w-[142px] text-center font-medium active:opacity-60" style={{ color: TGOOD_GREEN, fontSize: 19 }}>
          MES REVENUS
        </Link>
      </header>
      <div className="flex h-[52px] items-center gap-3 bg-[#f1f2f4] px-7 text-[#5b616a]">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#626975] text-[10px] font-bold text-white">i</span>
        <div style={{ fontSize: 12, lineHeight: 1.55 }}>
          <p>Les revenus du produit sont réglés toutes les 24 heures</p>
          <p>Vous pouvez acheter plusieurs appareils pour augmenter vos revenus</p>
        </div>
      </div>
    </>
  );
}

export default function MyProductsPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const { data: userProducts = [], isLoading } = useQuery<any[]>({ queryKey: ["/api/user/products"] });

  const collectFinalMutation = useMutation({
    mutationFn: async (userProductId: number) => {
      const response = await apiRequest("POST", `/api/user/collect-final/${userProductId}`, {});
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/products"] });
      refreshUser();
      toast({ title: "Gains collectés !", description: `${Number(data.collected).toLocaleString("fr-FR")} USDT ajoutés à votre solde.` });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  if (!user) return null;

  const totalEarned = userProducts.reduce((sum: number, item: any) => sum + Number(item.totalEarned || 0), 0);

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <PageHeader />
      <section className="flex flex-1 flex-col bg-black pb-20">
        <div className="pt-3 text-center text-white">
          <p className="font-semibold" style={{ fontSize: 42, lineHeight: 1.1 }}>USDT {totalEarned.toLocaleString("fr-FR")}</p>
          <p className="mt-3" style={{ color: TGOOD_GREEN, fontSize: 16 }}>Revenus totaux</p>
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>
        ) : userProducts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center pt-28 text-center">
            <EmptyProductsIllustration />
            <p className="mt-7 max-w-[230px]" style={{ color: "#a5a5a5", fontSize: 18, lineHeight: 1.45 }}>
              Aucun produit pour le moment
            </p>
          </div>
        ) : (
          <div className="space-y-4 px-4 pb-6 pt-8">
            {userProducts.map((userProduct: any, index) => {
              const product = userProduct.product || {};
              const cycleDays = Number(product.cycleDays || 0);
              const daysRemaining = Number(userProduct.daysRemaining || 0);
              const completedDays = Math.max(0, cycleDays - daysRemaining);
              const progress = cycleDays > 0 ? Math.min(100, Math.round((completedDays / cycleDays) * 100)) : 0;
              const earned = Number(userProduct.totalEarned || 0);
              const canCollect = product.collectAtEnd && daysRemaining <= 0 && earned > 0;
              const image = product.imageUrl?.toLowerCase().includes("tgood")
                ? product.imageUrl
                : PRODUCT_VISUALS[index % PRODUCT_VISUALS.length];

              return (
                <article key={userProduct.id} className="overflow-hidden rounded-xl border border-white/10 bg-[#151515]" data-testid={`product-card-${userProduct.id}`}>
                  <img src={image} alt={product.name || "Produit TGOOD"} className="h-36 w-full object-cover" />
                  <div className="p-4 text-white">
                    <h2 className="text-lg font-semibold">{product.name || "TGOOD GreenRide"}</h2>
                    <div className="mt-3 flex justify-between text-sm text-white/75">
                      <span>Gains reçus</span><span>USDT {earned.toLocaleString("fr-FR")}</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
                      <div className="h-full rounded-full" style={{ width: `${progress}%`, background: TGOOD_GREEN }} />
                    </div>
                    <p className="mt-1 text-xs text-white/55">{completedDays}/{cycleDays} jours</p>
                    {canCollect ? (
                      <button
                        onClick={() => collectFinalMutation.mutate(userProduct.id)}
                        disabled={collectFinalMutation.isPending}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 font-semibold text-black disabled:opacity-60"
                        style={{ background: TGOOD_GREEN }}
                      >
                        {collectFinalMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        Collecter USDT {earned.toLocaleString("fr-FR")}
                      </button>
                    ) : product.collectAtEnd ? (
                      <p className="mt-3 flex items-center justify-center gap-1 text-sm text-white/55"><Lock size={14} /> Disponible en fin de cycle</p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}