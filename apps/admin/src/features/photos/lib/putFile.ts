import { storageUploadErrorMessage } from "./uploadErrors";

/** The upload was stopped on purpose (the window was closed): nothing to tell the editor. */
export class UploadStoppedError extends Error {}

/**
 * Sends a file to a one-time upload link (PUT), reporting progress 0–1. XMLHttpRequest because fetch()
 * can't report upload progress. Rejects with a message for the editor on a network error or a non-2xx answer,
 * and with UploadStoppedError when `signal` stops it (storage then keeps nothing).
 */
export const putFile = (url: string, file: File, onProgress: (fraction: number) => void, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new UploadStoppedError());
    const request = new XMLHttpRequest();
    signal?.addEventListener("abort", () => request.abort(), { once: true });
    request.onabort = () => reject(new UploadStoppedError());
    request.open("PUT", url);
    request.setRequestHeader("content-type", file.type);
    request.setRequestHeader("x-upsert", "false");
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    request.onload = () => (request.status < 300 ? resolve() : reject(new Error(storageUploadErrorMessage(request.status, request.responseText))));
    // No answer at all: offline, or the storage's CORS rules don't list this address (the browser hides which).
    request.onerror = () => reject(new Error(storageUploadErrorMessage(0, "")));
    request.send(file);
  });
