import type { ReactNode } from "react";
import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import depositIcon from "@/assets/3d-deposit.png";
import withdrawalIcon from "@/assets/3d-withdrawal.png";
import withdrawalHero from "@/assets/images/withdrawal-hero-reference.png";

export type ReceiptKind = "deposit" | "withdrawal";
export type HistoryTab = ReceiptKind | "activity";

export interface ReceiptTransaction {
  id: string | number;
  kind: ReceiptKind;
  amount: string | number;
  status: string;
  createdAt: string | Date;
  paymentMethod?: string | null;
  accountNumber?: string | null;
  description?: string | null;
  fees?: string | number | null;
  netAmount?: string | number | null;
}

const STATUS_META: Record<string, { tone: "success" | "pending" | "danger" }> = {
  approved: { tone: "success" },
  completed: { tone: "success" },
  pending: { tone: "pending" },
  pending_2fa: { tone: "pending" },
  processing: { tone: "pending" },
  rejected: { tone: "danger" },
  failed: { tone: "danger" },
};

function formatDate(value: string | Date, lang: string) {
  const date = new Date(value);
  const locale = lang === "en" ? "en-US" : lang === "ar" ? "ar" : lang === "zh" ? "zh-CN" : "fr-FR";
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
}

export function HistoryPageHeader({
  title,
  backHref,
  tabs,
}: {
  title: string;
  backHref: string;
  tabs?: ReactNode;
}) {
  const [, navigate] = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-[#dcece2] bg-white/95 backdrop-blur">
      <div className="relative flex h-14 items-center px-4">
        <button
          type="button"
          onClick={() => navigate(backHref)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#164a33] transition active:scale-95 active:bg-[#eaf7ee]"
          aria-label="Retour"
          data-testid="button-back"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2.4} aria-hidden="true" />
        </button>
        <div className="pointer-events-none absolute inset-x-14 text-center">
          <p className="text-[9px] font-bold tracking-[0.22em] text-[#00a651]">TGOOD</p>
          <h1 className="mt-0.5 text-[15px] font-bold text-[#173d2e]">{title}</h1>
        </div>
      </div>
      {tabs}
    </header>
  );
}

