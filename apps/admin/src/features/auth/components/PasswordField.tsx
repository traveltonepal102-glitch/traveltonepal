import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { TextField } from "./TextField";

/** Password field with a show/hide button (the typed text stays in the field either way). */
export const PasswordField = ({ isInvalid }: { isInvalid: boolean }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField
      name="password"
      type={isVisible ? "text" : "password"}
      label="Password"
      icon="lock"
      placeholder="Your password"
      autoComplete="current-password"
      isInvalid={isInvalid}
      required
      trailing={
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          className="m-0 inline-flex size-9 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-muted-foreground hover:bg-page hover:text-ink focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Icon name={isVisible ? "visibility_off" : "visibility"} size={20} />
        </button>
      }
    />
  );
};
