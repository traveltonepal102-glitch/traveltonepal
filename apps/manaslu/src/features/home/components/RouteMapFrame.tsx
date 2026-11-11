type RouteMapFrameProps = {
  embedUrl: string;
  title: string;
  /** Crops off a My Maps map's title bar, which Google has no setting to hide; its logo and attribution stay. */
  hidesTitleBar: boolean;
};

const FRAME_SIZE = "h-90 w-full sm:aspect-1000/560 sm:h-auto";
/** The My Maps title bar is 67px tall at every width: the frame starts that far above the box. */
const CROPPED_FRAME = "absolute inset-x-0 -top-[67px] h-[calc(100%+67px)] w-full border-0";

/**
 * The Google route map (trek pages and blog maps), loaded with the page for every visitor (decided 2026-11-11), so it
 * does not wait for "External media"; the Privacy policy and the cookie table say so. `loading="lazy"` still fetches
 * it only when it comes near the screen.
 */
export const RouteMapFrame = ({ embedUrl, title, hidesTitleBar }: RouteMapFrameProps) => {
  const frame = <iframe src={embedUrl} title={title} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" className={hidesTitleBar ? CROPPED_FRAME : `block border-0 ${FRAME_SIZE}`} />;
  return <div className="overflow-hidden rounded-[14px] border border-solid border-line">{hidesTitleBar ? <div className={`relative overflow-hidden ${FRAME_SIZE}`}>{frame}</div> : frame}</div>;
};
