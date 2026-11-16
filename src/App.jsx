import { useState } from "react";

const HERO_IMAGE = "/images/hero%201.png";
const STUDIO_IMAGE = "/images/stageready.png";

const plans = [
  {
    id: "strength",
    name: "Strength Athlete",
    price: 199,
    was: 249,
    save: "Save $50 (20%) · first year",
    code: "GIFT",
    tone: "light",
    features: [
      "A full year of ballet-specific strength training, beginner to advanced",
      "Five programs, from turns and jumps to performance prep",
      "Guided video and form cues for every exercise",
      "Gym or home workouts, with exercise swaps",
      "Built-in progress tracking",
    ],
  },
  {
    id: "performance",
    name: "Performance Athlete",
    price: 299,
    was: 399,
    save: "Save $100 (25%) · first year",
    code: "GIFTPLUS",
    tone: "dark",
    badge: "Most complete",
    features: [
      "Everything in Strength Athlete, plus:",
      "Access to every new program as it's released",
      "A personalized performance dashboard",
      "Full access to the TBB community",
      "Every new feature as it launches",
    ],
  },
];

const reasons = [
  {
    n: "01",
    title: "Fewer injuries",
    body: "Strength that protects ankles, knees, hips and backs through a full season.",
  },
  {
    n: "02",
    title: "Better technique",
    body: "Stronger turns, higher jumps, extensions that hold.",
  },
  {
    n: "03",
    title: "Built by a professional",
    body: "Created by Lili Pfeifer, professional ballerina and NASM-certified trainer with 6 years of experience coaching dancers.",
  },
  {
    n: "04",
    title: "On their schedule",
    body: "Training that fits around class, rehearsal and Nutcracker.",
  },
  {
    n: "05",
    title: "No shipping",
    body: "Delivered instantly, even on Christmas Eve.",
  },
];

const programs = [
  {
    n: "01",
    title: "Effortless Extensions",
    tag: "Mobility + Control",
    copy: "Develop front extension strength, active hip flexor range, posterior chain loading, side body control, and upper body endurance to support the height and stability your extensions demand.",
    image: "/images/effortlessextensions.png",
    imageAlt: "Dancer in a high side extension en pointe",
  },
  {
    n: "02",
    title: "Turn Like an Athlete",
    tag: "Power + Stability",
    copy: "Build the upper body pulling strength, lower body power, core stability, and turnout control that gives every pirouette a stronger suspension and a cleaner finish.",
    image: "/images/turnlikeanathlete.png",
    imageAlt: "Dancer in a turning pose en pointe",
  },
  {
    n: "03",
    title: "Jumper’s Edge",
    tag: "Explosive Strength",
    copy: "Train explosive hip drive, deep core force transfer, petit allegro reactivity, upper body carriage, and tendon elasticity to add height and power to every jump combination.",
    image: "/images/jumpersedge.png",
    imageAlt: "Dancer in a grand jeté",
  },
  {
    n: "04",
    title: "Stage Ready",
    tag: "Performance Preparation",
    copy: "A performance preparation program built around deep core stability, full body push strength, posterior chain power, reactive jump mechanics, and joint resilience.",
    image: "/images/stageready.png",
    imageAlt: "Dancer in a contemporary port de bras with mirrored figures",
  },
  {
    n: "05",
    title: "Bulletproof Body",
    tag: "Full-Body Conditioning",
    copy: "A full-spectrum conditioning program targeting lower body strength, rotational core control, jump stamina, postural precision, and turnout stability.",
    image: "/images/bulletproofbody.png",
    imageAlt: "Dancer standing en pointe with an overhead port de bras",
  },
];

const GIFT_CERTIFICATE_PDF = "/TBB-Gift-Certificate-final2.pdf";

