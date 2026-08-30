import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import popupMascot from "@assets/generated_images/tgood-popup-mascot.png";

const TGOOD_GREEN = "#08b83a";

const DEFAULT_LINES = [
  "🚀 TGOOD RDC : lancement officiel !",
  "📅 Une toute nouvelle expérience commence le 20 août 2026 !",
  "✅ Investissez 3 000 USDT et demandez un retrait de 1 500 USDT",
  "✅ Bonus d'inscription : 2 USDT",
  "✅ Connexion quotidienne : 50 USDT",
  "👥 Invitez vos amis à participer et gagnez une commission de 39 %",
  "🔥 Taux de rendement quotidien : 25 % à 40 %",
  "🔥 Vos gains sont automatiquement crédités sur votre compte chaque jour 📈 Achetez plusieurs appareils pour multiplier vos gains",
];

export default function HomeAnnouncementModal() {
  const [open, setOpen] = useState(true);
  const { data: settings = {} } = useQuery<Record<string, string>>({ queryKey: ["/api/settings"] });

  const lines = Array.from({ length: 7 }, (_, index) => settings[`popupLine${index + 1}`] || DEFAULT_LINES[index]).filter(Boolean);
  lines.push(DEFAULT_LINES[7]);
  const configuredSupportUrl = settings.supportLink || "";
  const telegramUrl = /^(https?:\/\/)?(t\.me|telegram\.me|telegram\.dog)\//i.test(configuredSupportUrl)
    ? configuredSupportUrl
    : "https://t.me/vestasgroup";
  const telegramLabel = settings.popupTelegramLabel || "Telegram >";
  const confirmLabel = settings.popupConfirmLabel || "OK";
  const announcementTitle = settings.popupTitle || "Annonce TGOOD";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="mt-10 w-[calc(100%-3rem)] max-w-[410px] overflow-visible border-0 bg-[#eaffe7] p-0 shadow-2xl [&>button]:hidden"
        style={{ borderRadius: 10, maxHeight: "calc(100vh - 110px)" }}
      >
        <img
          src={popupMascot}
          alt=""
          className="pointer-events-none absolute left-1/2 z-10 h-[102px] w-[150px] -translate-x-1/2 object-contain"
          style={{ top: -57 }}
        />
        <DialogTitle className="sr-only">{announcementTitle}</DialogTitle>
        <div
          className="overflow-y-auto px-4 pb-5 pt-12"
          style={{ color: "#101010", fontSize: 16, lineHeight: 1.9 }}
        >
          {lines.map((line, index) => (
            <p key={`${line}-${index}`} className="whitespace-pre-wrap">{line}</p>
          ))}
        </div>
        <div className="flex h-[78px] shrink-0 border-t border-[#d9ead6] bg-white" style={{ borderRadius: "0 0 10px 10px" }}>
          <button
            onClick={() => window.open(telegramUrl, "_blank", "noopener,noreferrer")}
            className="flex min-w-0 flex-1 items-center justify-center gap-1 border-r border-[#e3e3e3] px-2 active:opacity-70"
            style={{ color: "#111", fontSize: "clamp(17px, 5.4vw, 25px)" }}
            data-testid="button-popup-telegram"
          >
            <span className="flex shrink-0 items-center justify-center rounded-full bg-[#2aabee]" style={{ width: "clamp(32px, 8.7vw, 40px)", height: "clamp(32px, 8.7vw, 40px)" }}>
              <Send size={20} fill="white" color="white" strokeWidth={1.8} />
            </span>
            <span className="truncate whitespace-nowrap">{telegramLabel}</span>
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex min-w-0 flex-1 items-center justify-center px-2 active:opacity-70"
            style={{ color: TGOOD_GREEN, fontSize: "clamp(24px, 6.3vw, 29px)", fontWeight: 400 }}
            data-testid="button-popup-ok"
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}