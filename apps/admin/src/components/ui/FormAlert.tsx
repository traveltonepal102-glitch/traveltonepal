import { Icon } from "@ttn/ui/icon";

type FormAlertProps = {
  message: string;
  /** A second, smaller line, e.g. the lockout rule. */
  detail?: string;
};

/** Error box: danger color always comes with an icon and words, never color alone. */
export const FormAlert = ({ message, detail }: FormAlertProps) => (
  <div role="alert" className="flex gap-3 rounded-xl border border-solid border-[#fecaca] bg-danger-tint px-3.5 py-3 text-[#991b1b]">
    <Icon name="error" size={20} className="mt-px flex-none" />
    <div className="flex flex-col gap-0.5">
      <p className="m-0 font-bold">{message}</p>
      {detail && <p className="m-0 text-caption font-normal text-danger">{detail}</p>}
    </div>
  </div>
);