const faqs = [
  {
    q: "When does the dancer get it?",
    a: (
      <>
        Right away. As soon as you check out, they get an email with everything they need to download the
        app and log in. Their year starts at checkout, and they can start training whenever they’re ready.
        Giving it in person? Download a{" "}
        <a
          href={GIFT_CERTIFICATE_PDF}
          className="underline underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          printable gift certificate
        </a>{" "}
        to put under the tree.
      </>
    ),
  },
  {
    q: "What if my dancer has never lifted before?",
    a: "That’s exactly who TBB is built for. They can choose a beginner program that starts with the fundamentals, with video and form cues for every exercise, and builds up gradually as they get stronger. No experience needed.",
  },
  {
    q: "What if the dancer already has TBB?",
    a: "No problem. Email support@thebarbellballerina.com and we’ll make sure they don’t lose any time they’ve already paid for.",
  },
  {
    q: "Does the gift renew?",
    a: "Yes, at the regular annual price. Turn off auto-renew anytime by emailing support@thebarbellballerina.com.",
  },
  {
    q: "Are flexibility and mobility included?",
    a: "Yes. Stretching and mobility work are built into every program. If they choose a specific goal like higher extensions, there’s even more of it.",
  },
  {
    q: "What age is it for?",
    a: "TBB is built for dancers 13 and up, from pre-professional students to professionals. Dancers under 13 can train with parent supervision and guidance.",
  },
  {
    q: "What equipment do they need?",
    a: "TBB works at the gym or at home. Gym workouts use standard equipment like machines, dumbbells and barbells. Training at home? Every exercise has a swap that only needs dumbbells and basic equipment, so they can train wherever they are.",
  },
  {
    q: "Can I train alongside my dancer on the same account?",
    a: "Each account tracks one person’s workouts and progress, so it’s best for each of you to have your own. Want to train together? Gift one to your dancer and get one for yourself.",
  },
];

function Logo() {
  return (
    <img
      src="/images/logo%201.svg"
      alt="The Barbell Ballerina"
      className="h-10 w-auto"
    />
  );
}

const API_BASE = import.meta.env.VITE_TBB_API_BASE ?? "https://thebarbellballerina.com";
const API_TIERS = { strength: "strength_athlete", performance: "performance_athlete" };
// End of 24 Dec Sydney time; confirm with client.
const OFFER_ENDS_AT = "2026-12-25T00:00:00+11:00";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const UTM_STORAGE_KEY = "tbb_holiday_utm";

function isOfferEnded() {
  return Date.now() >= Date.parse(OFFER_ENDS_AT);
}

// Reads UTM params from the URL on load and keeps them in sessionStorage so they survive in-page navigation.
function readUtm() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) fromUrl[key] = value;
  }
  try {
    if (Object.keys(fromUrl).length > 0) {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    return JSON.parse(window.sessionStorage.getItem(UTM_STORAGE_KEY) ?? "{}") ?? {};
  } catch {
    return fromUrl;
  }
}