export function HistoryTabs({
  activeTab,
  onChange,
  depositLabel,
  withdrawalLabel,
  activityLabel,
}: {
  activeTab: HistoryTab;
  onChange: (tab: HistoryTab) => void;
  depositLabel: string;
  withdrawalLabel: string;
  activityLabel?: string;
}) {
  const tabs: { id: HistoryTab; label: string }[] = [
    { id: "deposit", label: depositLabel },
    { id: "withdrawal", label: withdrawalLabel },
  ];
  if (activityLabel) tabs.push({ id: "activity", label: activityLabel });

  return (
    <div className={`grid gap-1 border-t border-[#edf4ef] px-4 pt-2 ${activityLabel ? "grid-cols-3" : "grid-cols-2"}`}>
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative h-10 text-sm font-semibold transition-colors ${
              active ? "text-[#087a38]" : "text-[#7b9187]"
            }`}
            aria-pressed={active}
            data-testid={`history-tab-${tab.id}`}
          >
            {tab.label}
            {active && <span className="absolute inset-x-7 bottom-0 h-[3px] rounded-full bg-[#00a651]" />}
          </button>
        );
      })}
    </div>
  );
}

export function ReceiptCard({ transaction }: { transaction: ReceiptTransaction }) {
  const { lang } = useI18n();
  const isDeposit = transaction.kind === "deposit";
  const locale = lang === "en" ? "en-US" : lang === "ar" ? "ar" : lang === "zh" ? "zh-CN" : "fr-FR";
  const numericAmount = Number(transaction.amount);
  const amount = Number.isFinite(numericAmount)
    ? numericAmount.toLocaleString(locale, { maximumFractionDigits: 8 })
    : "0";
  const status = STATUS_META[transaction.status] ?? { tone: "pending" as const };
  const statusLabels: Record<string, string> = lang === "en"
    ? { approved: "Approved", completed: "Completed", pending: "Pending", pending_2fa: "Verification required", processing: "Processing", rejected: "Rejected", failed: "Failed" }
    : lang === "ar"
      ? { approved: "تمت الموافقة", completed: "مكتمل", pending: "قيد الانتظار", pending_2fa: "التحقق مطلوب", processing: "قيد المعالجة", rejected: "مرفوض", failed: "فشل" }
      : lang === "zh"
        ? { approved: "已批准", completed: "已完成", pending: "处理中", pending_2fa: "需要验证", processing: "进行中", rejected: "已拒绝", failed: "失败" }
        : { approved: "Validé", completed: "Validé", pending: "En attente", pending_2fa: "Vérification requise", processing: "En cours", rejected: "Refusé", failed: "Échoué" };
  const statusLabel = statusLabels[transaction.status] || transaction.status || statusLabels.pending;
  const statusClass = {
    success: "border-[#b9e8cb] bg-[#eaf8ef] text-[#087a38]",
    pending: "border-[#f4d9a0] bg-[#fff8e8] text-[#a76409]",
    danger: "border-[#f5c5c5] bg-[#fff1f1] text-[#d13e3e]",
  }[status.tone];
  return (
    <article
      className="relative overflow-hidden rounded-[20px] border border-white/80 bg-white px-4 py-4 shadow-[0_10px_26px_rgba(6,83,49,.11)]"
      data-testid={`receipt-${transaction.kind}-${transaction.id}`}
    >
      <div
        className={`absolute -right-12 -top-16 h-32 w-32 rounded-full opacity-80 ${
          isDeposit ? "bg-[#d9f4e4]" : "bg-[#ffe6e6]"
        }`}
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">
            <img
              src={isDeposit ? depositIcon : withdrawalIcon}
              alt={isDeposit ? "Deposit icon" : "Withdrawal icon"}
              className="h-full w-full object-cover"
            />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-[#173d2e]">
              {isDeposit
                ? (lang === "en" ? "USDT deposit" : lang === "ar" ? "إيداع USDT" : lang === "zh" ? "USDT 充值" : "Dépôt USDT")
                : (lang === "en" ? "USDT withdrawal" : lang === "ar" ? "سحب USDT" : lang === "zh" ? "USDT 提现" : "Retrait USDT")}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-[#71877b]">{formatDate(transaction.createdAt, lang)}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <p className={`text-sm font-bold ${isDeposit ? "text-[#087a38]" : "text-[#d13e3e]"}`}>
            {isDeposit ? "+" : "−"}{amount} USDT
          </p>
          <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${statusClass}`}>
            {statusLabel}
          </span>
        </div>
      </div>
    </article>
  );
}

export function ReceiptLoadingState() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((index) => (
        <div key={index} className="h-[172px] animate-pulse rounded-[20px] bg-white/80 shadow-[0_6px_18px_rgba(6,83,49,.06)]" />
      ))}
    </div>
  );
}

export function ReceiptEmptyState({ kind }: { kind: ReceiptKind }) {
  const { lang } = useI18n();
  return (
    <div className="flex min-h-[310px] flex-col items-center justify-center px-8 text-center">
      <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[22px] bg-white/80 shadow-sm">
        <img
          src={kind === "deposit" ? depositIcon : withdrawalIcon}
          alt={kind === "deposit" ? "Deposit icon" : "Withdrawal icon"}
          className="h-full w-full object-cover"
        />
      </span>
      <p className="mt-4 text-sm font-semibold text-[#315443]">
        {lang === "en" ? "No transactions yet" : lang === "ar" ? "لا توجد معاملات بعد" : lang === "zh" ? "暂无交易" : "Aucune opération pour le moment"}
      </p>
      <p className="mt-1 text-xs leading-5 text-[#799084]">
        {kind === "deposit"
          ? (lang === "en" ? "Your USDT deposits will appear here." : lang === "ar" ? "ستظهر إيداعات USDT هنا." : lang === "zh" ? "您的 USDT 充值将显示在这里。" : "Vos dépôts USDT apparaîtront ici.")
          : (lang === "en" ? "Your USDT BEP20 withdrawals will appear here." : lang === "ar" ? "ستظهر عمليات سحب USDT BEP20 هنا." : lang === "zh" ? "您的 USDT BEP20 提现将显示在这里。" : "Vos retraits USDT BEP20 apparaîtront ici.")}
      </p>
    </div>
  );
}

export function HistoryDecor({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f2f8f4] pb-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[250px] overflow-hidden">
        <img
          src={withdrawalHero}
          alt=""
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#063d2b]/35" />
      </div>
      <div className="relative mx-auto w-full max-w-[480px] px-4 pt-5">{children}</div>
    </main>
  );
}
