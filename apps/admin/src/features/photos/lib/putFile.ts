/**
 * Sends a file to a one-time upload link (PUT), reporting progress 0–1. XMLHttpRequest because fetch()
 * can't report upload progress. Rejects on a network error or a non-2xx answer.
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
    request.onload = () => (request.status < 300 ? resolve() : reject(new Error(`Upload failed (${request.status})`)));
    request.onerror = () => reject(new Error("Upload failed (network)"));
    request.send(file);
  });
