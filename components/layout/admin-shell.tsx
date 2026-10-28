"use client";

import { MenuIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

import MarnLogoH from "@/assets/brand/marn-logo-h.png";
import LogoU from "@/assets/brand/logo-u.svg";
import { LocaleSwitcher, NotificationDropdown } from "@/components/navigation";
import { getDirection, type Locale } from "@/i18n/config";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
};

type NavSection = {
  title?: string;
  items: NavItem[];
};

type AdminShellProps = {
  sections: NavSection[];
  children: React.ReactNode;
};

function getSidebarBadge(label: string) {
  const parts = label.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    const first = parts[0]?.charAt(0) ?? "";
    const second = parts[1]?.charAt(0) ?? "";
    return `${first}${second}`.toUpperCase();
  }

  return label.slice(0, 2).toUpperCase();
}

export function AdminShell({ sections, children }: AdminShellProps) {
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);
  const isRtl = getDirection(locale as Locale) === "rtl";

  useEffect(() => {
    const storedState = window.sessionStorage.getItem("portal-new.sidebar-collapsed");
    if (storedState) {
      setIsCollapsed(storedState === "true");
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem("portal-new.sidebar-collapsed", String(isCollapsed));
  }, [isCollapsed]);

  const isSidebarExpanded = !isCollapsed || isHoverExpanded;

  return (
    <div className="min-h-screen bg-brand-950" dir={isRtl ? "rtl" : "ltr"}>
      <div className="min-h-screen overflow-hidden bg-brand-950 shadow-[0_28px_80px_rgba(80,5,22,0.14)]">
        <aside
          className={cn(
            "fixed top-0 z-20 flex h-screen shrink-0 flex-col overflow-hidden bg-brand-950 px-0 py-8 text-white transition-[width] duration-200",
            isRtl ? "right-0" : "left-0",
            isSidebarExpanded ? "w-[280px]" : "w-[92px]",
          )}
          onMouseEnter={() => {
            if (isCollapsed) {
              setIsHoverExpanded(true);
            }
          }}
          onMouseLeave={() => {
            if (isCollapsed) {
              setIsHoverExpanded(false);
            }
          }}
        >
          <div className="pb-6">
            <Image
              src={isSidebarExpanded ? MarnLogoH : LogoU}
              alt="Portal New"
              priority
              className={cn(
                "h-auto transition-all duration-200",
                isSidebarExpanded ? "ml-6 w-[85%]" : "ml-5 w-12",
              )}
            />
          </div>

          <div className="flex-1 overflow-hidden">
            <nav
              className={cn(
                "sidebar-scroll mt-8 flex h-full flex-col gap-6 overflow-y-auto pb-[100px]",
                isSidebarExpanded ? (isRtl ? "pl-4" : "pr-4") : isRtl ? "pl-2" : "pr-2",
              )}
            >
              {sections.map((section, sectionIndex) => (
                <div
                  key={section.title ?? `section-${sectionIndex}`}
                  className="flex flex-col gap-2"
                >
                  {section.title && isSidebarExpanded ? (
                    <p className="px-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
                      {t("nav.management")}
                    </p>
                  ) : null}
                  <div className="flex flex-col gap-2">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href || pathname?.endsWith(item.href);
                      const shortLabel = getSidebarBadge(item.label);
                      const navKey = item.href.replace("/", "") as keyof typeof dashboardLabelMap;
                      const label = t(`nav.${dashboardLabelMap[navKey]}`);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "group relative ml-0 flex min-h-[60px] items-center overflow-hidden text-[15px] font-semibold transition-colors",
                            isRtl ? "rounded-l-xl" : "rounded-r-xl",
                            isSidebarExpanded
                              ? "justify-start px-6 py-4"
                              : "justify-center px-3 py-3",
                            isActive
                              ? cn(
                                  "bg-transparent text-[#c79da0] before:absolute before:top-1/2 before:h-[82%] before:w-[10px] before:-translate-y-1/2 before:bg-white",
                                  isRtl
                                    ? "before:right-0 before:rounded-l-full"
                                    : "before:left-0 before:rounded-r-full",
                                )
                              : cn(
                                  "text-white/70 hover:text-black",
                                  "after:absolute after:inset-y-0 after:z-0 after:bg-white after:transition-transform after:duration-200",
                                  isRtl
                                    ? "after:right-0 after:w-full after:origin-right after:scale-x-0 hover:after:scale-x-100"
                                    : "after:left-0 after:w-full after:origin-left after:scale-x-0 hover:after:scale-x-100",
                                ),
                          )}
                          title={!isSidebarExpanded ? label : undefined}
                        >
                          {isSidebarExpanded ? (
                            <span className="relative z-10">{label}</span>
                          ) : (
                            <span
                              className={cn(
                                "relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold uppercase tracking-[0.08em]",
                                isActive ? "bg-white text-brand-950" : "bg-white/12 text-white/85",
                              )}
                            >
                              {shortLabel}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <div
          className={cn(
            "flex min-h-screen flex-1 flex-col",
            isRtl
              ? isSidebarExpanded
                ? "mr-[280px]"
                : "mr-[92px]"
              : isSidebarExpanded
                ? "ml-[280px]"
                : "ml-[92px]",
          )}
        >
          <header className="flex items-center justify-between px-6 py-5 sm:px-8">
            <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
              <button
                type="button"
                onClick={() => {
                  setIsCollapsed((current) => !current);
                  setIsHoverExpanded(false);
                }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-neutral-100 transition hover:bg-white/15"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <MenuIcon className="size-5" />
              </button>

              <div className={cn(isRtl && "text-right")}>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-neutral-300">
                  {t("nav.dashboard")}
                </p>
                <h1 className="mt-1 text-2xl font-medium text-neutral-500">
                  {t("admin.portalOverview")}
                </h1>
              </div>
            </div>

            <div className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
              <LocaleSwitcher variant="button" />
              <NotificationDropdown />
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="min-h-full rounded-[25px] bg-[linear-gradient(180deg,#f7efe4_0%,#f2e3ce_100%)] p-6 sm:p-8">
              {children}
            </div>
          </main>

          <footer className="px-6 py-4 sm:px-8">
            <div className={cn("text-sm text-neutral-300", isRtl && "text-right")}>
              <p>{t("admin.footerCopyright", { year: currentYear })}</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export const dashboardNavSections = [
  {
    items: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/users", label: "Users" },
      { href: "/agencies", label: "Agencies" },
      { href: "/ads", label: "Ads" },
      { href: "/packages", label: "Packages" },
      { href: "/plans", label: "Subscription Plans" },
      { href: "/bookings", label: "Bookings" },
      { href: "/messages", label: "Messages" },
      { href: "/settings", label: "Settings" },
    ],
  },
  {
    title: "Management",
    items: [
      { href: "/categories", label: "Categories" },
      { href: "/skills", label: "Skills" },
      { href: "/tiers", label: "Listing Tiers" },
      { href: "/locations", label: "Locations" },
      { href: "/payments", label: "Payments" },
      { href: "/reviews", label: "Reviews" },
      { href: "/notifications", label: "Notifications" },
    ],
  },
] satisfies NavSection[];

const dashboardLabelMap = {
  dashboard: "dashboard",
  users: "users",
  agencies: "agencies",
  ads: "ads",
  packages: "packages",
  plans: "plans",
  bookings: "bookings",
  messages: "messages",
  settings: "settings",
  categories: "categories",
  skills: "skills",
  tiers: "tiers",
  locations: "locations",
  payments: "payments",
  reviews: "reviews",
  notifications: "notifications",
} as const;
