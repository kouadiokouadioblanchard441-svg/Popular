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

interface Withdrawal {
  id: number;
  amount: string;
  netAmount?: string | null;
  fees?: string | null;
  status: string;
  paymentMethod?: string | null;
  accountNumber?: string | null;
  createdAt: string;
}

export default function WithdrawalHistoryPage() {
  const { t } = useI18n();
  const { data: withdrawals = [], isLoading } = useQuery<Withdrawal[]>({
    queryKey: ["/api/withdrawals/history"],
  });

  const receipts: ReceiptTransaction[] = withdrawals.map((withdrawal) => ({
    id: withdrawal.id,
    kind: "withdrawal",
    amount: withdrawal.amount,
    status: withdrawal.status,
    createdAt: withdrawal.createdAt,
    paymentMethod: "USDT BEP20",
    accountNumber: withdrawal.accountNumber,
    fees: withdrawal.fees,
    netAmount: withdrawal.netAmount,
  }));

  return (
    <div className="min-h-screen bg-[#f2f8f4]">
      <HistoryPageHeader title={t.withdrawalHistory || "Historique des retraits"} backHref="/withdrawal" />
      <HistoryDecor>
        <div className="mb-4 pt-1 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b9f2cf]">Portefeuille TGOOD</p>
          <p className="mt-1 text-lg font-bold">Retraits USDT BEP20</p>
        </div>
        <section className="space-y-3" aria-live="polite">
          {isLoading ? (
            <ReceiptLoadingState />
          ) : receipts.length > 0 ? (
            receipts.map((receipt) => <ReceiptCard key={receipt.id} transaction={receipt} />)
          ) : (
            <ReceiptEmptyState kind="withdrawal" />
          )}
        </section>
      </HistoryDecor>
    </div>
  );
}