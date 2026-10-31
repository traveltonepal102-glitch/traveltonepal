import { storageUploadErrorMessage } from "./uploadErrors";

/**
 * Sends a file to a one-time upload link (PUT), reporting progress 0–1. XMLHttpRequest because fetch()
 * can't report upload progress. Rejects with a message for the editor on a network error or a non-2xx answer.
 */
export const putFile = (url: string, file: File, onProgress: (fraction: number) => void) =>
  new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
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
