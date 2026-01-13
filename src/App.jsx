import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  CheckCircle2,
  Clock,
  CreditCard,
  Headphones,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Wallet,
} from "lucide-react";

/**
 * Nomo Luxe Car Rental — GitHub-ready website (Vite + React + Tailwind)
 *
 * ✅ Booking flow: submit to Google Sheet without showing Google Form
 * This posts to Google Forms `formResponse` and targets a hidden iframe.
 */

const BRAND = {
  name: "Nomo Luxe Car Rental",
  tagline: "Premium comfort for travelers, professionals, and corporate trips.",
  locationLabel: "Maryland • DC • Virginia",
  phone: "315-553-4600",
  email: "info@nomoluxe.com",
  ig: "@nomoluxe",
};

const NO_PREFERENCE = "no_preference";

const GOOGLE_FORM = {
  actionUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSdWV8ATUPXi3eTqj5xSAKyK8H5h5__8wS0zUpcfsG6xn8MSEA/formResponse",
  entry: {
    name: "entry.817883833",
    phone: "entry.1461332940",
    email: "entry.212462957",
    requestType: "entry.1044660157",
    vehicle: "entry.641811247",
    start: "entry.783591310",
    end: "entry.205748647",
    pickupArea: "entry.1534624009",
    message: "entry.606500971",
    acknowledgment: "entry.950095108",
  },
  values: {
    ack:
      "I understand this is a booking request and availability is not guaranteed until confirmed by Nomo Luxe Car Rental.",
  },
};

const fleet = [
  {
    id: "corolla2015",
    name: "Toyota Corolla (2015 • Grey)",
    tier: "Comfort",
    seats: 5,
    bags: 2,
    mpg: "30–40",
    dailyFrom: 55,
    featured: false,
    perks: ["Fuel efficient", "Easy city parking", "Great for errands & commuting"],
  },
  {
    id: "corolla2023",
    name: "Toyota Corolla (2023 • White)",
    tier: "Comfort",
    seats: 5,
    bags: 2,
    mpg: "30–41",
    dailyFrom: 65,
    featured: true,
    perks: ["Newer model comfort", "Great fuel economy", "Perfect for travelers & professionals"],
  },
  {
    id: "e300",
    name: "Mercedes-Benz E300",
    tier: "Executive",
    seats: 5,
    bags: 3,
    mpg: "22–30",
    dailyFrom: 150,
    featured: false,
    perks: ["Luxury sedan comfort", "Quiet premium cabin", "Business-ready presence"],
  },
  {
    id: "gx460",
    name: "Lexus GX 460",
    tier: "Luxe SUV",
    seats: 7,
    bags: 5,
    mpg: "15–19",
    dailyFrom: 250,
    featured: false,
    perks: ["3-row SUV", "Premium comfort", "Great for families & luggage"],
  },
  {
    id: "g63",
    name: "Mercedes-Benz G63",
    tier: "Ultra Luxe",
    seats: 5,
    bags: 4,
    mpg: "13–17",
    dailyFrom: 950,
    featured: false,
    perks: ["Iconic presence", "VIP experience", "Event-ready and unforgettable"],
  },
];

const faqs = [
  {
    q: "How does pickup & drop-off work?",
    a: "For direct rentals, we coordinate a convenient pickup location and time after your request is approved. Delivery can be requested for an additional fee depending on distance and availability.",
  },
  {
    q: "What do I need to book?",
    a: "A valid driver’s license, a verified payment method, and basic identity verification. We’ll send a quick checklist after you submit your request.",
  },
  {
    q: "Is there a security deposit?",
    a: "Some rentals require a refundable security deposit depending on vehicle tier, trip length, and verification. Details are shared during confirmation before payment.",
  },
  {
    q: "Do you offer corporate or long-term rentals?",
    a: "Yes. We offer custom weekly/monthly pricing and corporate options. Use the contact form and select “Corporate / Long-Term Rental”.",
  },
  {
    q: "Are there mileage limits?",
    a: "Mileage terms vary by vehicle tier and trip length. Your confirmation message will include the exact mileage policy for your booking.",
  },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function daysBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0;
  const ms = e.getTime() - s.getTime();
  const d = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(0, d);
}

