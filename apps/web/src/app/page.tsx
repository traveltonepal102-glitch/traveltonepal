import { Button } from "@ttn/ui/button";

const Home = () => (
  <main className="mx-auto flex w-full max-w-content flex-1 flex-col justify-center gap-6 px-4 py-14 md:px-6">
    <p className="text-eyebrow text-brand uppercase">Langtang · Everest · Annapurna</p>
    <h1 className="text-display">Travel to Nepal</h1>
    <p className="text-body-lg max-w-2xl">
      Small-group treks with a local team. Ask us anything on WhatsApp or by email.
    </p>
    <div className="flex flex-wrap items-center gap-4">
      <Button>Start planning</Button>
      <span className="text-label rounded-full bg-saffron px-3 py-1 text-navy">Featured</span>
      <span className="text-caption rounded-full bg-green-tint px-3 py-1 text-whatsapp">
        Guaranteed
      </span>
    </div>
  </main>
);

export default Home;
