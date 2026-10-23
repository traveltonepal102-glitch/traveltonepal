/** Admin form looks (design: .ad-in, .ad-lbl, .ad-hint). Class strings, so custom fields can share them. */
export const inputClass =
  "m-0 box-border h-10.5 w-full rounded-md border border-solid border-input bg-surface px-3 font-sans text-body-sm text-ink outline-none placeholder:text-subtle focus:border-brand focus:ring-3 focus:ring-brand/15 read-only:bg-page read-only:text-text aria-invalid:border-danger";

export const textareaClass = `${inputClass} h-auto resize-y py-2.5 leading-relaxed`;

export const labelClass = "text-label text-ink";

export const hintClass = "m-0 text-xs text-muted-foreground";

/** Small uppercase label inside tiles (design: region facts). */
export const tileLabelClass = "text-[11px] font-bold tracking-wider text-muted-foreground uppercase";
