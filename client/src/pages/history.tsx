import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { TrendingUp } from "lucide-react";
import earningIcon from "@/assets/3d-earning.png";
import {
  HistoryDecor,
  HistoryPageHeader,
  HistoryTabs,
  ReceiptCard,
  ReceiptEmptyState,
  ReceiptLoadingState,
  type HistoryTab,
  type ReceiptTransaction,
} from "@/components/history-receipt";

interface HistoryItem {
  id: string;
  category: string;
  amount: string;
  status: string;
  description?: string | null;
  createdAt: string;
  extra?: {
    fees?: string | null;
    netAmount?: string | null;
    paymentMethod?: string | null;
  };
}

function toReceipt(item: HistoryItem): ReceiptTransaction {
  return {
    id: item.id,
    kind: item.category === "withdrawal" ? "withdrawal" : "deposit",
    amount: item.amount,
    status: item.status,
    createdAt: item.createdAt,
    paymentMethod: item.extra?.paymentMethod,
    description: item.description,
    fees: item.extra?.fees,
    netAmount: item.extra?.netAmount,
  };
}

export default function HistoryPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<HistoryTab>("deposit");
  const { data: items = [], isLoading } = useQuery<HistoryItem[]>({
    queryKey: ["/api/history/all"],
    staleTime: 0,
    refetchOnMount: true,
  });

  const visibleItems = items
    .filter((item) => activeTab === "activity"
      ? item.category !== "deposit" && item.category !== "withdrawal"
      : item.category === activeTab)
    .map(toReceipt);

  const activityItems = items.filter(
    (item) => item.category !== "deposit" && item.category !== "withdrawal",
  );

  return (
    <div className="min-h-screen bg-[#f2f8f4]">
      <HistoryPageHeader
        title={t.transactionHistoryTitle || "Historique"}
        backHref="/account"
        tabs={(
          <HistoryTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            depositLabel={t.deposit}
            withdrawalLabel={t.withdraw}
            activityLabel={t.earnings}
          />
        )}
      />
      <HistoryDecor>
        <div className="mb-4 pt-1 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b9f2cf]">Portefeuille TGOOD</p>
          <p className="mt-1 text-lg font-bold">
            {activeTab === "deposit"
              ? (t.deposit === "Deposit" ? "Your USDT deposits" : "Vos dépôts USDT")
              : activeTab === "withdrawal"
                ? (t.withdraw === "Withdraw" ? "Your USDT BEP20 withdrawals" : "Vos retraits USDT BEP20")
                : (t.earnings === "Earnings" ? "Your earnings and bonuses" : "Vos gains et bonus")}
          </p>
        </div>
        <section className="space-y-3" aria-live="polite">
          {isLoading ? (
            <ReceiptLoadingState />
          ) : activeTab !== "activity" && visibleItems.length > 0 ? (
            visibleItems.map((item) => <ReceiptCard key={item.id} transaction={item} />)
          ) : activeTab === "activity" && activityItems.length > 0 ? (
            activityItems.map((item) => <ActivityCard key={item.id} item={item} />)
          ) : (
            activeTab === "activity" ? <ActivityEmptyState /> : <ReceiptEmptyState kind={activeTab} />
          )}
        </section>
      </HistoryDecor>
    </div>
  );
}

function ActivityCard({ item }: { item: HistoryItem }) {
  const { lang } = useI18n();
  const amount = Number(item.amount);
  const locale = lang === "en" ? "en-US" : lang === "ar" ? "ar" : lang === "zh" ? "zh-CN" : "fr-FR";
  const safeAmount = Number.isFinite(amount) ? amount.toLocaleString(locale, { maximumFractionDigits: 8 }) : "0";
  const date = new Intl.DateTimeFormat(locale, {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(item.createdAt));
  const description = lang === "en"
    ? item.description
      ?.replace(/bonus quotidien/gi, "Daily bonus")
      .replace(/pointage aléatoire de/gi, "random check-in of")
      .replace(/pointage de/gi, "check-in of")
      .replace(/pointage/gi, "check-in")
      .replace(/aléatoire/gi, "random")
      .replace(/crédité directement sur votre solde/gi, "credited directly to your balance")
    : item.description;

  return (
    <article className="flex items-center gap-3 rounded-[20px] border border-white/80 bg-white px-4 py-4 shadow-[0_8px_22px_rgba(6,83,49,.09)]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">
        <img src={earningIcon} alt="Earnings icon" className="h-full w-full object-cover" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#173d2e]">{description || (lang === "en" ? "TGOOD earnings" : "Gain TGOOD")}</p>
        <p className="mt-0.5 text-[11px] text-[#71877b]">{date}</p>
      </div>
      <p className="shrink-0 text-sm font-bold text-[#087a38]">+{safeAmount} USDT</p>
    </article>
  );
}

function ActivityEmptyState() {
  const { lang } = useI18n();
  return (
    <div className="flex min-h-[310px] flex-col items-center justify-center px-8 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/80 text-[#81a894] shadow-sm">
        <TrendingUp className="h-7 w-7" />
      </span>
      <p className="mt-4 text-sm font-semibold text-[#315443]">
        {lang === "en" ? "No earnings or bonuses yet" : lang === "ar" ? "لا توجد أرباح أو مكافآت بعد" : lang === "zh" ? "暂无收益或奖金" : "Aucun gain ou bonus pour le moment"}
      </p>
      <p className="mt-1 text-xs leading-5 text-[#799084]">
        {lang === "en" ? "Your earnings, commissions and bonuses will appear here." : lang === "ar" ? "ستظهر أرباحك وعمولاتك ومكافآتك هنا." : lang === "zh" ? "您的收益、佣金和奖金将显示在这里。" : "Vos gains, commissions et bonus apparaîtront ici."}
      </p>
    </div>
  );
}