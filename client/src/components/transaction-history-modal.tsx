import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/countries";
import { useI18n } from "@/lib/i18n";
import { TrendingUp } from "lucide-react";
import type { Deposit, Withdrawal, Transaction } from "@shared/schema";
import { ReceiptCard, ReceiptEmptyState, ReceiptLoadingState } from "@/components/history-receipt";

interface TransactionHistoryModalProps {
  open: boolean;
  onClose: () => void;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TransactionHistoryModal({ open, onClose }: TransactionHistoryModalProps) {
  const { user } = useAuth();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("deposits");

  const { data: deposits, isLoading: depositsLoading } = useQuery<Deposit[]>({
    queryKey: ["/api/deposits/history"],
    enabled: open && activeTab === "deposits",
  });

  const { data: withdrawals, isLoading: withdrawalsLoading } = useQuery<Withdrawal[]>({
    queryKey: ["/api/withdrawals/history"],
    enabled: open && activeTab === "withdrawals",
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: open && activeTab === "earnings",
  });

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t.transactionHistoryTitle}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
          <TabsList className="grid grid-cols-3 bg-[#edf7f0]">
            <TabsTrigger value="deposits">{t.deposit}</TabsTrigger>
            <TabsTrigger value="withdrawals">{t.withdraw}</TabsTrigger>
            <TabsTrigger value="earnings">{t.earnings}</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="deposits" className="mt-0 space-y-3">
              {depositsLoading ? (
                <ReceiptLoadingState />
              ) : deposits && deposits.length > 0 ? (
                deposits.map((deposit) => (
                  <ReceiptCard
                    key={deposit.id}
                    transaction={{
                      id: deposit.id,
                      kind: "deposit",
                      amount: deposit.amount,
                      status: deposit.status,
                      createdAt: deposit.createdAt,
                      paymentMethod: deposit.paymentMethod,
                    }}
                  />
                ))
              ) : (
                <ReceiptEmptyState kind="deposit" />
              )}
            </TabsContent>

            <TabsContent value="withdrawals" className="mt-0 space-y-3">
              {withdrawalsLoading ? (
                <ReceiptLoadingState />
              ) : withdrawals && withdrawals.length > 0 ? (
                withdrawals.map((withdrawal) => (
                  <ReceiptCard
                    key={withdrawal.id}
                    transaction={{
                      id: withdrawal.id,
                      kind: "withdrawal",
                      amount: withdrawal.amount,
                      status: withdrawal.status,
                      createdAt: withdrawal.createdAt,
                      accountNumber: withdrawal.accountNumber,
                      paymentMethod: "USDT BEP20",
                      fees: withdrawal.fees,
                      netAmount: withdrawal.netAmount,
                    }}
                  />
                ))
              ) : (
                <ReceiptEmptyState kind="withdrawal" />
              )}
            </TabsContent>

            <TabsContent value="earnings" className="mt-0 space-y-3">
              {transactionsLoading ? (
                Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
              ) : transactions && transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              +{formatCurrency(parseFloat(transaction.amount), user.country)}
                            </p>
                            <p className="text-xs text-muted-foreground">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(transaction.createdAt as unknown as string)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">{t.noTransactions}</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