function toGoogleVehicleValue(vehicleIdOrSentinel) {
  const map = {
    [NO_PREFERENCE]: "No preference",
    corolla2015: "Toyota Corolla 2015 - Grey",
    corolla2023: "Toyota Corolla 2023 - White",
    e300: "Mercedes-Benz E300",
    gx460: "Lexus GX 460",
    g63: "Mercedes-Benz G63",
  };
  return map[vehicleIdOrSentinel ?? NO_PREFERENCE] ?? "No preference";
}

// Minimal UI primitives
function Card({ className = "", children }) {
  return <div className={cn("border bg-white", className)}>{children}</div>;
}
function CardHeader({ className = "", children }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}
function CardContent({ className = "", children }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}
function CardTitle({ className = "", children }) {
  return <div className={cn("text-lg font-semibold", className)}>{children}</div>;
}
function Button({ className = "", variant = "default", size = "md", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition rounded-xl focus:outline-none focus:ring-2 focus:ring-black/30 disabled:opacity-50 disabled:pointer-events-none";
  const sizes = { sm: "h-9 px-3 text-sm", md: "h-10 px-4 text-sm", lg: "h-11 px-5 text-base" };
  const variants = {
    default: "bg-black text-white hover:bg-black/90",
    secondary: "bg-white text-black border hover:bg-black/5",
    ghost: "bg-transparent hover:bg-black/5",
  };
  return (
    <button
      className={cn(base, sizes[size] ?? sizes.md, variants[variant] ?? variants.default, className)}
      {...props}
    />
  );
}
function Badge({ className = "", variant = "default", children }) {
  const variants = { default: "bg-black text-white", secondary: "bg-black/5 text-black border" };
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs", variants[variant] ?? variants.default, className)}>
      {children}
    </span>
  );
}
function Input({ className = "", ...props }) {
  return <input className={cn("w-full h-10 rounded-2xl border px-3 bg-white text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20", className)} {...props} />;
}
function Label({ className = "", children }) {
  return <label className={cn("text-sm font-medium", className)}>{children}</label>;
}
function Textarea({ className = "", ...props }) {
  return <textarea className={cn("w-full rounded-2xl border px-3 py-2 bg-white text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20", className)} {...props} />;
}
function Separator({ className = "" }) {
  return <div className={cn("h-px w-full bg-black/10", className)} />;
}

