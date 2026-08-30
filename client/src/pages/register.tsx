import { useEffect, useRef, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Code2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { FALLBACK_COUNTRIES, type ApiCountry } from "@/lib/countries";
import { CountrySelector } from "@/components/country-selector";
import { DEFAULT_COUNTRY_CODE, WORLD_COUNTRIES } from "@/lib/world-countries";
import { useI18n } from "@/lib/i18n";
import { LockBoldIcon, PhoneBoldIcon } from "@/components/auth-icons";
import { setAppLoading } from "@/components/navigation-loader";
import tgoodChargingStation from "@assets/generated_images/tgood-charging-station-hero.jpg";
import tgoodChargingPile from "@assets/image_search/tgood-real-charging-pile-transparent.png";

const TGOOD_GREEN = "#00c853";

function TgoodHero() {
  return (
    <div className="relative h-[42vh] min-h-[285px] max-h-[420px] overflow-hidden">
      <img src={tgoodChargingStation} alt="Conducteur rechargeant une voiture électrique dans une station TGOOD" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#003a1e]/12 via-[#003a1e]/8 to-[#001f10]/42" />
      <span className="absolute left-1/2 top-1 -translate-x-1/2 font-black tracking-[-3px] text-white drop-shadow-md" style={{ fontSize: "clamp(48px, 15vw, 70px)" }}>
        TGOOD
      </span>
      <img src={tgoodChargingPile} alt="Borne de recharge TGOOD" className="absolute bottom-[-7%] right-[8%] h-[83%] w-[45%] object-contain drop-shadow-[0_12px_12px_rgba(0,0,0,.28)]" />
    </div>
  );
}

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const { register } = useAuth();
  const { toast } = useToast();
  const { t, lang } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const countryTriggerRef = useRef<HTMLButtonElement>(null);
  const refCode = new URLSearchParams(searchString).get("invite_code") || new URLSearchParams(searchString).get("money") || new URLSearchParams(searchString).get("reg") || "";
  const registerSchema = z.object({
    phone: z.string().min(8, t.errInvalidPhone),
    country: z.string().min(2, t.selectCountry),
    password: z.string().min(6, t.errMinPassword),
    confirmPassword: z.string().min(1, t.errConfirmPassword),
    invitationCode: z.string().optional(),
  }).refine((data) => data.password === data.confirmPassword, { message: t.errPasswordMismatch, path: ["confirmPassword"] });
  type RegisterForm = z.infer<typeof registerSchema>;
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { phone: "", country: DEFAULT_COUNTRY_CODE, password: "", confirmPassword: "", invitationCode: refCode },
  });
  const { data: apiCountries } = useQuery<ApiCountry[]>({ queryKey: ["/api/countries"] });
  const selectedCountry = form.watch("country");

  useEffect(() => {
    if (!apiCountries?.length) return;
  }, [apiCountries]);

  const countryData = apiCountries?.find(country => country.code === selectedCountry && country.isActive)
    ?? WORLD_COUNTRIES.find(country => country.code === selectedCountry)
    ?? FALLBACK_COUNTRIES.find(country => country.code === selectedCountry);
  const countryLocale = lang === "zh" ? "zh-CN" : lang === "ar" ? "ar" : lang === "en" ? "en-US" : "fr-FR";
  const countryName = countryData?.code && typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames([countryLocale], { type: "region" }).of(countryData.code)
    : countryData?.name;

  async function onSubmit(data: RegisterForm) {
    setIsLoading(true);
    setAppLoading(true);
    try {
      await register({ fullName: `User_${data.phone}`, phone: data.phone, country: data.country, password: data.password, invitationCode: data.invitationCode });
      toast({ title: t.successRegister, description: t.welcomeMsg });
      navigate("/");
    } catch (error: any) {
      toast({ title: error.message || t.errRegisterFailed, variant: "destructive" });
    } finally {
      setIsLoading(false);
      setAppLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#00c853]">
      <TgoodHero />
      <section className="relative -mt-2 min-h-[55vh] rounded-t-[28px] bg-[#00c853] px-[30px] pb-12 pt-[18px]">
        <h1 className="mb-[20px] text-center text-[43px] font-normal leading-none text-white">{t.registerBtn}</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto flex w-full max-w-[430px] flex-col gap-[20px]">
          <input type="hidden" {...form.register("country")} />
          <div className="auth-reference-field">
            <PhoneBoldIcon size={34} color={TGOOD_GREEN} badge={false} />
            <button ref={countryTriggerRef} type="button" onClick={() => setCountryModalOpen(true)} className="flex shrink-0 items-center gap-1 pr-3 text-[25px] font-normal text-[#5b5b5b]" aria-label={`${t.selectCountry}: ${countryName || countryData?.name || "DR Congo"}, +${countryData?.phonePrefix || "243"}`} aria-haspopup="dialog" aria-expanded={countryModalOpen} data-testid="button-select-country">
              +{countryData?.phonePrefix || "243"} <ChevronDown size={18} className="text-[#9c9c9c]" />
            </button>
            <input {...form.register("phone")} type="tel" aria-label={t.yourNumber} placeholder={t.phonePlaceholder} className="min-w-0 flex-1 bg-transparent text-[16px] text-[#00ad49] outline-none placeholder:text-[#00ad49]" data-testid="input-phone" />
          </div>
          {form.formState.errors.phone && <p className="-mt-3 text-xs text-red-100">{form.formState.errors.phone.message}</p>}

          <div className="auth-reference-field">
            <LockBoldIcon size={34} color={TGOOD_GREEN} badge={false} />
            <input {...form.register("password")} type={showPassword ? "text" : "password"} aria-label={t.yourPassword} placeholder={t.passwordPlaceholder} className="min-w-0 flex-1 bg-transparent text-[16px] text-[#00ad49] outline-none placeholder:text-[#00ad49]" data-testid="input-password" />
            <button type="button" onClick={() => setShowPassword(value => !value)} className="p-1 text-[#00c853]" aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} aria-pressed={showPassword}>{showPassword ? <EyeOff size={22} /> : <Eye size={22} />}</button>
          </div>
          {form.formState.errors.password && <p className="-mt-3 text-xs text-red-100">{form.formState.errors.password.message}</p>}

          <div className="auth-reference-field">
            <LockBoldIcon size={34} color={TGOOD_GREEN} badge={false} />
            <input {...form.register("confirmPassword")} type={showConfirm ? "text" : "password"} aria-label={t.repeatPassword} placeholder={t.confirmPasswordPlaceholder} className="min-w-0 flex-1 bg-transparent text-[16px] text-[#00ad49] outline-none placeholder:text-[#00ad49]" data-testid="input-confirm-password" />
            <button type="button" onClick={() => setShowConfirm(value => !value)} className="p-1 text-[#00c853]" aria-label={showConfirm ? "Masquer la confirmation du mot de passe" : "Afficher la confirmation du mot de passe"} aria-pressed={showConfirm}>{showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}</button>
          </div>
          {form.formState.errors.confirmPassword && <p className="-mt-3 text-xs text-red-100">{form.formState.errors.confirmPassword.message}</p>}

          <div className="auth-reference-field">
            <Code2 size={35} strokeWidth={2.5} className="shrink-0 text-[#00c853]" />
            <input {...form.register("invitationCode")} aria-label={t.referralCode} placeholder={t.invitationCodePlaceholder} className="min-w-0 flex-1 bg-transparent text-[20px] text-[#3f3f3f] outline-none placeholder:text-[#3f3f3f]" data-testid="input-invitation-code" />
          </div>
          <button type="button" onClick={() => navigate("/login")} className="self-end -mt-1 text-[18px] text-white underline underline-offset-2" data-testid="link-login">
            {t.alreadyHaveAccountLogin} &gt;
          </button>
          <button type="submit" disabled={isLoading} className="mt-1 h-[62px] w-full rounded-[10px] bg-white text-[27px] font-bold text-[#00c853] shadow-[0_3px_8px_rgba(0,0,0,.08)] transition active:scale-[.98] disabled:opacity-60" data-testid="button-register">
            {isLoading ? t.registerLoading : t.registerBtn}
          </button>
        </form>
      </section>
      <CountrySelector open={countryModalOpen} onClose={() => setCountryModalOpen(false)} onSelect={(code) => form.setValue("country", code, { shouldValidate: true })} selectedCode={selectedCountry} apiCountries={apiCountries} triggerRef={countryTriggerRef} />
    </main>
  );
}