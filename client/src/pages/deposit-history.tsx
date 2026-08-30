import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import {
  HistoryDecor,
  HistoryPageHeader,
  ReceiptCard,
  ReceiptEmptyState,
  ReceiptLoadingState,
  type ReceiptTransaction,
} from "@/components/history-receipt";

interface Deposit {
  id: number;
  amount: string;
  status: string;
  paymentMethod?: string | null;
  accountNumber?: string | null;
  createdAt: string;
}

export default function DepositHistoryPage() {
  const { t } = useI18n();
  const { data: deposits = [], isLoading } = useQuery<Deposit[]>({
    queryKey: ["/api/deposits/history"],
  });

  const receipts: ReceiptTransaction[] = deposits.map((deposit) => ({
    id: deposit.id,
    kind: "deposit",
    amount: deposit.amount,
    status: deposit.status,
    createdAt: deposit.createdAt,
    paymentMethod: deposit.paymentMethod,
    accountNumber: deposit.accountNumber,
  }));

  return (
    <div className="min-h-screen bg-[#f2f8f4]">
      <HistoryPageHeader title={t.depositHistory || "Historique des dépôts"} backHref="/deposit" />
      <HistoryDecor>
        <div className="mb-4 pt-1 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b9f2cf]">Portefeuille TGOOD</p>
          <p className="mt-1 text-lg font-bold">Dépôts USDT</p>
        </div>
        <section className="space-y-3" aria-live="polite">
          {isLoading ? (
            <ReceiptLoadingState />
          ) : receipts.length > 0 ? (
            receipts.map((receipt) => <ReceiptCard key={receipt.id} transaction={receipt} />)
          ) : (
            <ReceiptEmptyState kind="deposit" />
          )}
        </section>
      </HistoryDecor>
    </div>
  );
}