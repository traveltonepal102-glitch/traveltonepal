"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState, useTransition } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { addVideo } from "../actions/addVideo";
import { VIDEO_LIMITS as LIMIT } from "../constants";
import type { LibraryVideo } from "../types";

type NewVideoFieldsProps = { onAdded: (video: LibraryVideo) => void };

/**
 * "Add a new video" inside a "Choose a video" window: a link and a title, added to the library at once. Not a form:
 * the window sits inside an editor's form, so the button calls the Server Action itself.
 */
export const NewVideoFields = ({ onAdded }: NewVideoFieldsProps) => {
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [isAdding, startAdding] = useTransition();

  const add = () =>
    startAdding(async () => {
      const result = await addVideo({ youtubeId: link, title });
      if (!result.ok) {
        setErrors(result.fieldErrors);
        // A field with an error says what to fix; the general line is for everything else.
        setMessage(Object.keys(result.fieldErrors).length ? "" : result.message);
        return;
      }
      setLink("");
      setTitle("");
      setErrors({});
      setMessage("");
      onAdded(result.video);
    });

  return (
    <div className="flex flex-col gap-3">
      <TextField name="newVideoLink" label="YouTube link" value={link} onValueChange={setLink} placeholder="https://www.youtube.com/watch?v=…" error={errors.youtubeId} />
      <TextField name="newVideoTitle" label="Title" value={title} onValueChange={setTitle} placeholder="Walking to Kyanjin Ri" maxLength={LIMIT.title} error={errors.title} />
      <button type="button" onClick={add} disabled={isAdding || !link.trim()} className={cn(secondaryButton, "self-start")}>
        <Icon name="add" size={18} />
        {isAdding ? "Adding…" : "Add and use"}
      </button>
      <FieldError id="new-video-error" message={message} />
    </div>
  );
};
