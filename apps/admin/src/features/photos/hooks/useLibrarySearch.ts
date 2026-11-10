"use client";

import { useEffect, useState } from "react";

import { searchPickerPhotos } from "../actions/searchPickerPhotos";
import { searchKey } from "../lib/pickerFilter";
import { appendPage, prependPhoto } from "../lib/pickerResults";
import type { PickerFilter } from "../lib/pickerSearch";
import type { PhotoText, PickerPhoto } from "../types";

/** Typing waits this long before searching, so each letter isn't a request. */
const TYPING_PAUSE_MS = 300;

type Results = { key: string; photos: PickerPhoto[]; hasMore: boolean; hasFailed: boolean };

/**
 * The "Choose a photo" window's photos: the library searched on the server (words and a filter), a page at a time.
 * While a new search runs, the last results stay on screen.
 */
export const useLibrarySearch = (startFilter: PickerFilter) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(startFilter);
  const [attempt, setAttempt] = useState(0);
  const [results, setResults] = useState<Results | null>(null);
  const [more, setMore] = useState<"idle" | "loading" | "failed">("idle");
  const searchQuery = query.trim();
  const key = searchKey(searchQuery, filter);

  useEffect(() => {
    let isCurrent = true;
    const resultKey = searchKey(searchQuery, filter);
    const timer = setTimeout(() => {
      searchPickerPhotos({ query: searchQuery, filter, offset: 0 })
        .then((page) => isCurrent && setResults({ key: resultKey, ...page, hasFailed: false }))
        .catch(() => isCurrent && setResults({ key: resultKey, photos: [], hasMore: false, hasFailed: true }));
    }, searchQuery ? TYPING_PAUSE_MS : 0);
    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [searchQuery, filter, attempt]);

  const loadMore = () => {
    if (!results || results.key !== key || more === "loading") return;
    setMore("loading");
    searchPickerPhotos({ query: searchQuery, filter, offset: results.photos.length })
      .then((page) => {
        setResults((current) => (current?.key === key ? { ...current, photos: appendPage(current.photos, page.photos), hasMore: page.hasMore } : current));
        setMore("idle");
      })
      .catch(() => setMore("failed"));
  };

  /** A photo uploaded in the window shows first, whatever the search. */
  const prepend = (photo: PickerPhoto) => setResults((current) => current && { ...current, photos: prependPhoto(current.photos, photo) });

  /** A photo whose alt text, caption or place was saved in the window shows them without searching again. */
  const updateText = (photoId: string, text: PhotoText) =>
    setResults((current) => current && { ...current, photos: current.photos.map((photo) => (photo.id === photoId ? { ...photo, ...text } : photo)) });

  return {
    query,
    setQuery,
    filter,
    setFilter,
    photos: results?.photos ?? null,
    hasMore: results?.hasMore ?? false,
    hasFailed: results?.key === key && results.hasFailed,
    isSearching: results?.key !== key,
    more,
    loadMore,
    retry: () => setAttempt((current) => current + 1),
    prepend,
    updateText,
  };
};
