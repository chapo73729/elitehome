"use client";

import { useEffect, useState } from "react";
import { useContent } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { FAQ } from "@/lib/faq";
import { SITE, FLEET } from "@/lib/site";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl bg-smoke/60 hairline px-4 py-3 text-chalk placeholder:text-fog outline-none transition-colors focus:border-accent/50";
const labelCls = "block font-mono text-[0.62rem] uppercase tracking-[0.25em] text-fog mb-2";

export function BookingView() {
  const b = useContent().booking;
  const faq = FAQ[useLang()];
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    passengers: "2",
    luggage: "2",
    vehicle: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
    company: "", // honeypot
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // Trajets signature : ?from=…&to=… pré-remplit le formulaire
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const from = q.get("from");
      const to = q.get("to");
      if (from || to) {
        setForm((f) => ({ ...f, from: from ?? f.from, to: to ?? f.to }));
      }
    } catch {
      /* non-fatal */
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setStatus("error");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return setStatus("error");
    if (!form.from.trim() || !form.to.trim()) return setStatus("error");

    setStatus("sending");
    const message = [
      `Pick-up: ${form.from}`,
      `Destination: ${form.to}`,
      `Date / time: ${form.date || "—"} ${form.time || ""}`.trim(),
      `Passengers: ${form.passengers}`,
      `Luggage: ${form.luggage}`,
      `Vehicle: ${form.vehicle || b.vehicleAny}`,
      `Phone: ${form.phone || "—"}`,
      "",
      form.notes || "(no additional notes)",
    ].join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          domain: "Booking request",
          message,
          company: form.company,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <main className="relative">
        <PageHero eyebrow={b.eyebrow} title={b.sentTitle} />
        <section className="relative z-10 bg-void pb-32">
          <div className="container-x max-w-2xl">
            <Reveal>
              <p className="text-lead">{b.sentBody}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <button
                onClick={() => {
                  setStatus("idle");
                  setForm((f) => ({ ...f, from: "", to: "", notes: "" }));
                }}
                className="mt-8 rounded-full bg-chalk px-6 py-3 text-sm font-medium text-void"
              >
                {b.sendAnother}
              </button>
            </Reveal>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative">
      <PageHero eyebrow={b.eyebrow} title={b.title} intro={b.intro} />

      <section className="relative z-10 bg-void pb-28 md:pb-36">
        <div className="container-x max-w-3xl">
          <Reveal>
            <form onSubmit={onSubmit} className="space-y-8">
              {/* honeypot */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={set("company")}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
                aria-hidden
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="from">{b.fromLabel}</label>
                  <input id="from" className={field} placeholder={b.fromPlaceholder} value={form.from} onChange={set("from")} required />
                </div>
                <div>
                  <label className={labelCls} htmlFor="to">{b.toLabel}</label>
                  <input id="to" className={field} placeholder={b.toPlaceholder} value={form.to} onChange={set("to")} required />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-4">
                <div>
                  <label className={labelCls} htmlFor="date">{b.dateLabel}</label>
                  <input id="date" type="date" className={field} value={form.date} onChange={set("date")} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="time">{b.timeLabel}</label>
                  <input id="time" type="time" className={field} value={form.time} onChange={set("time")} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="passengers">{b.passengersLabel}</label>
                  <input id="passengers" type="number" min={1} max={7} className={field} value={form.passengers} onChange={set("passengers")} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="luggage">{b.luggageLabel}</label>
                  <input id="luggage" type="number" min={0} max={12} className={field} value={form.luggage} onChange={set("luggage")} />
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="vehicle">{b.vehicleLabel}</label>
                <select id="vehicle" className={field} value={form.vehicle} onChange={set("vehicle")}>
                  <option value="">{b.vehicleAny}</option>
                  {FLEET.map((v) => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <label className={labelCls} htmlFor="name">{b.nameLabel}</label>
                  <input id="name" autoComplete="name" className={field} placeholder={b.namePlaceholder} value={form.name} onChange={set("name")} required />
                </div>
                <div>
                  <label className={labelCls} htmlFor="email">{b.emailLabel}</label>
                  <input id="email" type="email" autoComplete="email" className={field} placeholder={b.emailPlaceholder} value={form.email} onChange={set("email")} required />
                </div>
                <div>
                  <label className={labelCls} htmlFor="phone">{b.phoneLabel}</label>
                  <input id="phone" type="tel" autoComplete="tel" className={field} placeholder={b.phonePlaceholder} value={form.phone} onChange={set("phone")} />
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="notes">{b.notesLabel}</label>
                <textarea id="notes" rows={4} className={field} placeholder={b.notesPlaceholder} value={form.notes} onChange={set("notes")} />
              </div>

              {status === "error" && (
                <p className="text-sm text-accent-2">
                  {b.errorPrefix}: {SITE.email} · {SITE.phone}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-5">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="rounded-full bg-chalk px-8 py-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-void transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60"
                >
                  {status === "sending" ? b.submitting : b.submit}
                </button>
                <p className="max-w-xs font-mono text-[0.68rem] leading-relaxed tracking-wide text-fog">
                  {b.promise}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 bg-void pb-28 md:pb-36">
        <div className="container-x max-w-3xl">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="eyebrow">{faq.title}</span>
              <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="text-lead mt-6">{faq.intro}</p>
          </Reveal>
          <div className="mt-10">
            {faq.items.map((item, i) => (
              <Reveal key={item.q} delay={0.04 * i}>
                <details className="group hairline-t py-5 open:pb-7">
                  <summary className="flex cursor-pointer list-none items-baseline gap-5 [&::-webkit-details-marker]:hidden">
                    <span className="font-mono text-xs text-accent-3 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-display text-xl font-medium text-chalk transition-colors group-hover:text-white md:text-2xl">
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className="font-mono text-lg text-fog transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 pl-10 text-sm leading-relaxed text-mist md:pl-11">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
