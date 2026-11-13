/** Shown while a page's content is on its way: the shape of a page top, so nothing jumps when it arrives. */
const Loading = () => (
  <main id="main" aria-busy="true" aria-label="Loading the page" className="wrap flex flex-wrap items-center gap-x-12 gap-y-8 pt-6 pb-10">
    <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-5">
      <span className="h-4 w-40 rounded-full bg-cloud" />
      <span className="h-12 w-4/5 rounded-xl bg-cloud" />
      <span className="h-12 w-3/5 rounded-xl bg-cloud" />
      <span className="h-5 w-full rounded-full bg-cloud" />
      <span className="h-5 w-11/12 rounded-full bg-cloud" />
      <span className="flex gap-3">
        <span className="h-12 w-48 rounded-[10px] bg-cloud" />
        <span className="h-12 w-40 rounded-[10px] bg-cloud" />
      </span>
    </div>
    <div className="min-w-0 flex-[1_1_520px]">
      <div className="aspect-5/4 rounded-3xl bg-cloud max-md:aspect-4/3" />
    </div>
    <span className="sr-only">Loading…</span>
  </main>
);

export default Loading;
