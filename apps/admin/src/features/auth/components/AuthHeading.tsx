import type { ReactNode } from "react";

type AuthHeadingProps = {
  title: string;
  description?: ReactNode;
};

export const AuthHeading = ({ title, description }: AuthHeadingProps) => (
  <header className="flex flex-col gap-1.5">
    <h1 className="m-0 font-display text-[26px] leading-tight font-extrabold text-ink sm:text-[30px]">{title}</h1>
    {description && <p className="m-0 text-[15px] text-muted-foreground">{description}</p>}
  </header>
);
