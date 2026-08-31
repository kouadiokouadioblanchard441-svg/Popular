import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2, AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatCurrency } from "@/lib/countries";
import type { Product } from "@shared/schema";

import { getProductVisual } from "@/lib/product-visuals";
import { getContent } from "@/lib/content";

const TGOOD_GREEN = "#00ef24";
const CURRENCY = "USDT";
interface ProductWithOwnership extends Product {
  isOwned: boolean;
  ownedCount?: number;
}

/* ── Info row inside card ── */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2" style={{ marginBottom: 7 }}>
      <span style={{ color: "#fff", fontSize: "clamp(12px, 3.7vw, 16px)", fontWeight: 400 }}>
        {label}
      </span>
      <span className="text-right" style={{ color: "#fff", fontSize: "clamp(12px, 3.7vw, 16px)", fontWeight: 400, whiteSpace: "nowrap" }}>
        {value}
      </span>
    </div>
  );
}

export default function ProductsPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const { t, lang } = useI18n();
  const [confirmProduct, setConfirmProduct] = useState<ProductWithOwnership | null>(null);
  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<ProductWithOwnership[]>({
    queryKey: ["/api/products"],
  });

  const purchaseMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest("POST", `/api/products/${productId}/purchase`, {});
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || t.errorOccurred);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/products"] });
      refreshUser();
      setConfirmProduct(null);
      toast({ title: t.purchaseSuccess, description: t.purchaseSuccessDescription });
    },
    onError: (error: any) => {
      setConfirmProduct(null);
      toast({ title: error.message || t.errorOccurred, variant: "destructive" });
    },
  });

  if (!user) return null;

  const balance  = parseFloat(user.balance || "0");
  const currency = CURRENCY;
  const locale = lang === "en" ? "en-US" : lang === "ar" ? "ar" : lang === "zh" ? "zh-CN" : "fr-FR";

  const paidProducts = (products || []).filter(p => !p.isFree);
  const filtered = paidProducts;
  const ownedProductCount = paidProducts.filter(p => p.isOwned).length;
  const totalRevenue = Number.isFinite(Number(user.totalEarnings)) ? Number(user.totalEarnings) : 0;
  const pageTitle = getContent(settings, "content_products_headerTitle", "Nos produits TGOOD");
  const getDisplayName = (product: ProductWithOwnership) => product.name;
  const getProductImage = (product: ProductWithOwnership, index: number) => {
    return getProductVisual(product.imageUrl, index);
  };
  const confirmProductIndex = confirmProduct
    ? Math.max(0, filtered.findIndex((product) => product.id === confirmProduct.id))
    : 0;

  /* ─── Ouvre toujours le popup — la vérification du solde se fait dedans ─── */
  const handleBuy = (product: ProductWithOwnership) => {
    setConfirmProduct(product);
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="h-[138px] shrink-0 bg-black px-5 pt-7 text-white">
        <div className="grid grid-cols-2 text-center">
          <Link href="/my-products" className="active:opacity-70">
            <p className="font-semibold" style={{ fontSize: "clamp(32px, 9vw, 43px)", lineHeight: 1 }}>{ownedProductCount}</p>
            <p className="mt-4" style={{ color: TGOOD_GREEN, fontSize: 16 }}>{getContent(settings, "content_orders_headerTitle", lang === "en" ? "My products" : "Mes produits")} &gt;</p>
          </Link>
          <Link href="/earnings" className="active:opacity-70">
            <p className="truncate font-semibold" style={{ fontSize: "clamp(28px, 8vw, 43px)", lineHeight: 1 }}>{CURRENCY} {totalRevenue.toLocaleString(locale)}</p>
            <p className="mt-4" style={{ color: TGOOD_GREEN, fontSize: 16 }}>{getContent(settings, "content_orders_infoLine2", lang === "en" ? "My earnings" : "Mes revenus")} &gt;</p>
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        <h1 className="sr-only">{pageTitle}</h1>
        {productsLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: "#fff", fontSize: 14 }}>{t.noProducts}</p>
          </div>
        ) : (
          filtered.map((product, index) => {
            const img = getProductImage(product, index);
            const isPending = purchaseMutation.isPending && purchaseMutation.variables === product.id;
            const stock = Math.min(100, Math.max(0, Number(product.stockPercentage) || 0));
            const isSoldOut = stock >= 100;
            const isUnavailable = !!product.isUnavailable;
            const isBlocked = isSoldOut || isUnavailable;
             const displayName = getDisplayName(product);

            return (
              <div
                key={product.id}
                className="relative"
                style={{
                  height: 292,
                  background: "#202020",
                  borderBottom: "6px solid #000",
                  overflow: "hidden",
                }}
                data-testid={`product-card-${product.id}`}
              >
                <img
                  src={img}
                  alt={`Produit ${displayName}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: "center 54%" }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,.46) 53%, rgba(0,0,0,.08) 100%)" }} />
                <div className="relative z-10 h-full px-5 pt-6 text-white">
                  <p className="font-semibold" style={{ fontSize: 27, lineHeight: 1.15 }}>{displayName}</p>
                  <div className="mt-4 w-[76%] max-w-[340px] bg-black/45 px-2.5 py-2.5">
                    <InfoRow label={`${t.price}:`} value={`${currency} ${Number(product.price).toLocaleString(locale)}`} />
                    <InfoRow label={`${t.duration}:`} value={`${product.cycleDays} ${t.ordersDaysLbl}`} />
                    <InfoRow label={`${t.dailyRevenue}:`} value={`${currency} ${Number(product.dailyEarnings).toLocaleString(locale)}`} />
                    <InfoRow label={`${t.totalRevenue}:`} value={`${currency} ${Number(product.totalReturn).toLocaleString(locale)}`} />
                  </div>
                  <button
                    onClick={() => !isBlocked && handleBuy(product)}
                    disabled={purchaseMutation.isPending || isBlocked}
                    className="mt-3 flex h-10 w-[76%] max-w-[340px] items-center justify-center font-bold text-black active:scale-[.98] disabled:opacity-100"
                    style={{
                      background: isBlocked ? "#aeb6c0" : TGOOD_GREEN,
                      fontSize: 18,
                      transition: "transform 120ms ease",
                    }}
                    data-testid={`button-purchase-${product.id}`}
                  >
                    {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : isBlocked ? (lang === "en" ? "Sold out" : "Épuisé") : t.buy.toUpperCase()}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ══ POPUP CONFIRMATION ACHAT ══ */}
      <Dialog open={!!confirmProduct} onOpenChange={(open) => !open && setConfirmProduct(null)}>
        {confirmProduct && (
          <DialogContent className="w-[calc(100%-2rem)] max-w-[420px] overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-2xl">
            <DialogTitle className="sr-only">Confirmer l'achat de {getDisplayName(confirmProduct)}</DialogTitle>
            {/* Image produit */}
            <div className="flex items-center justify-center" style={{ background: "#f8f8f8", height: 200 }}>
              <img
                src={getProductImage(confirmProduct, confirmProductIndex)}
                alt={getDisplayName(confirmProduct)}
                style={{ height: 180, maxWidth: "90%", objectFit: "contain" }}
              />
            </div>

            {/* Prix + nom */}
            <div className="px-5 pt-4 pb-2">
              <p className="font-black" style={{ fontSize: 24, color: TGOOD_GREEN, lineHeight: 1.2 }}>
                {currency} {Number(confirmProduct.price).toLocaleString(locale)}
              </p>
              <p style={{ fontSize: 14, color: "#555", marginTop: 2 }}>{getDisplayName(confirmProduct)}</p>
            </div>

            {/* Séparateur */}
            <div style={{ height: 1, background: "#f0f0f0", margin: "0 20px" }} />

            {/* Description */}
            <div className="px-5 py-3 text-center">
              <p style={{ fontSize: 13, color: "#333", fontWeight: 600 }}>
                {t.investConfirmDesc}
              </p>
              <p style={{ fontSize: 12, color: "#888", marginTop: 3, lineHeight: 1.5 }}>
                {lang === "en" ? "You can buy multiple devices to increase your earnings" : "Vous pouvez acheter plusieurs appareils pour augmenter vos revenus"}
              </p>
            </div>

            {/* Alerte solde insuffisant */}
            {balance < parseFloat(String(confirmProduct.price)) && (
              <div className="mx-5 mb-2 flex items-center gap-2 p-2.5 rounded-xl"
                style={{ background: "#fff2f2", border: "1px solid #fca5a5" }}>
                <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: TGOOD_GREEN }} />
                <p className="text-xs" style={{ color: "#149a39" }}>
                  {t.investInsufficient.replace("{0}", formatCurrency(
                    parseFloat(String(confirmProduct.price)) - balance, user.country
                  ))}
                </p>
              </div>
            )}

            {/* Stats 3 colonnes */}
            <div className="flex" style={{ margin: "0 20px 16px", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
              {[
                { value: `${confirmProduct.cycleDays} ${t.ordersDaysLbl}`, label: t.duration },
                { value: `${currency} ${Number(confirmProduct.dailyEarnings).toLocaleString(locale)}`, label: t.dailyRevenue },
                { value: `${currency} ${Number(confirmProduct.totalReturn).toLocaleString(locale)}`, label: t.totalRevenue },
              ].map((stat, i) => (
                <div key={i} className="flex-1 flex flex-col items-center py-3"
                  style={{ borderRight: i < 2 ? "1px solid #eee" : "none" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#12bc3e", lineHeight: 1.3 }}>{stat.value}</p>
                  <p style={{ fontSize: 11, color: "#888", marginTop: 2, textAlign: "center", lineHeight: 1.3 }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Boutons */}
            <div className="flex" style={{ borderTop: "1px solid #f0f0f0" }}>
              <button
                onClick={() => setConfirmProduct(null)}
                className="flex-1 font-semibold active:opacity-70"
                style={{ padding: "17px 0", fontSize: 16, color: "#555", background: "#e8e8e8", border: "none", borderBottomLeftRadius: 24 }}
                data-testid="button-cancel-purchase"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => purchaseMutation.mutate(confirmProduct.id)}
                disabled={purchaseMutation.isPending || balance < parseFloat(String(confirmProduct.price))}
                className="flex-1 font-bold text-white flex items-center justify-center gap-2 active:opacity-80 disabled:opacity-50"
                style={{ padding: "17px 0", fontSize: 16, background: "#12bc3e", border: "none", borderBottomRightRadius: 24 }}
                data-testid="button-confirm-purchase"
              >
                {purchaseMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {t.confirm}
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
