import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { photoFolderHref } from "../lib/photoFolders";
import type { FolderSelection, PhotoFolder } from "../lib/photoFolders";

type PhotoFolderNavProps = { folders: readonly PhotoFolder[]; selection: FolderSelection };

const ROW =
  "flex min-h-9 items-center gap-2 rounded-md px-2.5 text-caption no-underline hover:bg-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring";

const Count = ({ count }: { count: number }) => <span className="ml-auto pl-2 text-xs font-bold text-muted-foreground tabular-nums">{count}</span>;

/** The folders down the side (a wrapped row on smaller screens); the open folder lists its treks, regions… beneath it. */
export const PhotoFolderNav = ({ folders, selection }: PhotoFolderNavProps) => (
  <nav aria-label="Photo folders" className="desktop:sticky desktop:top-4">
    <ul className="m-0 flex list-none flex-wrap gap-1 p-0 desktop:flex-col">
      {folders.map((folder) => {
        const isOpen = folder.key === selection.folder;
        return (
          <li key={folder.key} className="max-desktop:contents">
            <Link
              href={photoFolderHref(folder.key)}
              aria-current={isOpen && !selection.item ? "page" : undefined}
              className={cn(ROW, "font-bold", isOpen ? "bg-brand-tint text-brand" : "text-text", "max-desktop:border max-desktop:border-solid max-desktop:border-border")}
            >
              <Icon name={folder.icon} size={18} />
              {folder.label}
              <Count count={folder.count} />
            </Link>
            {isOpen && folder.items.length > 0 && (
              <ul className="m-0 mt-1 flex max-h-[50vh] list-none flex-col gap-0.5 overflow-y-auto border-0 border-l-2 border-solid border-border p-0 pl-2 max-desktop:w-full max-desktop:max-h-60">
                {folder.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={photoFolderHref(folder.key, item.id)}
                      aria-current={selection.item === item.id ? "page" : undefined}
                      className={cn(ROW, "min-h-8", selection.item === item.id ? "bg-brand-tint font-bold text-brand" : "text-text")}
                    >
                      <span className="truncate">{item.label}</span>
                      <Count count={item.count} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  </nav>
);
