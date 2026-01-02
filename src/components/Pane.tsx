type PaneProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function Pane({ title, children, className }: PaneProps) {
  return (
    <section
      className={
        "flex min-h-0 min-w-0 flex-col rounded-lg bg-white" +
        (className ? ` ${className}` : "")
      }
    >
      <header className="bg-neutral-50 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
      </header>
      <div className="min-h-0 flex-1 p-4">{children}</div>
    </section>
  );
}
