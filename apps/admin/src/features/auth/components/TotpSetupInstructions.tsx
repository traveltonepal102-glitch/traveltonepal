import Image from "next/image";

type TotpSetupInstructionsProps = {
  secret: string;
  qrDataUrl: string;
};

const formatKey = (secret: string) => secret.match(/.{1,4}/g)?.join(" ") ?? secret;

export const TotpSetupInstructions = ({ secret, qrDataUrl }: TotpSetupInstructionsProps) => (
  <div className="flex flex-col gap-4">
    <ol className="m-0 flex list-decimal flex-col gap-1 pl-5">
      <li>Open an authenticator app: Google Authenticator, Microsoft Authenticator or 1Password.</li>
      <li>Scan this QR code, or type the setup key.</li>
      <li>Enter the 6-digit code the app shows.</li>
    </ol>
    <Image
      src={qrDataUrl}
      alt="QR code to add Travel To Nepal Admin to your authenticator app"
      width={220}
      height={220}
      unoptimized
      className="mx-auto rounded-md border border-solid border-line"
    />
    <div className="flex flex-col gap-1.5">
      <p className="m-0 text-label text-ink">Setup key</p>
      <code className="rounded-md bg-muted px-3 py-2 font-mono text-body-sm tracking-wider text-ink select-all">
        {formatKey(secret)}
      </code>
    </div>
  </div>
);
