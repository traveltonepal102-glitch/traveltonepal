import { withAnchors as withSharedAnchors } from "@ttn/site-data/guideBlocks";

import type { ArticleBlock } from "./types";

export { toBlock, toPerson } from "@ttn/site-data/guideBlocks";

export const withAnchors: (blocks: readonly ArticleBlock[]) => ArticleBlock[] = withSharedAnchors;
