"use client";

import { BellIcon, UserCircle2Icon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { getDirection, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type NotificationItem = {
  id: string;
  type: "bell" | "avatar" | "user";
  title: string;
  body: string;
  accent?: string;
};

type NotificationGroup = {
  title: string;
  items: NotificationItem[];
};

const notificationGroups: NotificationGroup[] = [
  {
    title: "Today",
    items: [
      {
        id: "today-1",
        type: "bell",
        title: "Congratulations, your ad is now active.",
        body: "click here to see your listing",
      },
      {
        id: "today-2",
        type: "bell",
        title: "Welcome,",
        body: "Don't forget to complete your personal info",
      },
    ],
  },
  {
    title: "Yesterday",
    items: [
      {
        id: "yesterday-1",
        type: "avatar",
        title: "Al Aman Workforce",
        body: "your profile request, check it now.",
        accent: "AA",
      },
      {
        id: "yesterday-2",
        type: "bell",
        title: "Welcome,",
        body: "Don't forget to complete your personal info",
      },
      {
        id: "yesterday-3",
        type: "user",
        title: "Welcome,",
        body: "Don't forget to complete your personal info",
      },
      {
        id: "yesterday-4",
        type: "avatar",
        title: "Al Wakhra Workforce",
        body: "approved your request, check it now",
        accent: "AW",
      },
      {
        id: "yesterday-5",
        type: "user",
        title: "Welcome,",
        body: "Don't forget to complete your personal info",
      },
    ],
  },
];

function NotificationLeading({
  type,
  accent,
}: Pick<NotificationItem, "type" | "accent">) {
  if (type === "avatar") {
    return (
      <div className="flex size-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#f8d774_0%,#d89b3b_100%)] text-[10px] font-bold text-brand-950 shadow-[0_10px_20px_rgba(80,5,22,0.12)]">
        {accent}
      </div>
    );
  }

  if (type === "user") {
    return (
      <div className="flex size-11 items-center justify-center rounded-full bg-white text-brand-800 shadow-[0_8px_18px_rgba(80,5,22,0.08)]">
        <UserCircle2Icon className="size-5" />
      </div>
    );
  }

  return (
    <div className="flex size-11 items-center justify-center rounded-full bg-white text-brand-800 shadow-[0_8px_18px_rgba(80,5,22,0.08)]">
      <BellIcon className="size-4" />
    </div>
  );
}

export function NotificationDropdown() {
  const locale = useLocale();
  const t = useTranslations("admin.notifications");
  const isRtl = getDirection(locale as Locale) === "rtl";
  const translatedItems: Record<string, { title: string; body: string }> = {
    "today-1": {
      title: t("items.today1Title"),
      body: t("items.today1Body"),
    },
    "today-2": {
      title: t("items.today2Title"),
      body: t("items.today2Body"),
    },
    "yesterday-1": {
      title: t("items.yesterday1Title"),
      body: t("items.yesterday1Body"),
    },
    "yesterday-2": {
      title: t("items.today2Title"),
      body: t("items.today2Body"),
    },
    "yesterday-3": {
      title: t("items.today2Title"),
      body: t("items.today2Body"),
    },
    "yesterday-4": {
      title: t("items.yesterday4Title"),
      body: t("items.yesterday4Body"),
    },
    "yesterday-5": {
      title: t("items.today2Title"),
      body: t("items.today2Body"),
    },
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative size-11 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
        )}
        aria-label="Notifications"
      >
        <BellIcon className="size-5" />
        <span className="absolute right-3 top-3 size-2 rounded-full bg-brand-700" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align={isRtl ? "start" : "end"}
        sideOffset={14}
        className="w-[460px] max-w-[calc(100vw-2rem)] rounded-[32px] border-none bg-[#f7efe4] p-0 shadow-[0_30px_70px_rgba(80,5,22,0.24)] ring-0"
      >
        <div className={cn("px-8 py-7", isRtl && "text-right")} dir={isRtl ? "rtl" : "ltr"}>
          {notificationGroups.map((group, groupIndex) => (
            <section key={group.title}>
              {groupIndex > 0 ? (
                <div className="mb-6 mt-6 h-px bg-[#eadfce]" />
              ) : null}
              <h3 className="mb-4 text-[1.65rem] font-semibold tracking-tight text-neutral-800">
                {group.title === "Today" ? t("today") : t("yesterday")}
              </h3>
                <div className="space-y-4">
                  {group.items.map((item) => {
                    const copy = translatedItems[item.id] ?? { title: item.title, body: item.body };

                    return (
                      <div key={item.id} className={cn("flex items-start gap-4", isRtl && "flex-row-reverse")}>
                        <NotificationLeading type={item.type} accent={item.accent} />
                        <p className="max-w-[320px] pt-1 text-[0.95rem] leading-7 text-[#b6becb]">
                          <span className="font-semibold text-neutral-800">{copy.title}</span>{" "}
                          <span>{copy.body}</span>
                        </p>
                      </div>
                    );
                  })}
              </div>
            </section>
          ))}

          <div className="mt-8 flex justify-end border-t border-[#d8cbb7] pt-5">
            <button
              type="button"
              className="text-[0.95rem] font-medium text-brand-800 underline underline-offset-4"
            >
              {t("viewAll")}
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
