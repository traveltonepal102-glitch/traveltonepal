import { Icon } from "@ttn/ui/icon";

/** Saffron "Our local tip" box. */
export const LocalTip = ({ title, text }: { title: string; text: string }) => (
  <aside aria-label={title} className="flex gap-3 rounded-xl border border-saffron-line bg-saffron-tint px-5 py-4.5">
    <span aria-hidden="true" className="inline-flex size-9 flex-none items-center justify-center rounded-md bg-saffron text-ink">
      <Icon name="lightbulb" size={20} />
    </span>
    <div className="flex flex-col gap-1">
      <p className="font-display text-base font-bold text-ink">{title}</p>
      <p className="text-[15px] leading-relaxed text-text">{text}</p>
    </div>
  </aside>
);
