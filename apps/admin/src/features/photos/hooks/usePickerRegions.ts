"use client";

import { useEffect, useState } from "react";

import { listPickerRegions } from "../actions/listPickerRegions";

/** The regions to filter the "Choose a photo" window by, loaded when it opens. */
export const usePickerRegions = () => {
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    let isCurrent = true;
    // Without them the filter offers "All photos" only; searching still works, so a failure isn't worth a message.
    listPickerRegions()
      .then((loaded) => isCurrent && setRegions(loaded))
      .catch(() => undefined);
    return () => {
      isCurrent = false;
    };
  }, []);

  return regions;
};
