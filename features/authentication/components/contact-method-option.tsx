import { cn } from "@/lib/utils";

type ContactMethodOptionProps = {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  label: string;
  value: string;
};

export function ContactMethodOption({
  selected,
  onSelect,
  icon,
  label,
  value,
}: ContactMethodOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex h-[76px] w-full items-center gap-2 rounded-xl border bg-white px-4 py-2 text-start transition-colors",
        selected ? "border-primary" : "border-neutral-300 hover:border-neutral-400",
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gray-100">
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            "text-xs leading-[1.5]",
            selected ? "text-neutral-400" : "text-neutral-300",
          )}
        >
          {label}
        </span>
        <span className="truncate text-sm font-semibold leading-[1.3] text-neutral-800">
          {value}
        </span>
      </span>
    </button>
  );
}
