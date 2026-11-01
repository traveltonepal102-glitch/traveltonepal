import { SAME_NAME_BATCH } from "../constants";
import { fileNameKey } from "./sameFileName";

/** The names to look up before an upload: each once, none empty, in goes of SAME_NAME_BATCH. */
export const sameNameBatches = (fileNames: readonly string[], size = SAME_NAME_BATCH) => {
  const byKey = new Map<string, string>();
  for (const name of fileNames) if (name.trim() && !byKey.has(fileNameKey(name))) byKey.set(fileNameKey(name), name.trim());
  const names = [...byKey.values()];
  return Array.from({ length: Math.ceil(names.length / size) }, (_, index) => names.slice(index * size, (index + 1) * size));
};
