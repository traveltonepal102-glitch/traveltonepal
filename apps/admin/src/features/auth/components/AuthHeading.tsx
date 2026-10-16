import type { ReactNode } from "react";

type AuthHeadingProps = {
  title: string;
  description?: ReactNode;
};

export const AuthHeading = ({ title, description }: AuthHeadingProps) => (
  <header className="flex flex-col gap-2">
    <h1 className="m-0 font-display text-h3 text-ink">{title}</h1>
    {description && <p className="m-0 text-muted-foreground">{description}</p>}
  </header>
);
