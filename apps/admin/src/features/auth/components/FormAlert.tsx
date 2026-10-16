type FormAlertProps = {
  message: string;
};

/** Error box: danger color always comes with a word, never color alone. */
export const FormAlert = ({ message }: FormAlertProps) => (
  <div role="alert" className="rounded-md border border-solid border-danger/25 bg-danger-tint px-3 py-2.5 text-danger">
    <strong className="font-semibold">Error: </strong>
    {message}
  </div>
);
