type BeliefQuoteProps = { quote: string; note?: string };

/** A belief's line in the company's own words, with the note under it. Left out when nothing is saved. */
export const BeliefQuote = ({ quote, note }: BeliefQuoteProps) => {
  if (!quote) return null;

  return (
    <blockquote className="flex flex-col gap-1 border-0 border-l-4 border-solid border-sun pl-4.5">
      <p className="font-display text-2xl leading-8 font-semibold text-navy-deep">“{quote}”</p>
      {note && <p className="text-[15px] leading-5.75 text-muted">{note}</p>}
    </blockquote>
  );
};
