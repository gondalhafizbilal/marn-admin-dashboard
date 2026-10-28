type AdminPagePlaceholderProps = {
  title: string;
  description?: string;
};

export function AdminPagePlaceholder({ title, description }: AdminPagePlaceholderProps) {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-[24px] border border-dashed border-brand-700/20 bg-brand-25/20 text-center">
      <div>
        <h1 className="text-3xl font-semibold text-neutral-800">{title}</h1>
        {description ? (
          <p className="mt-2 text-sm text-neutral-500">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
