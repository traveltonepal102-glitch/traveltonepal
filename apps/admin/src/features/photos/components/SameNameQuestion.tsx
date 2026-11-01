"use client";

import { cn } from "@ttn/ui/lib/utils";

import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";

import type { SameNameAnswer } from "../hooks/useSameNameQuestions";
import type { NamedPhoto } from "../types";
import { PhotoImage } from "./PhotoImage";

type SameNameQuestionProps = {
  fileName: string;
  /** The library photo uploaded from a file with the same name. */
  photo: NamedPhoto;
  /** Offer "Use the library photo" (a window choosing a photo; not the Photos screen). */
  canUseLibraryPhoto: boolean;
  onAnswer: (answer: SameNameAnswer) => void;
};

const smallButton = "min-h-8 px-3 text-caption";

/** "A photo named … is already in the library": nothing is uploaded until the editor says so. */
export const SameNameQuestion = ({ fileName, photo, canUseLibraryPhoto, onAnswer }: SameNameQuestionProps) => (
  <div role="group" aria-label={`${fileName} is already in the library`} className="flex items-start gap-3">
    <PhotoImage photo={photo} alt="" sizes="64px" className="block aspect-4/3 w-16 flex-none rounded-sm object-cover" />
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <p className="m-0 text-caption text-ink">
        A photo named <strong className="break-all">{fileName}</strong> is already in the library{photo.place ? ` (${photo.place})` : ""}. Upload it again?
      </p>
      <div className="flex flex-wrap gap-2">
        {canUseLibraryPhoto && (
          <button type="button" onClick={() => onAnswer("useLibraryPhoto")} className={cn(primaryButton, smallButton)}>
            Use the library photo
          </button>
        )}
        <button type="button" onClick={() => onAnswer("upload")} className={cn(secondaryButton, smallButton)}>
          Yes, upload it
        </button>
        <button type="button" onClick={() => onAnswer("skip")} className={cn(secondaryButton, smallButton)}>
          Don’t upload
        </button>
      </div>
    </div>
  </div>
);
