import React, { useMemo, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

/**
 * Nomo Luxe Car Rental — single-file website
 * - Built for quick launch (landing + fleet + booking lead form)
 * - Replace placeholder links/contact info before publishing
 */

const BRAND = {
  name: "Nomo Luxe Car Rental",
  tagline: "Premium comfort for travelers, professionals, and corporate trips.",
  locationLabel: "Maryland • DC • Virginia",
  phone: "315-553-4600",
  email: "info@nomoluxe.com",
  ig: "@nomoluxe", // TODO: replace
};

const fleet = [
  {
    id: "corolla2015",
    name: "Toyota Corolla (2015 • Grey)",
    tier: "Comfort",
    seats: 5,
    bags: 2,
    transmission: "Automatic",
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
    transmission: "Automatic",
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
    transmission: "Automatic",
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
    transmission: "Automatic",
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
    transmission: "Automatic",
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
    a: "Yes. We offer custom weekly/monthly pricing and corporate options. Use the contact form and select “Corporate / Long-Term”.",
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
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-2"
          aria-label="Go to home"
        >
          <div className="h-9 w-9 rounded-2xl bg-black text-white grid place-items-center shadow-sm">
            <Car className="h-5 w-5" />
          </div>
          <div className="leading-tight text-left">
            <div className="font-semibold">{BRAND.name}</div>
            <div className="text-xs text-muted-foreground">{BRAND.locationLabel}</div>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {items.map((it) => (
            <Button
              key={it.key}
              variant={page === it.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setPage(it.key)}
              className="rounded-xl"
            >
              {it.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="rounded-xl"
            onClick={() => setPage("contact")}
          >
            Request a Booking
          </Button>

          <div className="md:hidden">
            <Select value={page} onValueChange={setPage}>
              <SelectTrigger className="w-[120px] rounded-xl">
                <SelectValue placeholder="Menu" />
              </SelectTrigger>
              <SelectContent>
                {items.map((it) => (
                  <SelectItem key={it.key} value={it.key}>
                    {it.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      <div className="absolute -top-24 right-[-120px] h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />
      <div className="absolute top-40 left-[-160px] h-[460px] w-[460px] rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-14 md:pt-16 md:pb-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">Direct rentals • Fast confirmation</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-white"
            >
              Drive with confidence.
              <span className="block text-white/80">Arrive like you mean it.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mt-4 text-base md:text-lg text-white/80 max-w-xl"
            >
              {BRAND.tagline} Transparent pricing, clean vehicles, and a smooth pickup
              experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <Button
                onClick={goBook}
                className="rounded-2xl h-11 px-5"
              >
                Request a Booking
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const el = document.getElementById("fleet");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-2xl h-11 px-5"
              >
                Browse Fleet
              </Button>
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

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="rounded-3xl border-white/20 bg-white/10 text-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Quick Quote</CardTitle>
                <div className="text-sm text-white/70">
                  Get an estimated total before you request a booking.
                </div>
              </CardHeader>
              <CardContent>
                <QuickQuote goBook={goBook} />
                <Separator className="my-5 bg-white/15" />
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Clean vehicles, every trip</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Pickup, delivery, or meet-up options</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Support when you need it</span>
                  </div>
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

  // Simple estimate (customize as you want):
  const deliveryFee = delivery === "yes" ? 25 : 0;
  const est = useMemo(() => selected.dailyFrom * days + deliveryFee, [selected, days, deliveryFee]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label className="text-white/80">Vehicle</Label>
        <Select value={carId} onValueChange={setCarId}>
          <SelectTrigger className="rounded-2xl border-white/20 bg-white/10 text-white">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {fleet.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} • from {formatMoney(c.dailyFrom)}/day
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label className="text-white/80">Start</Label>
          <Input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="rounded-2xl border-white/20 bg-white/10 text-white"
          />
        </div>
        <div className="grid gap-2">
          <Label className="text-white/80">End</Label>
          <Input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="rounded-2xl border-white/20 bg-white/10 text-white"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label className="text-white/80">Delivery needed?</Label>
        <Select value={delivery} onValueChange={setDelivery}>
          <SelectTrigger className="rounded-2xl border-white/20 bg-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes">Yes (adds {formatMoney(25)})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm text-white/70">Estimated total</div>
            <div className="text-2xl font-semibold text-white">{formatMoney(est)}</div>
            <div className="mt-1 text-xs text-white/60">
              Estimate only. Taxes/fees and exact terms depend on confirmation.
            </div>
          </div>
          <div className="text-right text-sm text-white/70">
            <div>{days} day(s)</div>
            <div>{formatMoney(selected.dailyFrom)}/day</div>
          </div>
        </div>
      </div>

      <Button onClick={goBook} className="rounded-2xl h-11">
        Request this booking
      </Button>
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="max-w-3xl">
      <div className="text-sm text-muted-foreground">{eyebrow}</div>
      <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      {subtitle ? (
        <p className="mt-3 text-muted-foreground text-base md:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}

function ValueProps() {
  const items = [
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Clean & reliable",
      desc: "Every vehicle is inspected and cleaned before each trip.",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Transparent pricing",
      desc: "Clear daily rates and upfront expectations—no guesswork.",
    },
    {
      icon: <Headphones className="h-5 w-5" />,
      title: "Real support",
      desc: "Quick responses and guidance from pickup to drop-off.",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-18">
      <SectionTitle
        eyebrow="Why Nomo Luxe"
        title="Premium experience without premium hassle"
        subtitle="Perfect for airport travel, business trips, and weekends—built around comfort, speed, and trust."
      />

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {items.map((it) => (
          <Card key={it.title} className="rounded-3xl">
            <CardContent className="p-6">
              <div className="h-11 w-11 rounded-2xl bg-black text-white grid place-items-center shadow-sm">
                {it.icon}
              </div>
              <div className="mt-4 font-semibold text-lg">{it.title}</div>
              <div className="mt-2 text-muted-foreground">{it.desc}</div>
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

  const tiers = useMemo(() => {
    const set = new Set(fleet.map((c) => c.tier));
    return ["all", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return fleet
      .filter((c) => (tier === "all" ? true : c.tier === tier))
      .filter((c) => {
        const hay = `${c.name} ${c.tier} ${c.perks.join(" ")}`.toLowerCase();
        return hay.includes(q.trim().toLowerCase());
      });
  }, [tier, q]);

  return (
    <div id="fleet" className="mx-auto max-w-6xl px-4 py-14 md:py-18">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <SectionTitle
          eyebrow="Fleet"
          title="Choose your ride"
          subtitle="Comfort, Executive, or Luxe—pick the level that matches your trip."
        />

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="w-full sm:w-[160px]">
            <Select value={tier} onValueChange={setTier}>
              <SelectTrigger className="rounded-2xl">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                {tiers.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t === "all" ? "All tiers" : t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-[220px]">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search fleet…"
              className="rounded-2xl"
            />
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
                    <Badge variant="secondary" className="rounded-full">
                      {c.tier}
                    </Badge>
                    {c.featured ? (
                      <Badge className="rounded-full">Most popular</Badge>
                    ) : null}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">from</div>
                  <div className="text-2xl font-semibold">{formatMoney(c.dailyFrom)}</div>
                  <div className="text-sm text-muted-foreground">per day</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <Spec label="Seats" value={c.seats} />
                <Spec label="Bags" value={c.bags} />
                <Spec label="MPG" value={c.mpg} />
              </div>

              <div className="mt-4 grid gap-2 text-sm">
                {c.perks.map((p) => (
                  <div key={p} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5" />
                    <span className="text-muted-foreground">{p}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => onBook(c.id)}
                className="mt-5 w-full rounded-2xl"
              >
                Request this vehicle
              </Button>
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
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function PricingSection({ goBook }) {
  const rows = [
    {
      tier: "Comfort",
      bestFor: "Daily commuting, errands, city trips",
      includes: ["Fuel efficient options", "Easy pickup", "Fast confirmation"],
    },
    {
      tier: "Executive",
      bestFor: "Business travel, meetings, airport runs",
      includes: ["Premium sedan comfort", "Quiet ride", "Professional presence"],
    },
    {
      tier: "Luxe SUV",
      bestFor: "Family trips, luggage, road trips",
      includes: ["3-row capability", "Premium comfort", "Confident driving"],
    },
    {
      tier: "Ultra Luxe",
      bestFor: "VIP trips, events, standout luxury",
      includes: ["Iconic vehicle", "High-end experience", "Event-ready presence"],
    },
  ];

  return (
    <div className="bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-18">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionTitle
            eyebrow="Pricing"
            title="Simple rates. Clear expectations."
            subtitle="Daily pricing varies by season and availability. Request a booking for the exact quote."
          />
          <Button onClick={goBook} className="rounded-2xl">
            Get an exact quote
          </Button>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {rows.map((r) => (
            <Card key={r.tier} className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">{r.tier}</div>
                  <Badge variant="secondary" className="rounded-full">
                    from {formatMoney(
                      fleet
                        .filter((c) => c.tier === r.tier)
                        .reduce((min, c) => Math.min(min, c.dailyFrom), Infinity)
                    )}/day
                  </Badge>
                </div>
                <div className="mt-2 text-muted-foreground">{r.bestFor}</div>

                <div className="mt-5 grid gap-2 text-sm">
                  {r.includes.map((x) => (
                    <div key={x} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5" />
                      <span className="text-muted-foreground">{x}</span>
                    </div>
                  ))}
                </div>

                <Button onClick={goBook} variant="secondary" className="mt-6 w-full rounded-2xl">
                  Request a booking
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border bg-white p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <InfoPill icon={<MapPin className="h-4 w-4" />} title="Delivery" desc="Available by request (fee may apply)." />
            <InfoPill icon={<Clock className="h-4 w-4" />} title="Long-term" desc="Weekly/monthly rates available." />
            <InfoPill icon={<ShieldCheck className="h-4 w-4" />} title="Verification" desc="Quick ID verification for safety." />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoPill({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-2xl border grid place-items-center">{icon}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-18">
      <SectionTitle
        eyebrow="FAQ"
        title="Questions, answered"
        subtitle="If you don’t see your question here, message us and we’ll respond quickly."
      />

      <div className="mt-8 grid gap-3">
        {faqs.map((f, i) => (
          <button
            key={f.q}
            onClick={() => setOpen(i === open ? -1 : i)}
            className="text-left"
          >
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">{f.q}</div>
                    <AnimatePresence initial={false}>
                      {open === i ? (
                        <motion.div
                          key="a"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-2 text-muted-foreground"
                        >
                          {f.a}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                  <div className={cn("text-sm", open === i ? "text-black" : "text-muted-foreground")}>
                    {open === i ? "–" : "+"}
                  </div>
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
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    bookingType: "Standard",
    vehicle: selectedVehicleId ?? "",
    start: "",
    end: "",
    pickupArea: "",
    message: "",
  });

  const vehicles = useMemo(() => ["", ...fleet.map((c) => c.id)], []);

  const selected = useMemo(
    () => fleet.find((c) => c.id === (form.vehicle || selectedVehicleId)) ?? null,
    [form.vehicle, selectedVehicleId]
  );

  function update(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function mailtoHref() {
    // Note: mailto works as a lightweight “backend-free” solution.
    // For a real form, connect to Formspree, Google Forms, or your own API.
    const subject = encodeURIComponent(
      `Booking request — ${form.name || "(name)"}${selected ? ` — ${selected.name}` : ""}`
    );

    const bodyLines = [
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `Request type: ${form.bookingType}`,
      `Vehicle: ${selected ? selected.name : form.vehicle || ""}`,
      `Start date: ${form.start}`,
      `End date: ${form.end}`,
      `Pickup/Delivery area: ${form.pickupArea}`,
      "",
      `Message: ${form.message}`,
    ];

    const body = encodeURIComponent(bodyLines.join("\n"));
    return `mailto:${BRAND.email}?subject=${subject}&body=${body}`;
  }

  function onSubmit(e) {
    e.preventDefault();
    setStatus("sent");
    // Open default mail client with prefilled request
    window.location.href = mailtoHref();
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
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
              Request a booking
            </h2>
            <p className="mt-3 text-white/75">
              Submit details below and we’ll confirm availability, verification steps, and final pricing for your direct rental. Corporate and long-term rentals welcome.
            </p>

            <div className="mt-6 grid gap-3">
              <ContactRow icon={<MapPin className="h-4 w-4" />} label={BRAND.locationLabel} />
              <ContactRow icon={<Phone className="h-4 w-4" />} label={BRAND.phone} />
              <ContactRow icon={<Car className="h-4 w-4" />} label={BRAND.ig} />
            </div>

            {selectedVehicleId ? (
              <div className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-5">
                <div className="text-sm text-white/70">Selected vehicle</div>
                <div className="mt-1 text-lg font-semibold">
                  {fleet.find((c) => c.id === selectedVehicleId)?.name ?? ""}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-4 rounded-2xl"
                  onClick={clearSelected}
                >
                  Clear selection
                </Button>
              </div>
            ) : null}
          </div>

          <Card className="rounded-3xl border-white/15 bg-white/10 text-white">
            <CardContent className="p-6">
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label className="text-white/80">Full name</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="rounded-2xl border-white/15 bg-white/10 text-white placeholder:text-white/40"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white/80">Phone</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="rounded-2xl border-white/15 bg-white/10 text-white placeholder:text-white/40"
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label className="text-white/80">Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="rounded-2xl border-white/15 bg-white/10 text-white placeholder:text-white/40"
                      placeholder="you@email.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white/80">Request type</Label>
                    <Select value={form.bookingType} onValueChange={(v) => update("bookingType", v)}>
                      <SelectTrigger className="rounded-2xl border-white/15 bg-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Corporate / Long-Term">Corporate / Long-Term</SelectItem>
                        <SelectItem value="Delivery Request">Delivery Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-white/80">Vehicle</Label>
                  <Select
                    value={form.vehicle || selectedVehicleId || ""}
                    onValueChange={(v) => update("vehicle", v)}
                  >
                    <SelectTrigger className="rounded-2xl border-white/15 bg-white/10 text-white">
                      <SelectValue placeholder="Choose a vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((id) => (
                        <SelectItem key={id || "none"} value={id}>
                          {id ? fleet.find((c) => c.id === id)?.name : "(No preference)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label className="text-white/80">Start date</Label>
                    <Input
                      type="date"
                      value={form.start}
                      onChange={(e) => update("start", e.target.value)}
                      className="rounded-2xl border-white/15 bg-white/10 text-white"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white/80">End date</Label>
                    <Input
                      type="date"
                      value={form.end}
                      onChange={(e) => update("end", e.target.value)}
                      className="rounded-2xl border-white/15 bg-white/10 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-white/80">Pickup/Delivery area</Label>
                  <Input
                    value={form.pickupArea}
                    onChange={(e) => update("pickupArea", e.target.value)}
                    className="rounded-2xl border-white/15 bg-white/10 text-white placeholder:text-white/40"
                    placeholder="e.g., DCA, BWI, Bethesda, Rockville"
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-white/80">Message</Label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="min-h-[120px] rounded-2xl border-white/15 bg-white/10 text-white placeholder:text-white/40"
                    placeholder="Tell us anything important (flight time, delivery request, special needs, etc.)"
                  />
                </div>

                <Button type="submit" className="rounded-2xl h-11">
                  Send booking request
                </Button>

                {status === "sent" ? (
                  <div className="text-sm text-white/70">
                    If your email app didn’t open, copy your details and message us at {BRAND.email}.
                  </div>
                ) : null}

                <div className="text-xs text-white/55">
                  By submitting, you confirm your details are accurate. Availability is not guaranteed
                  until confirmed.
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ContactRow({ icon, label }) {
  return (
    <div className="flex items-center gap-3 text-white/80">
      <div className="h-9 w-9 rounded-2xl border border-white/15 bg-white/10 grid place-items-center">
        {icon}
      </div>
      <div className="text-sm">{label}</div>
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
              <Button
                key={p}
                variant="secondary"
                size="sm"
                className="rounded-xl"
                onClick={() => setPage(p)}
              >
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

export default function NomoLuxeWebsite() {
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
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Hero goBook={goBook} />
              <ValueProps />
              <FleetSection onBook={onBookVehicle} />
              <PricingSection goBook={goBook} />
              <FAQSection />
              <ContactSection
                selectedVehicleId={selectedVehicleId}
                clearSelected={() => setSelectedVehicleId(null)}
              />
            </motion.div>
          ) : null}

          {page === "fleet" ? (
            <motion.div
              key="fleet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mx-auto max-w-6xl px-4 pt-10">
                <SectionTitle
                  eyebrow="Fleet"
                  title="Browse all vehicles"
                  subtitle="Filter by tier and request the vehicle you want."
                />
              </div>
              <FleetSection onBook={onBookVehicle} />
              <ContactSection
                selectedVehicleId={selectedVehicleId}
                clearSelected={() => setSelectedVehicleId(null)}
              />
            </motion.div>
          ) : null}

          {page === "pricing" ? (
            <motion.div
              key="pricing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mx-auto max-w-6xl px-4 pt-10">
                <SectionTitle
                  eyebrow="Pricing"
                  title="Pricing & options"
                  subtitle="Request a booking to receive the exact total for your dates."
                />
              </div>
              <PricingSection goBook={goBook} />
              <ContactSection
                selectedVehicleId={selectedVehicleId}
                clearSelected={() => setSelectedVehicleId(null)}
              />
            </motion.div>
          ) : null}

          {page === "faq" ? (
            <motion.div
              key="faq"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mx-auto max-w-6xl px-4 pt-10">
                <SectionTitle
                  eyebrow="FAQ"
                  title="Frequently asked questions"
                  subtitle="Everything most renters ask before booking."
                />
              </div>
              <FAQSection />
              <ContactSection
                selectedVehicleId={selectedVehicleId}
                clearSelected={() => setSelectedVehicleId(null)}
              />
            </motion.div>
          ) : null}

          {page === "contact" ? (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="bg-black">
                <div className="mx-auto max-w-6xl px-4 pt-10 pb-2">
                  <SectionTitle
                    eyebrow="Contact"
                    title="Let’s lock in your trip"
                    subtitle="Send your dates and details. We’ll confirm availability quickly."
                  />
                </div>
              </div>
              <ContactSection
                selectedVehicleId={selectedVehicleId}
                clearSelected={() => setSelectedVehicleId(null)}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <Footer setPage={setPage} />
    </div>
  );
}
