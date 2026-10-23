type PageHeaderProps = {
  title: string;
  description?: string;
};

/** The heading block at the top of each admin screen. */
export const PageHeader = ({ title, description }: PageHeaderProps) => (
  <header className="flex flex-col gap-1">
    <h1 className="m-0 font-display text-[28px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">{title}</h1>
    {description && <p className="m-0 text-muted-foreground">{description}</p>}
  </header>
);
