import { Icon } from "@ttn/ui/icon";

import type { UploadItem } from "../hooks/usePhotoUploads";

type UploadProgressListProps = {
  items: UploadItem[];
  onDismiss: (id: string) => void;
};

/** Photos being uploaded (progress, then "Preparing…" while the server makes the sizes) or that failed. */
export const UploadProgressList = ({ items, onDismiss }: UploadProgressListProps) => {
  if (!items.length) return null;

  return (
    <ul aria-label="Uploads" className="m-0 flex list-none flex-col gap-2 p-0">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 rounded-md border border-solid border-border bg-page px-3 py-2">
          <Icon name={item.error ? "error" : "upload"} size={18} className={item.error ? "flex-none text-danger" : "flex-none text-brand"} />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate text-caption font-semibold text-ink">{item.fileName}</span>
            {item.error ? (
              <span role="alert" className="text-xs font-semibold text-danger">
                {item.error}
              </span>
            ) : (
              <>
                <progress value={item.progress} max={1} aria-label={`Uploading ${item.fileName}`} className="h-1.5 w-full accent-brand" />
                <span className="text-xs text-muted-foreground">{item.progress < 1 ? "Uploading…" : "Preparing sizes…"}</span>
              </>
            )}
          </div>
          {item.error && (
            <button
              type="button"
              onClick={() => onDismiss(item.id)}
              aria-label={`Dismiss ${item.fileName}`}
              className="m-0 inline-flex size-8 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-text hover:text-brand focus-visible:outline-2 focus-visible:outline-ring"
            >
              <Icon name="close" size={18} />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};
