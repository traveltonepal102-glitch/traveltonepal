import { StatusSelect } from "@/components/editor/StatusSelect";

import { STATUS_OPTIONS } from "../../constants";
import type { TrekStatus } from "../../types";

type TrekStatusSelectProps = {
  defaultValue: TrekStatus;
};

/** Draft / Published / Hidden next to Save (the design shows the status but has no way to change it). */
export const TrekStatusSelect = ({ defaultValue }: TrekStatusSelectProps) => <StatusSelect options={STATUS_OPTIONS} defaultValue={defaultValue} />;
