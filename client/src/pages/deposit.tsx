import { ChangeEvent, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, Camera, Check, ChevronRight, Copy, CreditCard, History, ImageUp } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import depositHero from "@assets/generated_images/tgood-deposit-hero.jpg";
import tetherIcon from "@/assets/crypto/tether.png";
import usdCoinIcon from "@/assets/crypto/usd-coin.png";
import bnbIcon from "@/assets/crypto/bnb.png";
import ethereumIcon from "@/assets/crypto/ethereum.png";
import polygonIcon from "@/assets/crypto/polygon.png";
import paypalUsdIcon from "@/assets/crypto/paypal-usd.png";
import tronIcon from "@/assets/crypto/tron.png";

const CURRENCY = "USDT";
const TGOOD_GREEN = "#32c95b";
const DEPOSIT_AMOUNTS = [3000, 10000, 20000, 45000, 100000, 200000, 400000, 800000];

type DepositView = "main" | "currency" | "crypto-payment" | "issue";

type CryptoCurrency = {
  code: string;
  label: string;
  icon: string;
  networkIcon?: string;
};

type CryptoPayment = {
  depositId: number;
  paymentId: string;
  payAddress: string;
  payAmount: string | number;
  payCurrency: string;
  payinExtraId?: string;
  network?: string;
  qrCode: string;
};

const CRYPTO_CURRENCIES: CryptoCurrency[] = [
  { code: "usdtbsc", label: "BEP20-USDT", icon: tetherIcon, networkIcon: bnbIcon },
  { code: "usdtmatic", label: "POLYGON-USDT", icon: tetherIcon, networkIcon: polygonIcon },
  { code: "matic", label: "POLYGON", icon: polygonIcon },
  { code: "usdc", label: "POLYGON-USDC", icon: usdCoinIcon, networkIcon: polygonIcon },
  { code: "usdcbsc", label: "BEP20-USDC", icon: usdCoinIcon, networkIcon: bnbIcon },
  { code: "bnbbsc", label: "BNB", icon: bnbIcon },
  { code: "usdterc20", label: "ETH-USDT", icon: tetherIcon, networkIcon: ethereumIcon },
  { code: "usdcerc20", label: "ETH-USDC", icon: usdCoinIcon, networkIcon: ethereumIcon },
  { code: "pyusd", label: "ETH-PYUSD", icon: paypalUsdIcon, networkIcon: ethereumIcon },
  { code: "eth", label: "ETH", icon: ethereumIcon },
  { code: "usdttrc20", label: "TRC20-USDT", icon: tetherIcon, networkIcon: tronIcon },
  { code: "trx", label: "TRX", icon: tronIcon },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2" style={{ color: "#151515", fontSize: 14 }}>
      <span className="h-6 w-[5px] rounded-full" style={{ background: TGOOD_GREEN }} />
      <span>{children}</span>
    </div>
  );
}

function LabelledInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "number";
}) {
  return (
    <label className="mb-6 block">
      <span className="mb-3 block font-semibold" style={{ color: "#2b2b2b", fontSize: 18 }}>
        <span style={{ color: "#ea4f55" }}>* </span>{label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full border-0 border-b bg-transparent px-0 pb-2 outline-none placeholder:text-[#777]"
        style={{ borderColor: "#e8e8e8", color: "#222", fontSize: 17 }}
      />
    </label>
  );
}

export default function DepositPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const proofInput = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<DepositView>("main");
  const [amount, setAmount] = useState(10000);
  const [walletNumber, setWalletNumber] = useState(user?.phone || "");
  const [issueAmount, setIssueAmount] = useState("");
  const [proof, setProof] = useState<string | null>(null);
  const [proofName, setProofName] = useState("");
  const [cryptoPayment, setCryptoPayment] = useState<CryptoPayment | null>(null);
  const [selectedCryptoCurrency, setSelectedCryptoCurrency] = useState<CryptoCurrency | null>(null);
  const [pendingCurrencyCode, setPendingCurrencyCode] = useState<string | null>(null);

  const { data: settings = {} } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings"],
  });
  const minDeposit = Number.parseInt(settings.minDeposit || "18", 10) || 18;

  const createDeposit = useMutation({
    mutationFn: async (payload: { amount: number; accountNumber: string; screenshot?: string }) => {
      const response = await apiRequest("POST", "/api/deposits", {
        amount: payload.amount,
        accountName: user?.fullName || user?.phone || "Client TGOOD",
        accountNumber: payload.accountNumber,
        paymentMethod: "Banque de dépôt",
        channelName: "Banque de dépôt",
        country: user?.country || "CD",
        screenshot: payload.screenshot || null,
        reference: payload.accountNumber,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Le dépôt n'a pas pu être envoyé.");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deposits/history"] });
      toast({
        title: "Dépôt enregistré",
        description: "Votre demande de recharge est en cours de vérification.",
      });
      setView("main");
      setProof(null);
      setProofName("");
      setIssueAmount("");
    },
    onError: (error: Error) => {
      toast({ title: "Impossible d'envoyer le dépôt", description: error.message, variant: "destructive" });
    },
  });

  const createCryptoDeposit = useMutation({
    mutationFn: async (currency: CryptoCurrency) => {
      const response = await apiRequest("POST", "/api/crypto-deposits", {
        amount,
        payCurrency: currency.code,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Le paiement crypto n'a pas pu être créé.");
      }
      return response.json() as Promise<CryptoPayment>;
    },
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: ["/api/deposits/history"] });
      setCryptoPayment(payment);
      setView("crypto-payment");
    },
    onError: (error: Error) => {
      toast({ title: "Paiement indisponible", description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      setPendingCurrencyCode(null);
    },
  });

  const chooseProof = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Image requise", description: "Veuillez sélectionner une image de preuve.", variant: "destructive" });
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast({ title: "Image trop volumineuse", description: "Le justificatif ne doit pas dépasser 3 Mo.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProof(String(reader.result));
      setProofName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const submitMainDeposit = () => {
    if (!amount || amount < minDeposit) {
      toast({
        title: "Montant invalide",
        description: `Le dépôt minimum est de ${minDeposit.toLocaleString("fr-FR")} ${CURRENCY}.`,
        variant: "destructive",
      });
      return;
    }
    setView("currency");
  };

  const copyPaymentAddress = async () => {
    if (!cryptoPayment?.payAddress) return;
    try {
      await navigator.clipboard.writeText(cryptoPayment.payAddress);
      toast({ title: "Adresse copiée" });
    } catch {
      toast({ title: "Impossible de copier l'adresse", variant: "destructive" });
    }
  };

  const submitIssue = () => {
    const parsedAmount = Number(issueAmount.replace(/[^\d]/g, ""));
    if (!walletNumber.trim() || !parsedAmount || !proof) {
      toast({
        title: "Informations manquantes",
        description: "Ajoutez votre numéro de portefeuille, le montant et le justificatif.",
        variant: "destructive",
      });
      return;
    }
    if (parsedAmount < minDeposit) {
      toast({
        title: "Montant invalide",
        description: `Le dépôt minimum est de ${minDeposit.toLocaleString("fr-FR")} ${CURRENCY}.`,
        variant: "destructive",
      });
      return;
    }
    createDeposit.mutate({ amount: parsedAmount, accountNumber: walletNumber, screenshot: proof });
  };

  if (!user) return null;

  if (view === "crypto-payment" && cryptoPayment) {
    const selectedCurrencyLabel = selectedCryptoCurrency?.label || cryptoPayment.payCurrency.toUpperCase();
    return (
      <main className="min-h-screen bg-[#f4f7f5] pb-10" style={{ color: "#1b2b20" }}>
        <header className="flex h-[76px] items-center gap-3 bg-[#087a38] px-5 text-white shadow-[0_2px_8px_rgba(0,75,35,.2)]">
          <button
            type="button"
            onClick={() => setView("currency")}
            className="flex h-10 w-9 items-center justify-center rounded-full active:bg-white/10"
            aria-label="Retour à la sélection des devises"
            data-testid="button-crypto-payment-back"
          >
            <ArrowLeft size={27} strokeWidth={2} />
          </button>
          <h1 className="flex-1 text-center text-[20px] font-medium pr-9">Paiement crypto</h1>
        </header>

        <section className="mx-5 mt-6 rounded-[18px] bg-white px-5 py-6 shadow-[0_8px_22px_rgba(0,70,30,.08)]">
          <p className="text-center text-[14px] text-[#66746b]">Envoyez exactement</p>
          <p className="mt-1 text-center text-[28px] font-bold text-[#087a38]">
            {Number(cryptoPayment.payAmount).toLocaleString(undefined, { maximumFractionDigits: 8 })} {cryptoPayment.payCurrency.toUpperCase()}
          </p>
          <p className="mt-1 text-center text-[13px] text-[#66746b]">sur le réseau {selectedCurrencyLabel}</p>

          <img src={cryptoPayment.qrCode} alt="QR code de paiement" className="mx-auto mt-5 h-[190px] w-[190px] rounded-[10px]" />

          <div className="mt-5 rounded-[10px] border border-[#d7e9dc] bg-[#f8fcf9] p-3">
            <p className="mb-1 text-[12px] font-medium text-[#53705d]">Adresse de paiement {selectedCurrencyLabel}</p>
            <p className="break-all font-mono text-[13px] leading-5 text-[#173f26]">{cryptoPayment.payAddress}</p>
          </div>
          {(cryptoPayment.payinExtraId || cryptoPayment.network) && (
            <div className="mt-3 grid gap-2 rounded-[10px] border border-[#d7e9dc] bg-[#f8fcf9] p-3 text-[13px]">
              {cryptoPayment.network && (
                <p className="text-[#53705d]">
                  Réseau : <span className="font-semibold uppercase text-[#173f26]">{cryptoPayment.network}</span>
                </p>
              )}
              {cryptoPayment.payinExtraId && (
                <p className="text-[#53705d]">
                  Mémo / tag : <span className="break-all font-mono font-semibold text-[#173f26]">{cryptoPayment.payinExtraId}</span>
                </p>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={copyPaymentAddress}
            className="mx-auto mt-4 flex h-[42px] items-center justify-center gap-2 rounded-full px-7 text-[15px] font-semibold text-white active:scale-[.98]"
            style={{ background: TGOOD_GREEN }}
            data-testid="button-copy-crypto-address"
          >
            <Copy size={17} /> Copier l&apos;adresse
          </button>
        </section>

        <div className="mx-5 mt-4 flex gap-3 rounded-[12px] border border-[#f3ce77] bg-[#fff8e5] px-4 py-3 text-[#73510b]">
          <AlertTriangle size={21} className="mt-0.5 shrink-0" />
          <p className="text-[13px] leading-5">
            Envoyez uniquement <strong>{selectedCurrencyLabel}</strong> sur le réseau correspondant. Un envoi depuis un autre réseau peut être perdu.
          </p>
        </div>

        <p className="mx-6 mt-5 text-center text-[13px] leading-5 text-[#66746b]">
          Le dépôt sera crédité automatiquement après la confirmation du réseau.
        </p>
      </main>
    );
  }

  if (view === "currency") {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#087a38_0%,#00c853_38%,#eaf7ee_100%)] pb-9">
        <header className="flex h-[86px] items-center gap-3 px-5 text-white">
          <button
            type="button"
            onClick={() => setView("main")}
            className="flex h-10 w-9 items-center justify-center rounded-full active:bg-white/10"
            aria-label="Retour au montant du dépôt"
            data-testid="button-currency-back"
          >
            <ArrowLeft size={28} strokeWidth={2} />
          </button>
          <h1 className="flex-1 text-center text-[21px] font-medium pr-9">Sélectionnez la devise</h1>
        </header>

        <section className="mx-5 overflow-hidden rounded-[19px] border border-white/60 bg-white/90 shadow-[0_12px_28px_rgba(0,84,38,.22)] backdrop-blur-sm">
          {createCryptoDeposit.isPending && selectedCryptoCurrency && (
            <p role="status" className="border-b border-[#d6e7da] bg-[#eef9f1] px-4 py-3 text-center text-[13px] font-medium text-[#087a38]">
              Préparation du paiement {selectedCryptoCurrency.label}…
            </p>
          )}
          {CRYPTO_CURRENCIES.map((currency, index) => (
            <button
              key={currency.code}
              type="button"
              onClick={() => {
                setSelectedCryptoCurrency(currency);
                setPendingCurrencyCode(currency.code);
                createCryptoDeposit.mutate(currency);
              }}
              disabled={createCryptoDeposit.isPending}
              className="flex min-h-[73px] w-full items-center px-4 text-left transition active:bg-[#eaf8ee] disabled:opacity-60"
              style={{ borderBottom: index < CRYPTO_CURRENCIES.length - 1 ? "1px dashed #b8cfc0" : undefined }}
              data-testid={`button-currency-${currency.code}`}
            >
              <span className="relative mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,.1)]">
                <img src={currency.icon} alt="" className="h-8 w-8 object-contain" aria-hidden="true" />
                {currency.networkIcon && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-white">
                    <img src={currency.networkIcon} alt="" className="h-[12px] w-[12px] object-contain" aria-hidden="true" />
                  </span>
                )}
              </span>
              <span className="flex-1 text-[17px] font-medium text-[#183c25]">{currency.label}</span>
              {pendingCurrencyCode === currency.code ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#087a38] border-t-transparent" aria-hidden="true" />
              ) : (
                <ChevronRight size={28} strokeWidth={1.5} color="#699379" aria-hidden="true" />
              )}
            </button>
          ))}
        </section>
      </main>
    );
  }

  if (view === "issue") {
    return (
      <main className="min-h-screen bg-[#f5f5f5] pb-10" style={{ color: "#252525" }}>
        <header className="flex h-[116px] items-center gap-3 bg-white px-5">
          <button
            onClick={() => setView("main")}
            className="flex h-10 w-8 items-center justify-center active:scale-95"
            aria-label="Retour au dépôt"
            data-testid="button-issue-back"
          >
            <ArrowLeft size={31} strokeWidth={1.7} />
          </button>
          <h1 className="font-normal" style={{ color: "#0bad32", fontSize: 20 }}>Problème de rechargement</h1>
        </header>

        <section className="mx-5 mt-6 rounded-[10px] bg-white px-5 pb-10 pt-6 shadow-[0_1px_4px_rgba(0,0,0,.03)]">
          <LabelledInput
            label="Numéro de portefeuille"
            value={walletNumber}
            onChange={setWalletNumber}
            placeholder="Veuillez saisir votre numéro de portefeuille"
          />
          <LabelledInput
            label="Montant du rechargement"
            value={issueAmount}
            onChange={setIssueAmount}
            placeholder="Veuillez saisir le montant du rechargement"
            type="number"
          />
          <div>
            <p className="mb-4 font-semibold" style={{ color: "#2b2b2b", fontSize: 18 }}>
              <span style={{ color: "#ea4f55" }}>* </span>Justificatif de rechargement
            </p>
            <input ref={proofInput} className="hidden" type="file" accept="image/*" onChange={chooseProof} />
            <button
              type="button"
              onClick={() => proofInput.current?.click()}
              className="flex h-[123px] w-full flex-col items-center justify-center rounded-[10px] border-2 border-dashed active:opacity-75"
              style={{ borderColor: "#d6d6d6", color: proof ? TGOOD_GREEN : "#a1a5ae" }}
              data-testid="button-upload-deposit-proof"
            >
              {proof ? (
                <>
                  <img src={proof} alt="Justificatif sélectionné" className="mb-2 h-[74px] max-w-[180px] rounded object-cover" />
                  <span className="max-w-[85%] truncate text-sm">{proofName}</span>
                </>
              ) : (
                <span className="flex items-center gap-2" style={{ fontSize: 17 }}>
                  <Camera size={27} fill="#a1a5ae" strokeWidth={1.6} /> Cliquez pour téléverser
                </span>
              )}
            </button>
          </div>
        </section>

        <button
          onClick={submitIssue}
          disabled={createDeposit.isPending}
          className="mx-auto mt-5 flex h-[44px] w-[66%] items-center justify-center rounded-[8px] font-semibold text-white shadow-sm transition active:scale-[.98] disabled:opacity-70"
          style={{ background: "#00b80f", fontSize: 16 }}
          data-testid="button-submit-deposit-issue"
        >
          {createDeposit.isPending ? "Envoi en cours…" : "Soumettre"}
        </button>

        <section className="mx-5 mt-7">
          <h2 className="mb-1 font-bold" style={{ fontSize: 19, lineHeight: 1.55 }}>
            Veuillez soumettre une preuve de dépôt similaire :
          </h2>
          <div className="h-[3px] w-full bg-[#d5d5d5]" />
          <div className="bg-[#f8f9fa] px-4 pb-5 pt-4">
            <img
              src="/binance-transaction-example.svg"
              alt="Example of a completed Binance USDT transaction"
              className="mx-auto block w-full max-w-[290px] rounded-[18px] shadow-[0_4px_14px_rgba(0,0,0,.14)]"
            />
          </div>
          <div className="mt-8 rounded-[10px] bg-white px-5 py-5 text-[14px] leading-6 text-[#686868]">
            <p>Si vous avez un ordre de rechargement non reçu, veuillez soumettre les informations du rechargement.</p>
            <p className="mt-2">1. Votre numéro de portefeuille</p>
            <p>2. Justificatif de rechargement</p>
            <p>3. Le délai de traitement du dernier ordre de rechargement dépasse 20 minutes</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f4f4] pb-9" style={{ color: "#171717" }}>
      <section className="relative h-[282px] overflow-hidden bg-[#dceef7]">
        <img src={depositHero} alt="Borne de recharge électrique TGOOD" className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/30 to-transparent" />
        <div className="absolute inset-x-0 top-5 flex items-center justify-between px-5">
          <Link href="/">
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/35 backdrop-blur-[1px] active:scale-95"
              aria-label="Retour à l'accueil"
              data-testid="button-deposit-back"
            >
              <ArrowLeft size={30} strokeWidth={1.6} />
            </button>
          </Link>
          <h1 className="absolute left-1/2 -translate-x-1/2 font-normal" style={{ fontSize: 18 }}>RECHARGEMENT</h1>
          <Link href="/deposit-history">
            <button
              className="flex h-11 w-11 items-center justify-center active:scale-95"
              aria-label="Historique des dépôts"
              data-testid="button-deposit-history"
            >
              <History size={31} strokeWidth={1.45} />
            </button>
          </Link>
        </div>
      </section>

      <section className="mx-1.5 -mt-0 rounded-[5px] bg-white px-[14px] pb-[14px] pt-[15px]">
        <SectionTitle>Montant du rechargement</SectionTitle>
        <div className="flex h-[52px] items-center border px-5" style={{ borderColor: "#72cf91", background: "#fafafa", fontSize: 20 }}>
          <span className="mr-3 text-[#555]">{CURRENCY}</span>
          <input
            type="number"
            value={amount}
            min={minDeposit}
            onChange={(event) => setAmount(Number(event.target.value) || 0)}
            className="min-w-0 flex-1 bg-transparent font-medium outline-none"
            aria-label="Montant du rechargement"
            data-testid="input-deposit-amount"
          />
        </div>
        <div className="mt-5 grid grid-cols-4 gap-x-[10px] gap-y-[10px]">
          {DEPOSIT_AMOUNTS.map((preset) => {
            const selected = amount === preset;
            return (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className="h-[55px] rounded-[7px] border font-normal transition active:scale-[.97]"
                style={{
                  borderColor: TGOOD_GREEN,
                  color: selected ? "#fff" : "#656565",
                  background: selected ? TGOOD_GREEN : "#fff",
                  fontSize: "clamp(13px, 4.1vw, 19px)",
                  boxShadow: selected ? "0 3px 8px rgba(50,201,91,.25)" : "none",
                }}
                data-testid={`button-preset-amount-${preset}`}
              >
                {preset.toLocaleString("fr-FR")}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-1.5 mt-[18px] min-h-[233px] rounded-[5px] bg-white px-[14px] pt-[14px]">
        <SectionTitle>Méthode de rechargement</SectionTitle>
        <button
          className="flex h-[56px] w-full items-center rounded-[10px] px-5 text-left text-white shadow-[0_3px_7px_rgba(44,185,86,.2)] transition active:scale-[.985]"
          style={{ background: TGOOD_GREEN }}
          data-testid="button-deposit-method"
        >
          <span className="mr-4 flex h-7 w-7 items-center justify-center rounded bg-white/20">
            <CreditCard size={25} fill="white" strokeWidth={1.6} />
          </span>
          <span className="flex-1" style={{ fontSize: 20 }}>Banque de dépôt</span>
          <Check size={24} strokeWidth={2.7} />
        </button>
      </section>

      <button
        onClick={submitMainDeposit}
        disabled={createDeposit.isPending}
        className="mx-auto mt-5 flex h-[48px] w-[51%] items-center justify-center rounded-full font-normal text-white shadow-[0_3px_8px_rgba(0,180,15,.18)] transition active:scale-[.98] disabled:opacity-70"
        style={{ background: "#00b80f", fontSize: 19 }}
        data-testid="button-confirm-deposit"
      >
          {createDeposit.isPending ? "Envoi en cours…" : "Paiement"}
      </button>
      <button
        onClick={() => setView("issue")}
        className="mx-auto mt-3 block text-center active:opacity-70"
        style={{ color: "#0c9b2e", fontSize: 17 }}
        data-testid="button-deposit-issue"
      >
        Paiement en retard ? Cliquez ici
      </button>

      <section className="mx-[14px] mt-9 text-[15px] leading-[1.55] text-[#555]">
        <p>1. Le dépôt minimum est de {minDeposit.toLocaleString("fr-FR")} {CURRENCY}. Les dépôts inférieurs à ce montant ne seront pas crédités.</p>
        <p>2. Le compte de portefeuille que vous saisissez sur la page de dépôt doit être le même que celui utilisé pour le paiement.</p>
        <p>3. Veuillez toujours utiliser le numéro de compte le plus récent pour effectuer vos paiements et éviter d&apos;utiliser des informations de compte expirées.</p>
        <p>4. Veuillez lire attentivement les instructions de la plateforme de paiement et les suivre scrupuleusement.</p>
        <p>5. Si votre dépôt n&apos;est pas crédité immédiatement après le transfert, veuillez télécharger vos informations de paiement sur la page de dépôt ou contacter le service client.</p>
      </section>
    </main>
  );
}