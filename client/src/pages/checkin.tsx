import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, CalendarCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CheckinStatus {
  canClaim: boolean;
  hoursRemaining: number;
  totalBonusClaimed: number;
  daysPointed: number;
}

const GREEN = "#08b83a";

export default function CheckinPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const { data: status, isLoading } = useQuery<CheckinStatus>({
    queryKey: ["/api/daily-bonus-status"],
    refetchInterval: 60000,
  });

  const claimMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/claim-daily-bonus", {});
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Pointage impossible");
      return data as { message: string };
    },
    onSuccess: async (data) => {
      setMessage(data.message);
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ["/api/daily-bonus-status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({ title: "Pointage validé", description: data.message });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  if (!user) return null;

  return (
    <main className="min-h-screen w-full bg-[#f2f7f3]" style={{ maxWidth: 480, margin: "0 auto" }}>
      <header className="flex h-[72px] items-center bg-white px-5 shadow-sm">
        <Link href="/">
          <button className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#edf8ef]" aria-label="Retour">
            <ArrowLeft className="h-6 w-6" />
          </button>
        </Link>
        <h1 className="ml-3 text-xl font-bold text-[#151515]">Pointage</h1>
      </header>

      <section className="mx-4 mt-5 overflow-hidden rounded-2xl bg-[#08b83a] p-5 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Récompense de pointage quotidien</p>
            <p className="mt-2 text-4xl font-black">0,10 – 0,40 USDT</p>
            <p className="mt-2 text-sm opacity-90">Une récompense aléatoire chaque 24 heures</p>
          </div>
          <CalendarCheck className="h-14 w-14 shrink-0 opacity-90" strokeWidth={1.5} />
        </div>
      </section>

      <section className="mx-4 mt-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl bg-[#f2faf4] p-3">
            <p className="text-2xl font-bold text-[#151515]">{status?.daysPointed || 0}</p>
            <p className="mt-1 text-xs text-[#65736e]">Jours pointés</p>
          </div>
          <div className="rounded-xl bg-[#f2faf4] p-3">
            <p className="text-2xl font-bold text-[#151515]">{(status?.totalBonusClaimed || 0).toFixed(2)}</p>
            <p className="mt-1 text-xs text-[#65736e]">Bonus cumulés USDT</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => claimMutation.mutate()}
          disabled={isLoading || claimMutation.isPending || !status?.canClaim}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-full font-bold text-white disabled:bg-[#cfd6d1]"
          style={{ background: status?.canClaim ? GREEN : undefined }}
          data-testid="button-checkin"
        >
          {claimMutation.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : status?.canClaim ? (
            "Pointer maintenant"
          ) : (
            `Revenez dans ${status?.hoursRemaining || 0}h`
          )}
        </button>

        {message && <p className="mt-3 text-center text-sm font-medium text-[#149a39]" role="status">{message}</p>}
        <p className="mt-5 text-sm leading-6 text-[#65736e]">
          Le pointage ajoute directement la récompense à votre solde des gains. Vous pouvez pointer une fois toutes les 24 heures.
        </p>
      </section>
    </main>
  );
}