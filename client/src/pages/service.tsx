import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";

/* ── Palette TGOOD ───────────────────────── */
const GREEN = "#078438";

interface LinksSettings {
  supportLink: string;
  support2Link: string;
  channelLink: string;
  groupLink: string;
  supportType: string;
  support2Type: string;
  channelType: string;
  groupType: string;
  supportLabel: string;
  support2Label: string;
  channelLabel: string;
  groupLabel: string;
  supportEnabled: string;
  support2Enabled: string;
  channelEnabled: string;
  groupEnabled: string;
  withdrawalStartHour: string;
  withdrawalEndHour: string;
}

/* Convertit une heure en format AM/PM */
function toAmPm(h: number): string {
  if (h === 0)  return "12:00 AM";
  if (h < 12)   return `${h}:00 AM`;
  if (h === 12) return "12:00 PM";
  return `${h - 12}:00 PM`;
}

export default function ServicePage() {
  const { t } = useI18n();
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());

  useEffect(() => {
    const updateHour = () => setCurrentHour(new Date().getHours());
    const timer = window.setInterval(updateHour, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const { data: settings } = useQuery<LinksSettings>({
    queryKey: ["/api/settings/links"],
  });

  const servicePageTitle = t.serviceTitle;

  const startHour = parseInt(settings?.withdrawalStartHour || "9", 10);
  const endHour   = parseInt(settings?.withdrawalEndHour   || "19", 10);
  const hoursDisplay = `${toAmPm(startHour)}-${toAmPm(endHour)}`;
  const isServiceOnline = startHour < endHour
    ? currentHour >= startHour && currentHour < endHour
    : currentHour >= startHour || currentHour < endHour;

  const allLinks = [
    {
      label:   settings?.supportLabel  || "Service client TGOOD",
      href:    settings?.supportLink   || "https://t.me/vestasgroup",
      testId:  "button-support-link",
      enabled: settings?.supportEnabled  !== "false",
    },
    {
      label:   settings?.support2Label || "Support client TGOOD 2",
      href:    settings?.support2Link  || "https://t.me/vestasgroup",
      testId:  "button-support2-link",
      enabled: settings?.support2Enabled !== "false",
    },
    {
      label:   settings?.groupLabel    || "Groupe officiel TGOOD",
      href:    settings?.groupLink     || "https://t.me/vestasgroup",
      testId:  "button-group-link",
      enabled: settings?.groupEnabled  !== "false",
    },
    {
      label:   settings?.channelLabel  || "Chaîne officielle TGOOD",
      href:    settings?.channelLink   || "https://t.me/vestasgroup",
      testId:  "button-channel-link",
      enabled: settings?.channelEnabled !== "false",
    },
  ];
  const links = allLinks.filter(l => l.enabled);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#f2f2f2" }}>

       {/* ══ HEADER TGOOD ══ */}
      <div
        className="flex items-center px-4 py-3"
        style={{ background: GREEN }}
      >
        <Link href="/account">
          <button
            className="w-9 h-9 flex items-center justify-center active:opacity-70"
            data-testid="button-back"
          >
            <ChevronLeft className="w-6 h-6 text-white" strokeWidth={2.5} />
          </button>
        </Link>
        <h1 className="flex-1 text-center text-white font-semibold text-base mr-9">
          {servicePageTitle}
        </h1>
      </div>

      {/* ══ HERO — logo + personnages ══ */}
      <div
        style={{
          background: "linear-gradient(160deg, #078438 0%, #034c25 100%)",
          paddingBottom: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Logo officiel TGOOD */}
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            padding: "10px 28px",
            marginTop: 16,
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          }}
        >
          <img src="/tgood-logo.gif" alt="TGOOD" style={{ height: 48, objectFit: "contain" }} />
        </div>

        <p className="text-white text-sm font-medium tracking-wide">ENERGY, FAST!</p>
      </div>

      {/* ══ CARTE HORAIRES ══ */}
      <div className="px-3 mt-3">
        <div
          className="rounded-2xl text-center py-5 px-4"
          style={{ background: GREEN }}
        >
          <p
            className="font-black tracking-wide"
            style={{ fontSize: 26, color: "#fff", lineHeight: 1.1 }}
          >
            {hoursDisplay}
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", marginTop: 6 }}>
            {t.serviceHoursLabel}
            <span className="mt-1 block font-semibold" style={{ color: "#fff" }}>
              {isServiceOnline ? t.serviceOnlineNow : t.serviceOfflineNow}
            </span>
          </p>
        </div>
      </div>

      {/* ══ SECTION LIENS ══ */}
      <div className="px-3 mt-4">
        {/* Label "Telegram" */}
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#333",
            marginBottom: 10,
            marginLeft: 2,
          }}
        >
          Telegram
        </p>

        {/* Boutons liens */}
        <div className="space-y-3">
          {links.map((link) => (
            <button
              key={link.testId}
              onClick={() => isServiceOnline && window.open(link.href, "_blank", "noopener,noreferrer")}
              disabled={!isServiceOnline}
              className="w-full flex items-center justify-between active:opacity-80 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: GREEN,
                borderRadius: 999,
                padding: "15px 20px",
                border: "none",
                cursor: "pointer",
              }}
              data-testid={link.testId}
            >
              <span
                style={{
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                @{link.label}
              </span>
              <ChevronRight
                style={{ color: "#fff", width: 20, height: 20, flexShrink: 0 }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ══ CONSEILS ══ */}
      <div className="px-4 mt-6 pb-24">
        <p
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "#111",
            marginBottom: 10,
            letterSpacing: 0.5,
          }}
        >
          CONSEILS :
        </p>
        <div style={{ color: "#444", fontSize: 13, lineHeight: 1.8 }}>
          <p>
            1. Si vous avez des questions concernant notre plateforme, veuillez
            contacter notre service client en ligne.
          </p>
          <p style={{ marginTop: 6 }}>
            2. Si notre service client en ligne ne répond pas à votre message
            dans les délais, veuillez patienter.
          </p>
          <p style={{ marginTop: 6 }}>
            3. Ne communiquez votre mot de passe à personne ; le personnel
            officiel ne vous le demandera jamais.
          </p>
          <p style={{ marginTop: 6 }}>
            4. Méfiez-vous des arnaques et des faux comptes prétendant
            représenter XPENG.
          </p>
        </div>
      </div>

    </div>
  );
}
