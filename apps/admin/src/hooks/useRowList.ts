"use client";

import { useState } from "react";

/** A row with a key that never changes (React keys and focus survive reordering). */
export type KeyedRow<Row> = Row & { key: string };

/**
 * An editable list of rows for an editor form: add, remove, move and change rows. Every change calls
 * `onEdit` (the form can't see these changes by itself).
 */
export const useRowList = <Row extends object>(initial: Row[], onEdit: () => void) => {
  const [rows, setRows] = useState<KeyedRow<Row>[]>(() => initial.map((row, index) => ({ ...row, key: `saved-${index}` })));

  const change = (update: (current: KeyedRow<Row>[]) => KeyedRow<Row>[]) => {
    setRows(update);
    onEdit();
  };

  return {
    rows,
    /** Adds a row at the end, or at index `at`. Returns the new row's key (e.g. to open it). */
    add: (row: Row, at?: number) => {
      const key = crypto.randomUUID();
      change((current) => {
        const next = [...current];
        next.splice(at ?? current.length, 0, { ...row, key });
        return next;
      });
      return key;
    },
    remove: (key: string) => change((current) => current.filter((row) => row.key !== key)),
    move: (from: number, to: number) =>
      change((current) => {
        if (to < 0 || to >= current.length) return current;
        const next = [...current];
        const [row] = next.splice(from, 1);
        next.splice(to, 0, row);
        return next;
      }),
    update: (key: string, patch: Partial<Row>) => change((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row))),
    /** Applies `patch` to every row, e.g. to switch the "Most popular" choice to one row. */
    updateAll: (patch: (row: KeyedRow<Row>) => Partial<Row>) => change((current) => current.map((row) => ({ ...row, ...patch(row) }))),
  };
};
