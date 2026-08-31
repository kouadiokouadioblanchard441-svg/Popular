import { useLocation } from "wouter";
import { House, Bike, Hash, UserRound, type LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const TGOOD_GREEN = "#08b83a";
const INACTIVE = "#bdbdbd";

const NAV_ITEMS: {
  path: string;
  labelKey: "home" | "products" | "team" | "me";
  testId: string;
  Icon: LucideIcon;
}[] = [
  { path: "/", labelKey: "home", testId: "home", Icon: House },
  { path: "/invest", labelKey: "products", testId: "products", Icon: Bike },
  { path: "/team", labelKey: "team", testId: "team", Icon: Hash },
  { path: "/account", labelKey: "me", testId: "me", Icon: UserRound },
];

export default function BottomNav() {
  const [location, navigate] = useLocation();
  const { t } = useI18n();

  return (
    <nav
      className="bottom-nav fixed bottom-0 left-0 right-0 z-50 bg-white"
      style={{
        borderTop: "1px solid #eeeeee",
        boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.04)",
      }}
      aria-label="Navigation principale"
    >
      <div className="bottom-nav__inner mx-auto flex h-full w-full max-w-[480px] items-stretch justify-around">
        {NAV_ITEMS.map(({ path, labelKey, testId, Icon }) => {
          const isActive = location === path;
          const color = isActive ? TGOOD_GREEN : INACTIVE;

          return (
            <button
              key={path}
              onClick={() => {
                navigate(path);
                if (path === "/") window.dispatchEvent(new Event("home-tab-clicked"));
              }}
              className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 active:scale-95"
              style={{ color, transition: "color 140ms ease, transform 100ms ease" }}
              data-testid={`nav-${testId}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                size={28}
                strokeWidth={isActive ? 2.8 : 2.4}
                aria-hidden="true"
              />
              <span style={{ fontSize: 14, lineHeight: 1.1, fontWeight: isActive ? 500 : 400 }}>
                {t[labelKey]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}