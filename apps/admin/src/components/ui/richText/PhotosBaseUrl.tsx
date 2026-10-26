"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

const PhotosBaseUrlContext = createContext("");

/** Where the sized library photos are (server-only setting), for the photos shown inside text editors. */
export const PhotosBaseUrlProvider = ({ value, children }: { value: string; children: ReactNode }) => (
  <PhotosBaseUrlContext.Provider value={value}>{children}</PhotosBaseUrlContext.Provider>
);

export const usePhotosBaseUrl = () => useContext(PhotosBaseUrlContext);
