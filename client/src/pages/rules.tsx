import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function RulesPage() {
  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings"],
  });

  const signupBonus = settings?.signupBonusAmount || "2";
  const minDeposit = settings?.minDeposit || "4000";
  const minWithdrawal = settings?.minWithdrawal || "1500";
  const withdrawalFees = settings?.withdrawalFees || "18";
  const withdrawalStartHour = settings?.withdrawalStartHour || "9";
  const withdrawalEndHour = settings?.withdrawalEndHour || "17";
  const maxWithdrawalsPerDay = settings?.maxWithdrawalsPerDay || "1";
  const lv1 = settings?.level1Commission || "25";
  const lv2 = settings?.level2Commission || "3";
  const lv3 = settings?.level3Commission || "1";

  const rPageTitle = "Règles TGOOD";
  const rS1Title = "1. Utilisation des produits TGOOD";
  const rS1b1 = "Les produits TGOOD disponibles sont présentés avec leur prix, leur durée et leurs conditions avant toute activation.";
  const rS1b2 = "Les revenus liés à un produit actif sont calculés et crédités selon le calendrier indiqué sur sa fiche.";
  const rS1b3 = "Chaque membre doit consulter les informations du produit et s'assurer qu'elles correspondent à ses besoins avant confirmation.";
  const rS2Title = "2. Rechargement & retrait";
  const rS3Title = "3. Programme de parrainage";
  const rS3b4 = "Toute fraude, tentative de manipulation ou utilisation de plusieurs comptes peut entraîner la suspension du compte.";
  const rS4Title = "4. Bonus & récompenses";
  const rS5Title = "5. Sécurité & assistance";
  const rS5b1 = "Chaque membre est responsable de la sécurité de son mot de passe et de ses moyens de paiement.";
  const rS5b2 = "Ne partagez jamais vos identifiants, codes de validation ou adresse de portefeuille avec un tiers.";
  const rS5b3 = "Le support officiel TGOOD ne vous demandera jamais votre mot de passe ni vos codes confidentiels.";

  return (
    <div className="flex min-h-screen flex-col text-[#26352d]" style={{ background: "#f8f9fa", color: "#26352d" }}>
      <header className="flex items-center border-b border-[#dbe8df] bg-[#087a38] px-4 py-3 text-white">
        <Link href="/account">
          <button className="p-1" data-testid="button-back" aria-label="Retour">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </Link>
        <h1 className="flex-1 pr-6 text-center text-lg font-semibold text-white">{rPageTitle}</h1>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        <section className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="border-l-4 border-[#00a651] pl-3 text-lg font-bold text-[#087a38]">{rS1Title}</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[#3f4d45]">
            <li>{rS1b1}</li>
            <li>{rS1b2}</li>
            <li>{rS1b3}</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="border-l-4 border-[#00a651] pl-3 text-lg font-bold text-[#087a38]">{rS2Title}</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[#3f4d45]">
            <li>Montant minimum de recharge : {parseInt(minDeposit).toLocaleString()} USDT.</li>
            <li>Montant minimum de retrait : {parseInt(minWithdrawal).toLocaleString()} USDT.</li>
            <li>Frais de retrait : {withdrawalFees}%, couvrant les frais de traitement et de maintenance.</li>
            <li>Horaires de retrait : {withdrawalStartHour}h00 – {withdrawalEndHour}h00.</li>
            <li>Maximum {maxWithdrawalsPerDay} retrait(s) par jour et par utilisateur.</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="border-l-4 border-[#00a651] pl-3 text-lg font-bold text-[#087a38]">{rS3Title}</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[#3f4d45]">
            <li>Commission niveau 1 : {lv1}% sur le premier investissement du filleul direct.</li>
            <li>Commission niveau 2 : {lv2}% sur le premier investissement du filleul indirect.</li>
            <li>Commission niveau 3 : {lv3}% sur le premier investissement du filleul de niveau 3.</li>
            <li>{rS3b4}</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="border-l-4 border-[#00a651] pl-3 text-lg font-bold text-[#087a38]">{rS4Title}</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[#3f4d45]">
            <li>Chaque nouveau membre reçoit un bonus de {parseInt(signupBonus).toLocaleString()} USDT à l'inscription.</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="border-l-4 border-[#00a651] pl-3 text-lg font-bold text-[#087a38]">{rS5Title}</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[#3f4d45]">
            <li>{rS5b1}</li>
            <li>{rS5b2}</li>
            <li>{rS5b3}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
