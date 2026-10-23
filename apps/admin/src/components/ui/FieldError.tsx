import { Icon } from "@ttn/ui/icon";

type FieldErrorProps = {
  /** Point the field's aria-describedby here. */
  id: string;
  message?: string;
};

/** A field's error line: icon and words, never color alone. Renders nothing without a message. */
export const FieldError = ({ id, message }: FieldErrorProps) => {
  if (!message) return null;
  return (
    <p id={id} className="m-0 flex items-start gap-1.5 text-caption font-semibold text-danger">
      <Icon name="error" size={16} className="mt-0.5 flex-none" />
      {message}
    </p>
  );
};
