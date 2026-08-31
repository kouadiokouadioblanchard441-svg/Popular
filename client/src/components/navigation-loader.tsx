import { useEffect, useState, useRef } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

// Call this from anywhere to show/hide the loader manually
export function setAppLoading(active: boolean) {
  window.dispatchEvent(new CustomEvent("app-loading", { detail: { active } }));
}

export default function NavigationLoader() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const [navLoading, setNavLoading] = useState(false);
  const [appLoading, setAppLoadingState] = useState(false);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Page navigation
    const handleNav = () => {
      setNavLoading(true);
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
      navTimerRef.current = setTimeout(() => setNavLoading(false), 600);
    };
    // Manual trigger (login / register buttons)
    const handleApp = (e: Event) => {
      setAppLoadingState((e as CustomEvent).detail.active);
    };

    window.addEventListener("hashchange", handleNav);
    window.addEventListener("app-loading", handleApp);
    return () => {
      window.removeEventListener("hashchange", handleNav);
      window.removeEventListener("app-loading", handleApp);
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const active = navLoading || appLoading || isFetching > 0 || isMutating > 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
      style={{
        opacity: active ? 1 : 0,
        transition: "opacity 0.2s ease",
        visibility: active ? "visible" : "hidden",
      }}
    >
      <div
        className="flex items-center justify-center rounded-[9px]"
        style={{
          width: 136,
          height: 136,
          background: "#000000",
          boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
        }}
      >
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          aria-label="Chargement"
          style={{ animation: "nav-spin 0.7s linear infinite" }}
        >
          <circle cx="19" cy="19" r="15" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
          <path
            d="M19 4 A15 15 0 0 1 34 19"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <style>{`
        @keyframes nav-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
