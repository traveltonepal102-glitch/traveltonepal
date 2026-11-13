/*
 * Whether uploaded bytes really are the file they claim to be (their content, not their name): a PDF, or a GPX
 * track. Pure, so the checks are tested; the storage code (trekFiles.ts) applies them after each upload.
 */

/** The first bytes of every PDF. */
const PDF_SIGNATURE = Buffer.from("%PDF-");
/** A GPX file is XML with a <gpx> root; the root is found within its first bytes. */
const GPX_HEAD_BYTES = 4096;

export const isPdfFile = (file: Buffer) => file.subarray(0, PDF_SIGNATURE.length).equals(PDF_SIGNATURE);

export const isGpxFile = (file: Buffer) => {
  const head = file.subarray(0, GPX_HEAD_BYTES).toString("utf8").replace(/^﻿/, "").trimStart();
  return (head.startsWith("<?xml") || head.startsWith("<gpx")) && /<gpx[\s>]/.test(head);
};
