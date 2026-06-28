"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";
import { useContent } from "@/lib/content";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const t = useContent().contact;
  const FIELDS = t.domains;
  const [status, setStatus] = useState<Status>("idle");
  const [field, setField] = useState<string>(FIELDS[0]);
  const sent = status === "sent";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      message: String(data.get("message") || ""),
      domain: field,
      company: String(data.get("company") || ""), // honeypot
    };

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      // not configured / failed → graceful mail fallback to the PUBLIC address
      const subject = encodeURIComponent(`ARDLABS enquiry — ${field}`);
      const body = encodeURIComponent(
        `Name: ${payload.name}\nEmail: ${payload.email}\nDomain: ${field}\n\n${payload.message}`
      );
      window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative z-10 scroll-mt-24 overflow-hidden py-28 md:py-40">
      {/* aurora background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute right-[15%] top-1/2 h-[40vh] w-[40vh] rounded-full bg-accent-3/15 blur-[120px]" />
        <div className="absolute left-[12%] bottom-0 h-[40vh] w-[40vh] rounded-full bg-accent-2/10 blur-[120px]" />
      </div>

      <div className="container-x relative">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <span className="eyebrow">{t.eyebrow}</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="text-giant text-gradient mt-6 max-w-xl text-balance">
                {t.title}
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-balance text-mist">{t.intro}</p>
            </Reveal>
            <Reveal delay={0.24}>
              <a
                href={`mailto:${SITE.email}`}
                className="link-underline mt-10 inline-block font-display text-xl text-chalk"
              >
                {SITE.email}
              </a>
            </Reveal>
          </div>

          {/* form card */}
          <Reveal delay={0.1}>
            <div className="relative rounded-3xl glass p-8 md:p-10">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex min-h-[360px] flex-col items-center justify-center text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full glow-accent">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                        <motion.path
                          d="M4 12.5l5 5L20 6.5"
                          stroke="var(--color-accent-2)"
                          strokeWidth={2.4}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                        />
                      </svg>
                    </div>
                    <h3 className="mt-6 font-display text-2xl text-chalk">
                      {t.sentTitle}
                    </h3>
                    <p className="mt-3 max-w-xs text-sm text-mist">{t.sentBody}</p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="link-underline mt-8 text-sm text-mist"
                    >
                      {t.sendAnother}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <Input name="name" num="01" label={t.name} placeholder={t.namePlaceholder} required />
                    <Input
                      name="email"
                      type="email"
                      num="02"
                      label={t.email}
                      placeholder={t.emailPlaceholder}
                      required
                    />
                    <div>
                      <div className="flex items-baseline justify-between">
                        <label className="eyebrow">{t.domain}</label>
                        <span className="font-mono text-[0.6rem] tracking-widest text-fog">03</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {FIELDS.map((f) => (
                          <button
                            type="button"
                            key={f}
                            onClick={() => setField(f)}
                            aria-pressed={field === f}
                            aria-label={`Project type: ${f}`}
                            className={`rounded-full px-4 py-1.5 font-mono text-xs transition-all duration-300 ${
                              field === f
                                ? "bg-accent text-void shadow-[0_0_18px_rgba(79,140,255,0.4)]"
                                : "hairline text-mist hover:border-white/30 hover:text-chalk"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Field label={t.message} num="04">
                      <textarea
                        name="message"
                        rows={4}
                        required
                        placeholder={t.messagePlaceholder}
                        className="w-full resize-y bg-transparent py-2.5 text-base text-chalk outline-none placeholder:text-fog/50 md:resize-none"
                      />
                    </Field>

                    {/* honeypot — hidden from humans, catches bots */}
                    <input
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden
                      className="absolute left-[-9999px] h-0 w-0 opacity-0"
                    />

                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        data-cursor
                        className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-chalk px-7 py-3.5 text-sm font-medium text-void transition-transform duration-300 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {status === "sending" ? (
                          <>
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-void/30 border-t-void" />
                            {t.transmitting}
                          </>
                        ) : (
                          <>
                            {t.transmit} <span aria-hidden>→</span>
                          </>
                        )}
                      </button>
                      {status === "error" && (
                        <span className="text-sm text-accent-3">
                          {t.errorPrefix}{" "}
                          <a className="link-underline" href={`mailto:${SITE.email}`}>
                            {SITE.email}
                          </a>
                          .
                        </span>
                      )}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  num,
  children,
}: {
  label: string;
  num: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group">
      <div className="flex items-baseline justify-between">
        <label className="eyebrow">{label}</label>
        <span className="font-mono text-[0.6rem] tracking-widest text-fog">{num}</span>
      </div>
      <div className="relative mt-2">
        {children}
        <span className="absolute bottom-0 left-0 h-px w-full bg-white/12" />
        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent-2 transition-transform duration-500 ease-out group-focus-within:scale-x-100" />
      </div>
    </div>
  );
}

function Input({
  label,
  num,
  ...props
}: { label: string; num: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field label={label} num={num}>
      <input
        {...props}
        className="w-full bg-transparent py-2.5 text-base text-chalk outline-none placeholder:text-fog/50"
      />
    </Field>
  );
}
