import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getCountryByCode } from "@/lib/countries";
import { useLocation } from "wouter";
import teamHero from "@assets/generated_images/tgood-team-hero.jpg";
import teamInvite from "@assets/generated_images/tgood-team-invite.jpg";

const TGOOD_GREEN = "#078438";
const TGOOD_LIGHT_GREEN = "#0aa548";

interface TeamStats {
  level1Count: number;
  level2Count: number;
  level3Count: number;
  totalCommission: number;
  level1Commission: number;
  level2Commission: number;
  level3Commission: number;
}

export default function TeamPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: stats } = useQuery<TeamStats>({ queryKey: ["/api/team/stats"] });
  const { data: settings } = useQuery<Record<string, string>>({ queryKey: ["/api/settings"] });

  if (!user) return null;

  const country = getCountryByCode(user.country);
  const currency = "USDT";
  const referralCode = user.referralCode || "";
  const referralLink = `${window.location.origin}/#/register?invite_code=${referralCode}`;
  const levelRates = [
    settings?.level1Commission || "36",
    settings?.level2Commission || "2",
    settings?.level3Commission || "1",
  ];
  const levelCounts = [stats?.level1Count || 0, stats?.level2Count || 0, stats?.level3Count || 0];
  const levelRewards = [
    stats?.level1Commission || 0,
    stats?.level2Commission || 0,
    stats?.level3Commission || 0,
  ];
  const totalUsers = levelCounts.reduce((total, count) => total + count, 0);
  const totalCommission = stats?.totalCommission || 0;

  const copy = async (value: string, message: string) => {
    await navigator.clipboard.writeText(value);
    toast({ title: message });
  };

  return (
    <main className="team-page pb-16" style={{ background: "#fff", minHeight: "100vh" }}>
      <section className="mx-auto w-full max-w-[480px] bg-white">
        <header className="flex items-center justify-between px-5 pt-6 pb-5">
          <h1 className="font-black tracking-tight" style={{ color: "#111", fontSize: 34, lineHeight: 1 }}>
            Équipe
          </h1>
          <button
            onClick={() => navigate("/members")}
            className="font-normal active:opacity-60"
            style={{ color: "#53565a", fontSize: 19 }}
            data-testid="button-my-team"
          >
            Mon équipe &gt;
          </button>
        </header>

        <div className="px-5">
          <img
            src={teamHero}
            alt="Station de recharge électrique TGOOD"
            className="w-full object-cover"
            style={{ height: 226, borderRadius: 12, objectPosition: "center" }}
          />
        </div>

        <section className="grid grid-cols-[44%_56%] gap-2 px-5 pt-5 pb-2">
          <img
            src={teamInvite}
            alt="Borne de recharge verte"
            className="h-[180px] w-full object-cover"
            style={{ borderRadius: 12, objectPosition: "center" }}
          />
          <div className="min-w-0 pl-0.5">
            <h2 className="mb-1 font-normal" style={{ color: "#151515", fontSize: 18, lineHeight: 1.38 }}>
              Commencez à inviter vos amis
            </h2>
            <p className="mb-2" style={{ color: "#353535", fontSize: 12, lineHeight: 1.25 }}>
              Partagez le code ou le lien d&apos;invitation
            </p>

            <div
              className="mb-1 flex h-6 items-center justify-center truncate px-2"
              style={{ border: `1.5px solid ${TGOOD_LIGHT_GREEN}`, borderRadius: 20, color: TGOOD_GREEN, fontSize: 14 }}
              data-testid="text-referral-code"
            >
              {referralCode}
            </div>
            <button
              onClick={() => copy(referralCode, "Code copié !")}
              className="mb-1 h-8 w-full font-medium text-white active:scale-[0.98]"
              style={{ background: TGOOD_GREEN, borderRadius: 18, fontSize: 14, transition: "transform 120ms ease" }}
              data-testid="button-copy-code"
            >
              Copier
            </button>
            <div
              className="mb-1 flex h-6 items-center truncate px-2"
              style={{ border: `1.5px solid ${TGOOD_LIGHT_GREEN}`, borderRadius: 20, color: TGOOD_GREEN, fontSize: 12 }}
              data-testid="text-referral-link"
            >
              {referralLink}
            </div>
            <button
              onClick={() => copy(referralLink, "Lien copié !")}
              className="h-8 w-full font-medium text-white active:scale-[0.98]"
              style={{ background: TGOOD_GREEN, borderRadius: 18, fontSize: 14, transition: "transform 120ms ease" }}
              data-testid="button-copy-link"
            >
              Copier
            </button>
          </div>
        </section>

        <section
          className="mt-2 grid grid-cols-2 py-5 text-center text-black"
          style={{ background: "linear-gradient(100deg, #06a746 0%, #078438 100%)" }}
        >
          <button onClick={() => navigate("/members")} className="flex flex-col items-center active:opacity-70" data-testid="button-total-users">
            <strong className="font-normal" style={{ fontSize: 28, lineHeight: 1.15 }}>{totalUsers}</strong>
            <span className="mt-2" style={{ fontSize: 16 }}>Utilisateurs totaux &gt;</span>
          </button>
          <button onClick={() => navigate("/team-details")} className="flex flex-col items-center active:opacity-70" data-testid="button-total-rewards">
            <strong className="font-normal" style={{ fontSize: 28, lineHeight: 1.15 }}>{currency} {totalCommission.toLocaleString()}</strong>
            <span className="mt-2" style={{ fontSize: 16 }}>Récompenses totales &gt;</span>
          </button>
        </section>

        <h2
          className="px-5 py-4 text-center font-normal uppercase"
          style={{ color: TGOOD_LIGHT_GREEN, fontSize: 23, lineHeight: 1.55 }}
        >
          Invitez vos amis à rejoindre l&apos;équipe
        </h2>

        <section className="pb-1">
          {[0, 1, 2].map((level) => (
            <div
              key={level}
              className="grid min-h-[87px] grid-cols-[85px_repeat(3,minmax(0,1fr))] items-center border-b border-[#eeeeee]"
            >
              <div
                className="flex min-h-[68px] items-center justify-center font-normal text-white"
                style={{ background: "#09bb42", fontSize: 25 }}
              >
                LV{level + 1}
              </div>
              <div className="text-center">
                <p className="font-normal" style={{ color: "#111", fontSize: 25, lineHeight: 1.1 }}>{levelRates[level]}%</p>
                <p className="mt-1" style={{ color: "#222", fontSize: 16 }}>Commission</p>
              </div>
              <div className="text-center">
                <p className="font-normal" style={{ color: "#111", fontSize: 25, lineHeight: 1.1 }}>{levelCounts[level]}</p>
                <p className="mt-1" style={{ color: "#222", fontSize: 16 }}>Utilisateurs</p>
              </div>
              <div className="min-w-0 text-center">
                <p className="font-normal" style={{ color: "#111", fontSize: 25, lineHeight: 1.1 }}>{levelRewards[level].toLocaleString()}</p>
                <p className="mt-1 truncate" style={{ color: "#222", fontSize: 16 }}>Récompenses</p>
              </div>
            </div>
          ))}
        </section>

        <section className="px-[10px] pt-5 pb-10" style={{ color: "#5b6068", fontSize: 15, lineHeight: 1.55 }}>
          <p>Lorsqu&apos;un ami que vous parrainez s&apos;inscrit et investit, vous recevez immédiatement une commission de {levelRates[0]} % sur son investissement.</p>
          <p className="mt-1">Lorsque les membres de votre équipe de deuxième niveau investissent, vous recevez une commission de {levelRates[1]} %.</p>
          <p className="mt-1">Lorsque les membres de votre équipe de troisième niveau investissent, vous recevez une commission de {levelRates[2]} %.</p>
          <p className="mt-1">Une fois que les membres de votre équipe ont investi, la commission est immédiatement créditée sur votre compte et vous pouvez la retirer instantanément.</p>
        </section>
      </section>
    </main>
  );
}