function GiftModal({ planId, utm, onClose, onSelect }) {
  const plan = plans.find((item) => item.id === planId) ?? plans[1];
  const [email, setEmail] = useState("");
  const [purchaserEmail, setPurchaserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (!email.includes("@") || loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/checkout/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: API_TIERS[plan.id],
          period: "annual",
          email,
          gift: true,
          ...(purchaserEmail ? { purchaserEmail } : {}),
          ...(Object.keys(utm).length > 0 ? { utm } : {}),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      if (response.status === 409 && data.code === "already_subscribed") {
        setError("This dancer already has an active membership, so there’s nothing to gift right now. Double-check the email, or choose another dancer.");
      } else if (response.status === 410 && data.code === "offer_ended") {
        setError("Sorry, the holiday gift offer has ended, so we can’t start a gift checkout.");
      } else if (response.status === 400 && data.message) {
        setError(data.message);
      } else {
        setError("Something went wrong starting checkout. Please try again in a moment.");
      }
    } catch {
      setError("We couldn’t reach checkout. Please check your connection and try again.");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-4 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-cream p-6 shadow-card sm:p-8"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gift-title"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Holiday gifting 2026</p>
          <button type="button" onClick={onClose} className="text-sm text-stone" aria-label="Close">
            Close
          </button>
        </div>
        <h2 id="gift-title" className="mt-3 font-serif text-4xl leading-[0.95]">
          Give a gift
        </h2>
        <form onSubmit={submit} className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {plans.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={`rounded-md border px-3 py-4 text-left ${
                    item.id === plan.id ? "border-ink bg-ink text-cream" : "border-ink/15 bg-white"
                  }`}
                >
                  <span className="block text-xs uppercase tracking-[0.16em] opacity-70">Annual gift</span>
                  <span className="mt-2 block text-2xl leading-none">{item.name}</span>
                  <span className="mt-2 block text-sm">${item.price}</span>
                </button>
              ))}
            </div>
            <label className="block text-sm text-stone">
              Dancer’s email
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="dancer@email.com"
                className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-ink outline-none focus:border-ink"
              />
            </label>
            <label className="block text-sm text-stone">
              Your email (for the receipt)
              <input
                type="email"
                value={purchaserEmail}
                onChange={(event) => setPurchaserEmail(event.target.value)}
                placeholder="you@email.com (optional)"
                className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-ink outline-none focus:border-ink"
              />
            </label>
            <p className="text-sm leading-relaxed text-stone">
              Use the dancer’s email address at checkout, not your own. Your discount is
              applied automatically at checkout.
            </p>
            {error && (
              <p role="alert" className="text-sm leading-relaxed text-bronze">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-cream disabled:opacity-60"
            >
              {loading ? "Taking you to checkout…" : `Gift ${plan.name} — $${plan.price}`}
            </button>
          </form>
      </div>
    </div>
  );
}

function NextIcon({ children }) {
  return (
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-ink" aria-hidden="true">
      {children}
    </span>
  );
}

function ThankYou() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <div className="mx-auto max-w-[1200px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-serif text-5xl leading-[0.95] sm:text-6xl">Thank You!</h1>
          <p className="mt-5 text-xl">Your gift membership is confirmed.</p>
          <p className="mt-3 text-sm leading-relaxed text-stone">
            The dancer will receive a welcome email with everything they need to download the app and start
            training.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-10 bg-[#FBF7F2] p-6 sm:p-10 lg:grid-cols-2 lg:gap-16">
          <div className="border border-ink/15 bg-white px-8 py-10 text-center">
            <Logo />
            <p className="mx-auto mt-8 max-w-xs font-serif text-4xl leading-[0.95]">
              A year of <span className="text-bronze">strength.</span>
            </p>
            <div className="mx-auto mt-8 max-w-xs space-y-4 text-left text-xs uppercase tracking-[0.16em] text-stone">
              <p className="flex items-end gap-3">
                <span>To</span>
                <span className="mb-1 h-px flex-1 bg-ink/20" />
              </p>
              <p className="flex items-end gap-3">
                <span>From</span>
                <span className="mb-1 h-px flex-1 bg-ink/20" />
              </p>
            </div>
            <p className="mx-auto mt-8 max-w-xs text-[11px] leading-relaxed text-stone">
              This certificate is a gift of strength training, built for ballet dancers.
            </p>
          </div>

          <div className="text-left">
            <p className="text-[11px] uppercase tracking-[0.22em] text-bronze">Gift certificate</p>
            <h2 className="mt-4 max-w-md font-serif text-5xl leading-[0.95] sm:text-6xl">
              Download Your Gift Certificate
            </h2>
            <p className="mt-5 max-w-md text-stone">
              Giving it in person? Print this certificate to put under the tree.
            </p>
            <a
              href={GIFT_CERTIFICATE_PDF}
              download="TBB-Gift-Certificate-final2.pdf"
              className="mt-8 inline-flex items-center gap-3 rounded-md bg-sand px-5 py-4 text-xs font-bold uppercase tracking-[0.25em] text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              Download Gift Certificate (PDF)
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-center">
          <p className="font-serif text-3xl lg:w-44 lg:shrink-0">What’s next?</p>
          <div className="grid flex-1 gap-6 sm:grid-cols-3 sm:divide-x sm:divide-ink/10">
            {[
              ["They’ll get an email", "With app download and login details.", "mail"],
              ["Download the app", "On iPhone or Android and log in with their email.", "phone"],
              ["Start training", "Now or after Nutcracker. It’s ready whenever they are.", "start"],
            ].map(([title, body, icon]) => (
              <div key={title} className="flex gap-3 sm:px-5 sm:first:pl-0">
                <NextIcon>
                  {icon === "mail" && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="1.4" />
                      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  )}
                  {icon === "phone" && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M11 18h2" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  )}
                  {icon === "start" && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M8 6v12l10-6L8 6Z" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  )}
                </NextIcon>
                <div>
                  <p className="text-sm">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-stone">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OfferEnded({ className }) {
  return (
    <button type="button" disabled className={`${className} cursor-not-allowed opacity-60`}>
      Offer ended
    </button>
  );
}

function PlanCard({ plan, offerEnded, onGift }) {
  const dark = plan.tone === "dark";
  return (
    <article
      className={`relative flex flex-col rounded-sm p-8 sm:p-10 ${
        dark ? "bg-ink text-cream" : "bg-white text-ink shadow-card"
      }`}
    >
      {plan.badge && (
        <span className="absolute right-6 top-6 rounded-sm bg-sand px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-ink">
          {plan.badge}
        </span>
      )}
      <p className={`text-[11px] uppercase tracking-[0.22em] ${dark ? "text-bronze" : "text-stone"}`}>
        Annual gift
      </p>
      <h3 className="mt-4 text-4xl tracking-tight">{plan.name}</h3>
      <p className="mt-6 flex items-end gap-3">
        <span className="text-6xl leading-none">${plan.price}</span>
        <span className={`mb-1 text-2xl line-through ${dark ? "text-cream/40" : "text-stone"}`}>
          ${plan.was}
        </span>
      </p>
      <p className="mt-3 text-sm text-bronze">{plan.save}</p>
      <ul className="mb-16 mt-8 flex-1 space-y-3 text-sm">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <span aria-hidden="true">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {offerEnded ? (
        <OfferEnded className={`mt-6 w-full rounded-md px-6 py-4 text-xs font-bold uppercase tracking-[0.22em] ${dark ? "bg-sand text-ink" : "bg-ink text-cream"}`} />
      ) : (
        <button
          type="button"
          onClick={() => onGift(plan.id)}
          className={`mt-6 w-full rounded-md px-6 py-4 text-xs font-bold uppercase tracking-[0.22em] ${
            dark ? "bg-sand text-ink" : "bg-ink text-cream"
          }`}
        >
          Gift {plan.name.split(" ")[0]} — ${plan.price}
        </button>
      )}
    </article>
  );
}

function Programs() {
  const [active, setActive] = useState(null);

  return (
    <section id="programs" className="bg-white text-ink">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-10">
        <div className="flex flex-col gap-6 border-t border-ink/10 pt-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="font-serif text-4xl leading-[0.95] sm:text-5xl">Five programs. Built for ballet.</h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-stone">
              Purpose-built programs for stronger technique, resilient movement, and confident performance.
            </p>
          </div>
          <p className="hidden text-[11px] font-medium uppercase tracking-[0.28em] text-stone sm:block">
            Hover to explore
          </p>
        </div>

        <ul className="mt-10">
          {programs.map((program) => {
            const open = active === program.n;

            return (
              <li
                key={program.n}
                className="border-t border-ink/10 last:border-b"
                onMouseEnter={() => setActive(program.n)}
                onMouseLeave={() => setActive(null)}
              >
                <button
                  type="button"
                  className="w-full cursor-pointer text-left"
                  aria-expanded={open}
                  onClick={() => setActive(open ? null : program.n)}
                >
                  <FeaturedProgram program={program} open={open} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function FeaturedProgram({ program, open }) {
  return (
    <div data-open={open} className={`program-featured ${open ? "py-8 lg:py-10" : "py-6"}`}>
      <div className="relative flex min-w-0 items-start gap-5 sm:gap-8">
        <span className="mt-1 w-8 shrink-0 text-lg text-bronze">{program.n}</span>
        <div className="min-w-0 flex-1 sm:pr-40">
          <div data-open={open} className="reveal">
            <div className="reveal-inner">
              <p className="pb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-bronze">
                {program.tag}
              </p>
            </div>
          </div>
          <span className="block font-serif text-2xl leading-[1.15] sm:text-[1.85rem]">{program.title}</span>
          <span
            className={`mt-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-stone sm:hidden ${
              open ? "hidden" : ""
            }`}
          >
            {program.tag}
          </span>
          <div data-open={open} className="reveal">
            <div className="reveal-inner">
              <p className="max-w-xl pt-4 text-[15px] leading-relaxed text-stone">{program.copy}</p>
            </div>
          </div>
        </div>
        <span
          className={`absolute right-0 top-1/2 hidden -translate-y-1/2 text-[10px] font-medium uppercase tracking-[0.22em] text-stone transition-opacity duration-500 sm:block ${
            open ? "opacity-0" : "opacity-100 delay-75"
          }`}
        >
          {program.tag}
        </span>
      </div>

      <div data-open={open} className="program-image lg:pl-10">
        <div className="reveal-inner">
          <div
            className={`relative mt-5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:mt-0 ${
              open ? "translate-x-0 opacity-100 delay-75" : "pointer-events-none translate-x-5 opacity-0"
            }`}
          >
            <img src={program.image} alt={program.imageAlt} className="h-auto w-full object-contain object-center" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [openFaq, setOpenFaq] = useState(0);
  const [giftPlan, setGiftPlan] = useState(null);
  const [legal, setLegal] = useState(null);
  const [giftStatus] = useState(() => new URLSearchParams(window.location.search).get("gift"));
  const [utm] = useState(readUtm);
  const offerEnded = isOfferEnded();

  if (giftStatus === "success") return <ThankYou />;

  return (
    <div className="bg-cream text-ink">
      {giftStatus === "cancelled" && (
        <p className="bg-sand px-6 py-3 text-center text-sm text-ink">
          Checkout was cancelled, so no payment was taken. You can start your gift again whenever you’re ready.
        </p>
      )}
      <header className="bg-ink text-cream">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6 lg:px-10">
          <Logo />
          <a
            href="#plans"
            className="rounded-md bg-sand px-5 py-2.5 text-xs font-bold uppercase tracking-[0.25em] text-ink"
          >
            Give a gift
          </a>
        </div>

        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 pb-20 pt-8 lg:grid-cols-2 lg:px-10 lg:pb-28">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-bronze">Holiday gifting 2026</p>
            <h1 className="mt-6 font-serif text-5xl leading-[0.95] sm:text-7xl">
              Give the Gift
              <br />
              of Strength.
            </h1>
            <p className="mt-4 font-serif text-4xl leading-[0.95] text-bronze sm:text-6xl">
              to the dancer in
              <br />
              your life.
            </p>
            <p className="mt-8 max-w-md text-base leading-relaxed text-cream/75">
              A year of strength training built specifically for ballet dancers. Fewer injuries, higher
              jumps, cleaner turns, and a body ready for every rehearsal, audition and performance.
            </p>
            <p className="mt-4 text-cream/85">Buy it now. It’s ready whenever they are.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {offerEnded ? (
                <OfferEnded className="rounded-md bg-sand px-5 py-3 text-xs font-bold uppercase tracking-[0.25em] text-ink" />
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setGiftPlan("performance")}
                    className="rounded-md bg-sand px-5 py-3 text-xs font-bold uppercase tracking-[0.25em] text-ink"
                  >
                    Gift Performance — $299
                  </button>
                  <button
                    type="button"
                    onClick={() => setGiftPlan("strength")}
                    className="rounded-md border border-cream/30 px-5 py-3 text-xs font-bold uppercase tracking-[0.25em] text-cream"
                  >
                    Gift Strength — $199
                  </button>
                </>
              )}
            </div>
            <p className="mt-5 text-xs text-cream/50">
              Holiday offer ends December 24, 2026, at midnight.
            </p>
          </div>

          <figure className="relative">
            <img
              src={HERO_IMAGE}
              alt="A dancer training with strength and control"
              className="h-auto w-full"
            />
            <div
              className="pointer-events-none absolute border border-[#D7C0A6]"
              style={{ inset: "4.5%" }}
              aria-hidden="true"
            />
            <figcaption className="absolute bottom-[4.5%] left-1/2 flex -translate-x-1/2 translate-y-1/2 items-center gap-2 bg-cream px-3 py-1.5 text-[11px] text-ink">
              <img src="/images/gift%201.svg" alt="" className="h-3.5 w-3.5" />
              A full year · Digital gift
            </figcaption>
          </figure>
        </div>
      </header>

      <div className="flex min-h-[84px] items-center justify-center bg-white px-6 text-stone">
        <p className="flex flex-wrap items-center justify-center gap-y-2 py-[30px] text-base leading-6">
          <span>Sports medicine physician approved</span>
          <span className="inline-flex items-center">
            <span aria-hidden="true" className="mx-3 h-1.5 w-1.5 shrink-0 rounded-full bg-stone sm:mx-[60px]" />
            Created by professional ballerina <span className="ml-1 font-bold"> Lili Pfeifer</span>
          </span>
          <span className="inline-flex items-center">
            <span aria-hidden="true" className="mx-3 h-1.5 w-1.5 shrink-0 rounded-full bg-stone sm:mx-[60px]" />
            100,000+ community
          </span>
          <span className="inline-flex items-center">
            <span aria-hidden="true" className="mx-3 h-1.5 w-1.5 shrink-0 rounded-full bg-stone sm:mx-[60px]" />
            iPhone & Android
          </span>
        </p>
      </div>

      <section id="plans" className="mx-auto max-w-[1200px] px-6 py-24 lg:px-10">
        <p className="text-[11px] uppercase tracking-[0.24em] text-bronze">The holiday gift</p>
        <h2 className="mt-4 max-w-xl font-serif text-5xl leading-[0.95] sm:text-6xl">
          A Year of Strength.
          <span className="mt-2 block text-bronze">A Gift That Lasts.</span>
        </h2>
        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-2">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} offerEnded={offerEnded} onGift={setGiftPlan} />
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-stone">
          Annual memberships only. Offer ends December 24, 2026, at midnight. Subscriptions renew at
          the regular annual price.
        </p>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-24 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <h2 className="font-serif text-5xl leading-[0.95] sm:text-7xl">
            Gifting Made
            <span className="block text-bronze">Simple.</span>
          </h2>
          <p className="max-w-sm text-lg leading-relaxed text-stone">
            Three easy steps to give the dancer in your life a full year of strength.
          </p>
        </div>
        <ol className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          <span aria-hidden="true" className="absolute inset-x-0 top-3 hidden border-t border-[#DDD4C8] md:block" />
          {[
            ["/images/mouse-pointer-click%201.svg", "01", "Choose a Plan", "Select Strength Athlete or Performance Athlete."],
            ["/images/ticket%201.svg", "02", "Get the Holiday Discount", "Your discount is applied automatically at checkout."],
            ["/images/mail%201.svg", "03", "Use the Dancer’s Email", "Use the dancer’s email. They’ll get their welcome email right away, so they can start now or save it for after Nutcracker."],
          ].map(([icon, n, title, body], index) => (
            <li key={n} className="relative border-t border-[#DDD4C8] pt-8 md:border-0 md:pt-0">
              <span
                className={`absolute left-0 top-0 z-10 -translate-y-1/2 bg-cream md:top-3 ${
                  index === 0 ? "-mr-3 pr-3" : "-mx-3 px-3"
                }`}
              >
                <img src={icon} alt="" className="h-6 w-6" />
              </span>
              <p className="text-xs text-bronze md:mt-12">{n}</p>
              <h3 className="mt-3 text-3xl tracking-tight">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone">{body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex gap-5 bg-ink px-6 py-8 text-cream sm:px-10">
          <span className="mt-1 text-2xl leading-none text-bronze" aria-hidden="true">
            ✉
          </span>
          <div>
            <p className="font-serif text-3xl leading-tight sm:text-4xl">
              Important: Use the dancer’s email address at checkout,{" "}
              <span className="text-bronze">not your own.</span>
            </p>
            <p className="mt-3 text-sm text-cream/70">
              Their annual subscription begins at checkout, but they can start training whenever they’re
              ready.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] items-start gap-x-16 gap-y-12 px-6 pb-24 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-bronze">Why gift TBB</p>
          <h2 className="mt-5 font-serif text-5xl leading-[0.95] sm:text-6xl">
            More Than a Gift.
            <span className="mt-2 block text-bronze">
              Strength for Every
              <br />
              Performance.
            </span>
          </h2>
          <img
            src={STUDIO_IMAGE}
            alt="Dancers preparing for the stage"
            className="mt-10 w-full"
          />
        </div>
        <ol className="lg:pt-12">
          {reasons.map((reason) => (
            <li
              key={reason.n}
              className="grid grid-cols-[2.25rem_1fr] items-start gap-x-3 border-t border-ink/10 py-6 last:border-b"
            >
              <p className="pt-1.5 text-xs text-bronze">{reason.n}</p>
              <div>
                <h3 className="text-3xl tracking-tight">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{reason.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="method" className="bg-black text-cream">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-bronze">The method</p>
            <h2 className="mt-4 font-serif text-5xl leading-[0.95] sm:text-6xl">
              The new standard for ballet training.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/75">
              Programs built for ballet. Guided workouts. A weekly structure you can follow.
            </p>
            <blockquote className="mt-10 max-w-md border-l border-bronze pl-5">
              <p className="font-serif text-2xl leading-snug">
                “My footwork, jump height, power and stamina have all improved dramatically.”
              </p>
              <footer className="mt-4 text-[11px] uppercase tracking-[0.18em] text-bronze">
                Hannah A., TBB Athlete
              </footer>
            </blockquote>
          </div>
          <div className="flex justify-center">
            <img
              src="/images/workout.png"
              alt="A workout screen showing trap bar deadlift"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20 lg:px-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Built by dancers</p>
          <h2 className="mt-5 max-w-xl font-serif text-5xl leading-[0.95] sm:text-6xl">
            Made by Dancers.
            <span className="mt-1 block text-bronze">Loved by Dancers.</span>
          </h2>
          <div className="mt-16 grid gap-y-12 md:grid-cols-3 md:gap-x-[60px]">
            {[
              [
                "Thank you for being one of the few women who inspire young dancers to be strong and healthy. I highly recommend your programs to my senior level students.",
                "Cherize, dance teacher & TBB athlete",
              ],
              [
                "I injured my knee and it had been really difficult to get back into dance. Now I’m jumping pain-free! I feel so much stronger, more dynamic, and more confident in my movement.",
                "Justine, TBB athlete",
              ],
              [
                "I’ve never been a turner and always struggled hopping in my doubles. Suddenly I’m doing consistent clean triples.",
                "Shenandoah, TBB athlete",
              ],
            ].map(([quote, name]) => (
              <blockquote key={name}>
                <p className="font-serif text-[22px] leading-[1.45]">“{quote}”</p>
                <footer className="mt-5 text-[11px] uppercase tracking-[0.18em] text-stone">{name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <Programs />

      <section id="faq" className="bg-white">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 pb-24 pt-16 lg:grid-cols-[0.7fr_1.3fr] lg:px-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">FAQ</p>
            <h2 className="mt-4 font-serif text-5xl leading-[0.95] sm:text-6xl">Gifting questions.</h2>
          </div>
          <div className="border-t border-ink/10">
          {faqs.map((item, index) => {
            const open = openFaq === index;
            return (
              <div key={item.q} className="border-b border-ink/10">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? -1 : index)}
                >
                  <span>{item.q}</span>
                  <span aria-hidden="true" className="text-xl text-stone">
                    {open ? "–" : "+"}
                  </span>
                </button>
                {open && <p className="pb-5 pr-10 text-sm leading-relaxed text-stone">{item.a}</p>}
              </div>
            );
          })}
          </div>
        </div>
      </section>

      <section className="bg-ink px-6 py-24 text-center text-cream">
        <p className="text-[11px] uppercase tracking-[0.24em] text-bronze">Holiday gifting 2026</p>
        <h2 className="mx-auto mt-6 max-w-3xl font-serif text-5xl leading-[0.95] sm:text-7xl">
          Give Them a <span className="text-bronze">Stronger Year.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-cream/75">
          The perfect gift for the dancer who gives everything to their craft.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {offerEnded ? (
            <OfferEnded className="rounded-md bg-sand px-5 py-3 text-xs font-bold uppercase tracking-[0.25em] text-ink" />
          ) : (
            <>
              <button
                type="button"
                onClick={() => setGiftPlan("performance")}
                className="rounded-md bg-sand px-5 py-3 text-xs font-bold uppercase tracking-[0.25em] text-ink"
              >
                Gift Performance — $299
              </button>
              <button
                type="button"
                onClick={() => setGiftPlan("strength")}
                className="rounded-md border border-cream/30 px-5 py-3 text-xs font-bold uppercase tracking-[0.25em]"
              >
                Gift Strength — $199
              </button>
            </>
          )}
        </div>
        <p className="mt-8 text-sm text-cream/60">Your discount is applied automatically at checkout.</p>
        <p className="mt-1 text-sm text-cream/60">Offer ends December 24 at midnight.</p>
      </section>

      <footer className="bg-ink text-cream">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 border-t border-cream/10 px-6 py-6 lg:px-10">
          <Logo />
          <nav className="flex gap-6 text-sm text-cream/70">
            <a href="#method">Learn more</a>
            <button type="button" onClick={() => setLegal("privacy")}>
              Privacy
            </button>
            <button type="button" onClick={() => setLegal("terms")}>
              Terms
            </button>
            <a href="#faq">Contact</a>
          </nav>
        </div>
      </footer>

      {giftPlan && !offerEnded && (
        <GiftModal
          planId={giftPlan}
          utm={utm}
          onClose={() => setGiftPlan(null)}
          onSelect={setGiftPlan}
        />
      )}

      {legal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4" onClick={() => setLegal(null)}>
          <div className="max-w-md rounded-2xl bg-cream p-8" onClick={(event) => event.stopPropagation()}>
            <h2 className="font-serif text-4xl">{legal === "privacy" ? "Privacy" : "Terms"}</h2>
            <p className="mt-4 leading-relaxed text-stone">
              {legal === "privacy"
                ? "This local preview does not send the dancer’s email anywhere. It stays in your browser."
                : "Annual memberships only. Offer ends December 24, 2026, at midnight. Subscriptions renew at the regular annual price."}
            </p>
            <button type="button" className="mt-6 text-sm underline" onClick={() => setLegal(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