function TopNav({ page, setPage }) {
  const items = [
    { key: "home", label: "Home" },
    { key: "fleet", label: "Fleet" },
    { key: "pricing", label: "Pricing" },
    { key: "faq", label: "FAQ" },
    { key: "contact", label: "Contact" },
  ];
  return (
    <div className="sticky top-0 z-40 bg-white/75 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <button onClick={() => setPage("home")} className="flex items-center gap-2" aria-label="Go to home">
          <div className="h-9 w-9 rounded-2xl bg-black text-white grid place-items-center shadow-sm">
            <Car className="h-5 w-5" />
          </div>
          <div className="leading-tight text-left">
            <div className="font-semibold">{BRAND.name}</div>
            <div className="text-xs text-black/60">{BRAND.locationLabel}</div>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {items.map((it) => (
            <Button key={it.key} variant={page === it.key ? "default" : "ghost"} size="sm" onClick={() => setPage(it.key)} className="rounded-xl">
              {it.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="rounded-xl" onClick={() => setPage("contact")}>
            Request a Booking
          </Button>
          <div className="md:hidden">
            <select className="h-9 rounded-xl border px-3 bg-white" value={page} onChange={(e) => setPage(e.target.value)}>
              {items.map((it) => (
                <option key={it.key} value={it.key}>{it.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({ goBook }) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-white" />
      <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-14 md:pt-16 md:pb-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">Direct rentals • Fast confirmation</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }} className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-white">
              Drive with confidence.
              <span className="block text-white/80">Arrive like you mean it.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }} className="mt-4 text-base md:text-lg text-white/80 max-w-xl">
              {BRAND.tagline} Transparent pricing, clean vehicles, and a smooth pickup experience.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.15 }} className="mt-6 flex flex-wrap items-center gap-3">
              <Button onClick={goBook} className="rounded-2xl h-11 px-5" size="lg">Request a Booking</Button>
              <Button variant="secondary" onClick={() => document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" })} className="rounded-2xl h-11 px-5" size="lg">Browse Fleet</Button>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>Verified renters • Flexible options</span>
              </div>
            </motion.div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <MiniStat icon={<Star className="h-4 w-4" />} label="Top-rated" value="5.0" />
              <MiniStat icon={<Clock className="h-4 w-4" />} label="Fast replies" value="< 1 hr" />
              <MiniStat icon={<Wallet className="h-4 w-4" />} label="Fair pricing" value="No surprises" />
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Card className="rounded-3xl border-white/20 bg-white/10 text-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Quick Quote</CardTitle>
                <div className="text-sm text-white/70">Get an estimated total before you request a booking.</div>
              </CardHeader>
              <CardContent>
                <QuickQuote goBook={goBook} />
                <Separator className="my-5 bg-white/15" />
                <div className="grid gap-3 text-sm">
                  {["Clean vehicles, every trip","Pickup, delivery, or meet-up options","Support when you need it"].map((t)=>(
                    <div key={t} className="flex items-center gap-2 text-white/80">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
      <div className="flex items-center gap-2 text-white/80 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1 text-white font-semibold">{value}</div>
    </div>
  );
}

function QuickQuote({ goBook }) {
  const [carId, setCarId] = useState(fleet.find((c) => c.featured)?.id ?? fleet[0].id);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [delivery, setDelivery] = useState("no");

  const selected = useMemo(() => fleet.find((c) => c.id === carId) ?? fleet[0], [carId]);
  const days = useMemo(() => daysBetween(start, end) || 1, [start, end]);

  const deliveryFee = delivery === "yes" ? 25 : 0;
  const est = useMemo(() => selected.dailyFrom * days + deliveryFee, [selected, days, deliveryFee]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label className="text-white/80">Vehicle</Label>
        <select className="h-10 rounded-2xl border border-white/20 bg-white/10 text-white px-3" value={carId} onChange={(e) => setCarId(e.target.value)}>
          {fleet.map((c) => (
            <option key={c.id} value={c.id} className="text-black">
              {c.name} • from {formatMoney(c.dailyFrom)}/day
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label className="text-white/80">Start</Label>
          <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="border-white/20 bg-white/10 text-white" />
        </div>
        <div className="grid gap-2">
          <Label className="text-white/80">End</Label>
          <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="border-white/20 bg-white/10 text-white" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label className="text-white/80">Delivery needed?</Label>
        <select className="h-10 rounded-2xl border border-white/20 bg-white/10 text-white px-3" value={delivery} onChange={(e) => setDelivery(e.target.value)}>
          <option value="no" className="text-black">No</option>
          <option value="yes" className="text-black">Yes (adds {formatMoney(25)})</option>
        </select>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm text-white/70">Estimated total</div>
            <div className="text-2xl font-semibold text-white">{formatMoney(est)}</div>
            <div className="mt-1 text-xs text-white/60">Estimate only. Taxes/fees and exact terms depend on confirmation.</div>
          </div>
          <div className="text-right text-sm text-white/70">
            <div>{days} day(s)</div>
            <div>{formatMoney(selected.dailyFrom)}/day</div>
          </div>
        </div>
      </div>

      <Button onClick={goBook} className="rounded-2xl h-11" size="lg">Request this booking</Button>
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="max-w-3xl">
      <div className="text-sm text-black/60">{eyebrow}</div>
      <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      {subtitle ? <p className="mt-3 text-black/60 text-base md:text-lg">{subtitle}</p> : null}
    </div>
  );
}

function ValueProps() {
  const items = [
    { icon: <ShieldCheck className="h-5 w-5" />, title: "Clean & reliable", desc: "Every vehicle is inspected and cleaned before each trip." },
    { icon: <CreditCard className="h-5 w-5" />, title: "Transparent pricing", desc: "Clear daily rates and upfront expectations—no guesswork." },
    { icon: <Headphones className="h-5 w-5" />, title: "Real support", desc: "Quick responses and guidance from pickup to drop-off." },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-18">
      <SectionTitle eyebrow="Why Nomo Luxe" title="Premium experience without premium hassle" subtitle="Perfect for airport travel, business trips, and weekends—built around comfort, speed, and trust." />
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {items.map((it) => (
          <Card key={it.title} className="rounded-3xl">
            <CardContent className="p-6 pt-6">
              <div className="h-11 w-11 rounded-2xl bg-black text-white grid place-items-center shadow-sm">{it.icon}</div>
              <div className="mt-4 font-semibold text-lg">{it.title}</div>
              <div className="mt-2 text-black/60">{it.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FleetSection({ onBook }) {
  const [tier, setTier] = useState("all");
  const [q, setQ] = useState("");

  const tiers = useMemo(() => ["all", ...Array.from(new Set(fleet.map((c) => c.tier)))], []);
  const filtered = useMemo(
    () =>
      fleet
        .filter((c) => (tier === "all" ? true : c.tier === tier))
        .filter((c) => `${c.name} ${c.tier} ${c.perks.join(" ")}`.toLowerCase().includes(q.trim().toLowerCase())),
    [tier, q]
  );

  return (
    <div id="fleet" className="mx-auto max-w-6xl px-4 py-14 md:py-18">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <SectionTitle eyebrow="Fleet" title="Choose your ride" subtitle="Comfort, Executive, or Luxe—pick the level that matches your trip." />
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="w-full sm:w-[160px]">
            <select className="h-10 w-full rounded-2xl border px-3 bg-white" value={tier} onChange={(e) => setTier(e.target.value)}>
              {tiers.map((t) => <option key={t} value={t}>{t === "all" ? "All tiers" : t}</option>)}
            </select>
          </div>
          <div className="w-full sm:w-[220px]">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search fleet…" className="rounded-2xl" />
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <Card key={c.id} className="rounded-3xl overflow-hidden">
            <CardHeader className="pb-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-xl">{c.name}</CardTitle>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full">{c.tier}</Badge>
                    {c.featured ? <Badge className="rounded-full">Most popular</Badge> : null}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-black/60">from</div>
                  <div className="text-2xl font-semibold">{formatMoney(c.dailyFrom)}</div>
                  <div className="text-sm text-black/60">per day</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-6">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <Spec label="Seats" value={c.seats} />
                <Spec label="Bags" value={c.bags} />
                <Spec label="MPG" value={c.mpg} />
              </div>
              <div className="mt-4 grid gap-2 text-sm">
                {c.perks.map((p) => (
                  <div key={p} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5" />
                    <span className="text-black/60">{p}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => onBook(c.id)} className="mt-5 w-full rounded-2xl" size="lg">Request this vehicle</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div className="rounded-2xl border p-3">
      <div className="text-xs text-black/60">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function PricingSection({ goBook }) {
  const rows = [
    { tier: "Comfort", bestFor: "Daily commuting, errands, city trips", includes: ["Fuel efficient options", "Easy pickup", "Fast confirmation"] },
    { tier: "Executive", bestFor: "Business travel, meetings, airport runs", includes: ["Premium sedan comfort", "Quiet ride", "Professional presence"] },
    { tier: "Luxe SUV", bestFor: "Family trips, luggage, road trips", includes: ["3-row capability", "Premium comfort", "Confident driving"] },
    { tier: "Ultra Luxe", bestFor: "VIP trips, events, standout luxury", includes: ["Iconic vehicle", "High-end experience", "Event-ready presence"] },
  ];
  return (
    <div className="bg-black/5">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-18">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionTitle eyebrow="Pricing" title="Simple rates. Clear expectations." subtitle="Daily pricing varies by season and availability. Request a booking for the exact quote." />
          <Button onClick={goBook} className="rounded-2xl" size="lg">Get an exact quote</Button>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {rows.map((r) => (
            <Card key={r.tier} className="rounded-3xl">
              <CardContent className="p-6 pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">{r.tier}</div>
                  <Badge variant="secondary" className="rounded-full">
                    from {formatMoney(fleet.filter((c) => c.tier === r.tier).reduce((min, c) => Math.min(min, c.dailyFrom), Infinity))}/day
                  </Badge>
                </div>
                <div className="mt-2 text-black/60">{r.bestFor}</div>
                <div className="mt-5 grid gap-2 text-sm">
                  {r.includes.map((x) => (
                    <div key={x} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5" />
                      <span className="text-black/60">{x}</span>
                    </div>
                  ))}
                </div>
                <Button onClick={goBook} variant="secondary" className="mt-6 w-full rounded-2xl" size="lg">Request a booking</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-18">
      <SectionTitle eyebrow="FAQ" title="Questions, answered" subtitle="If you don’t see your question here, message us and we’ll respond quickly." />
      <div className="mt-8 grid gap-3">
        {faqs.map((f, i) => (
          <button key={f.q} onClick={() => setOpen(i === open ? -1 : i)} className="text-left">
            <Card className="rounded-3xl">
              <CardContent className="p-6 pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">{f.q}</div>
                    <AnimatePresence initial={false}>
                      {open === i ? (
                        <motion.div key="a" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="mt-2 text-black/60">
                          {f.a}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                  <div className={cn("text-sm", open === i ? "text-black" : "text-black/60")}>{open === i ? "–" : "+"}</div>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}

function ContactSection({ selectedVehicleId, clearSelected }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const formEl = useRef(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    bookingType: "Standard Rental",
    vehicle: selectedVehicleId ?? NO_PREFERENCE,
    start: "",
    end: "",
    pickupArea: "",
    message: "",
    acknowledgment: false,
  });

  useEffect(() => {
    if (selectedVehicleId) setForm((p) => ({ ...p, vehicle: selectedVehicleId }));
  }, [selectedVehicleId]);

  function update(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function validate() {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!form.phone.trim()) return "Please enter your phone number.";
    if (!form.email.trim()) return "Please enter your email.";
    if (!form.start) return "Please select a start date.";
    if (!form.end) return "Please select an end date.";
    if (!form.acknowledgment) return "Please check the acknowledgment box.";
    return "";
  }

  function onSubmit(e) {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      setStatus("error");
      return;
    }
    setError("");
    setStatus("sending");
    formEl.current?.submit(); // submit into hidden iframe
    setStatus("sent");
    setForm((p) => ({ ...p, start: "", end: "", pickupArea: "", message: "", acknowledgment: false }));
  }

  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-18">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
              <Phone className="h-4 w-4" />
              <span className="text-sm">Quick response</span>
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">Request a booking</h2>
            <p className="mt-3 text-white/75">
              Submit details below and we’ll confirm availability, verification steps, and final pricing for your direct rental.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="flex items-center gap-3 text-white/80">
                <div className="h-9 w-9 rounded-2xl border border-white/15 bg-white/10 grid place-items-center"><MapPin className="h-4 w-4" /></div>
                <div className="text-sm">{BRAND.locationLabel}</div>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="h-9 w-9 rounded-2xl border border-white/15 bg-white/10 grid place-items-center"><Phone className="h-4 w-4" /></div>
                <div className="text-sm">{BRAND.phone}</div>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="h-9 w-9 rounded-2xl border border-white/15 bg-white/10 grid place-items-center"><Car className="h-4 w-4" /></div>
                <div className="text-sm">{BRAND.ig}</div>
              </div>
            </div>

            {selectedVehicleId ? (
              <div className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-5">
                <div className="text-sm text-white/70">Selected vehicle</div>
                <div className="mt-1 text-lg font-semibold">{fleet.find((c) => c.id === selectedVehicleId)?.name ?? ""}</div>
                <Button type="button" variant="secondary" className="mt-4 rounded-2xl" onClick={() => { clearSelected(); update("vehicle", NO_PREFERENCE); }}>
                  Clear selection
                </Button>
              </div>
            ) : null}
          </div>

          <Card className="rounded-3xl border-white/15 bg-white/10 text-white">
            <CardContent className="p-6 pt-6">
              <iframe name="hidden_iframe" title="hidden_iframe" className="hidden" />

              <form
                ref={formEl}
                onSubmit={onSubmit}
                action={GOOGLE_FORM.actionUrl}
                method="POST"
                target="hidden_iframe"
                className="grid gap-4"
              >
                {/* Hidden fields for Google dropdown/multiple choice (option text) */}
                <input type="hidden" name={GOOGLE_FORM.entry.vehicle} value={toGoogleVehicleValue(form.vehicle)} />
                <input type="hidden" name={GOOGLE_FORM.entry.requestType} value={form.bookingType} />
                <input type="hidden" name={GOOGLE_FORM.entry.acknowledgment} value={form.acknowledgment ? GOOGLE_FORM.values.ack : ""} />

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label className="text-white/80">Full name</Label>
                    <Input name={GOOGLE_FORM.entry.name} value={form.name} onChange={(e) => update("name", e.target.value)} className="border-white/15 bg-white/10 text-white placeholder:text-white/40" placeholder="Your name" required />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white/80">Phone</Label>
                    <Input name={GOOGLE_FORM.entry.phone} value={form.phone} onChange={(e) => update("phone", e.target.value)} className="border-white/15 bg-white/10 text-white placeholder:text-white/40" placeholder="(555) 123-4567" required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label className="text-white/80">Email</Label>
                    <Input name={GOOGLE_FORM.entry.email} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="border-white/15 bg-white/10 text-white placeholder:text-white/40" placeholder="you@email.com" required />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white/80">Request type</Label>
                    <select className="h-10 rounded-2xl border border-white/15 bg-white/10 text-white px-3" value={form.bookingType} onChange={(e) => update("bookingType", e.target.value)}>
                      <option className="text-black" value="Standard Rental">Standard Rental</option>
                      <option className="text-black" value="Corporate / Long-Term Rental">Corporate / Long-Term Rental</option>
                      <option className="text-black" value="Delivery Request">Delivery Request</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-white/80">Preferred vehicle</Label>
                  <select className="h-10 rounded-2xl border border-white/15 bg-white/10 text-white px-3" value={form.vehicle} onChange={(e) => update("vehicle", e.target.value)}>
                    <option className="text-black" value={NO_PREFERENCE}>(No preference)</option>
                    {fleet.map((c) => <option key={c.id} className="text-black" value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label className="text-white/80">Start date</Label>
                    <Input name={GOOGLE_FORM.entry.start} type="date" value={form.start} onChange={(e) => update("start", e.target.value)} className="border-white/15 bg-white/10 text-white" required />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white/80">End date</Label>
                    <Input name={GOOGLE_FORM.entry.end} type="date" value={form.end} onChange={(e) => update("end", e.target.value)} className="border-white/15 bg-white/10 text-white" required />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-white/80">Pickup or delivery area</Label>
                  <Input name={GOOGLE_FORM.entry.pickupArea} value={form.pickupArea} onChange={(e) => update("pickupArea", e.target.value)} className="border-white/15 bg-white/10 text-white placeholder:text-white/40" placeholder="e.g., DCA, BWI, Bethesda" />
                </div>

                <div className="grid gap-2">
                  <Label className="text-white/80">Additional message / note</Label>
                  <Textarea name={GOOGLE_FORM.entry.message} value={form.message} onChange={(e) => update("message", e.target.value)} className="min-h-[120px] border-white/15 bg-white/10 text-white placeholder:text-white/40" placeholder="Flight time, delivery request, special needs, etc." />
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" checked={form.acknowledgment} onChange={(e) => update("acknowledgment", e.target.checked)} required />
                    <span className="text-sm text-white/80">{GOOGLE_FORM.values.ack}</span>
                  </label>
                </div>

                {status === "error" ? <div className="text-sm text-red-200">{error}</div> : null}

                <Button type="submit" className="rounded-2xl h-11" size="lg" disabled={status === "sending"}>
                  {status === "sending" ? "Submitting…" : "Send booking request"}
                </Button>

                {status === "sent" ? (
                  <div className="text-sm text-white/70">
                    Request received. We’ll review availability and contact you shortly.
                    If you need immediate help, call/text 315-553-4600 or email info@nomoluxe.com.
                  </div>
                ) : null}

                <div className="text-xs text-white/55">
                  By submitting, you confirm your details are accurate. This request does not guarantee availability until confirmed.
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="font-semibold">{BRAND.name}</div>
            <div className="text-sm text-white/70">{BRAND.locationLabel}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["home", "fleet", "pricing", "faq", "contact"].map((p) => (
              <Button key={p} variant="secondary" size="sm" className="rounded-xl" onClick={() => setPage(p)}>
                {p.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-8 bg-white/15" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm text-white/60">
          <div>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Safety-first rentals</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{BRAND.locationLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const goBook = () => setPage("contact");
  const onBookVehicle = (id) => {
    setSelectedVehicleId(id);
    setPage("contact");
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <TopNav page={page} setPage={setPage} />
      <main>
        <AnimatePresence mode="wait" initial={false}>
          {page === "home" ? (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Hero goBook={goBook} />
              <ValueProps />
              <FleetSection onBook={onBookVehicle} />
              <PricingSection goBook={goBook} />
              <FAQSection />
              <ContactSection selectedVehicleId={selectedVehicleId} clearSelected={() => setSelectedVehicleId(null)} />
            </motion.div>
          ) : null}

          {page === "fleet" ? (
            <motion.div key="fleet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <div className="mx-auto max-w-6xl px-4 pt-10">
                <SectionTitle eyebrow="Fleet" title="Browse all vehicles" subtitle="Filter by tier and request the vehicle you want." />
              </div>
              <FleetSection onBook={onBookVehicle} />
              <ContactSection selectedVehicleId={selectedVehicleId} clearSelected={() => setSelectedVehicleId(null)} />
            </motion.div>
          ) : null}

          {page === "pricing" ? (
            <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <div className="mx-auto max-w-6xl px-4 pt-10">
                <SectionTitle eyebrow="Pricing" title="Pricing & options" subtitle="Request a booking to receive the exact total for your dates." />
              </div>
              <PricingSection goBook={goBook} />
              <ContactSection selectedVehicleId={selectedVehicleId} clearSelected={() => setSelectedVehicleId(null)} />
            </motion.div>
          ) : null}

          {page === "faq" ? (
            <motion.div key="faq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <div className="mx-auto max-w-6xl px-4 pt-10">
                <SectionTitle eyebrow="FAQ" title="Frequently asked questions" subtitle="Everything most renters ask before booking." />
              </div>
              <FAQSection />
              <ContactSection selectedVehicleId={selectedVehicleId} clearSelected={() => setSelectedVehicleId(null)} />
            </motion.div>
          ) : null}

          {page === "contact" ? (
            <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <div className="bg-black">
                <div className="mx-auto max-w-6xl px-4 pt-10 pb-2">
                  <SectionTitle eyebrow="Contact" title="Let’s lock in your trip" subtitle="Send your dates and details. We’ll confirm availability quickly." />
                </div>
              </div>
              <ContactSection selectedVehicleId={selectedVehicleId} clearSelected={() => setSelectedVehicleId(null)} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}
