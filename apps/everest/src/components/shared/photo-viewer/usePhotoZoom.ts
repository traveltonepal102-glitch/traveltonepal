"use client";

import { useRef, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";

type Zoom = { index: number; x: number; y: number };

/** A finger or mouse that moved further than this (px) was moving around the photo, not clicking it. */
const CLICK_SLOP = 8;

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

/** Where on the photo the pointer is, in percent of its box: the point the zoom grows from. */
const pointOn = (event: MouseEvent<HTMLElement>) => {
  const box = event.currentTarget.getBoundingClientRect();
  return { x: clampPercent(((event.clientX - box.left) / box.width) * 100), y: clampPercent(((event.clientY - box.top) / box.height) * 100) };
};

/**
 * Zoom for the photo viewer: a click zooms in where it lands, moving the mouse (or dragging a finger) over the zoomed
 * photo moves around it, another click zooms out. The zoom belongs to one photo, so moving to the next one resets it.
 */
export const usePhotoZoom = (current: number) => {
  const [zoom, setZoom] = useState<Zoom | null>(null);
  const pressedAt = useRef<{ x: number; y: number } | null>(null);
  const hasMoved = useRef(false);
  const isZoomed = zoom?.index === current;

  /** The zoom button: in at the middle, or back out. */
  const toggle = () => setZoom(isZoomed ? null : { index: current, x: 50, y: 50 });

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    pressedAt.current = { x: event.clientX, y: event.clientY };
    hasMoved.current = false;
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const start = pressedAt.current;
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > CLICK_SLOP) hasMoved.current = true;
    // A mouse moves around the zoomed photo just by hovering; a finger only while it is down.
    if (!isZoomed || (event.pointerType !== "mouse" && !start)) return;
    setZoom({ index: current, ...pointOn(event) });
  };

  const onPointerUp = () => {
    pressedAt.current = null;
  };

  const onClick = (event: MouseEvent<HTMLElement>) => {
    if (hasMoved.current) return;
    setZoom(isZoomed ? null : { index: current, ...pointOn(event) });
  };

  return {
    isZoomed,
    /** CSS transform-origin of the zoomed photo. */
    origin: isZoomed ? `${zoom.x}% ${zoom.y}%` : "50% 50%",
    toggle,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onClick },
  };
};
