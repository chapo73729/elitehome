"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { Compile } from "@/components/ui/Compile";
import { SITE } from "@/lib/site";
import { useContent } from "@/lib/content";
import { audio } from "@/lib/audio";
import { copyText, toast } from "@/lib/toast";

type Status = "idle" | "sending" | "sent" | "error";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Contact() {
  const c = useContent();
  const t = c.contact;
  const statement = c.cta.title;
  const FIELDS = t.domains;
  const [status, setStatus] = useState<Status>("idle");
  const [field, setField] = useState<string>(FIELDS[0]);
  const sent = status === "sent";
  const reduce = useReducedMotion() ?? false;
  const messageId = useId();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    audio.click();
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

  // Each field collapses upward in sequence on transmit (reduced-motion: static).
  const collapse = (i: number) =>
    reduce
      ? {}
      : {
          exit: {
            opacity: 0,
            y: -16,
            transition: { duration: 0.4, ease: EASE, delay: i * 0.06 },
          },
        };

  return (
    <section
      id="contact"
      className="relative z-10 scroll-mt-24 overflow-hidden py-28 md:py-40"
    >
      <div className="container-x relative">
        <ChapterNumeral n="04" label="ENGAGE" />

        <Compile label="engage" index="04" className="relative z-10">
          {/* Oversized payoff statement — the one white→mist gradient headline. */}
          <Reveal>
            <span className="eyebrow">{t.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-giant text-gradient mt-6 max-w-4xl text-balance">
              {statement}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-xl text-balance text-lg text-mist">
              {t.intro}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <button
              type="button"
              data-cursor
              title={t.copyHint}
              onClick={async () => {
                audio.click();
                if (await copyText(SITE.email)) toast(t.copied, "✓");
                else window.location.href = `mailto:${SITE.email}`;
              }}
              className="link-underline mt-10 inline-block text-left font-display text-2xl text-chalk md:text-3xl"
            >
              {SITE.email}
            </button>
          </Reveal>

          {/* Bare form on the void — no glass, no aurora. The numbered fields
              extend the 00→04 numbering spine of the film. */}
          <div className="mt-20 max-w-2xl">
            <Reveal delay={0.1}>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.42em] text-fog/70">
                {t.step}
              </span>
            </Reveal>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-10 flex min-h-[300px] flex-col items-start justify-center text-left"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full glow-accent">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                      <motion.path
                        d="M4 12.5l5 5L20 6.5"
                        stroke="var(--color-accent)"
                        strokeWidth={2.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: reduce ? 1 : 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: reduce ? 0 : 0.6,
                          ease: EASE,
                          delay: reduce ? 0 : 0.35,
                        }}
                      />
                    </svg>
                  </div>
                  <h3 className="mt-7 font-display text-2xl text-chalk md:text-3xl">
                    {t.sentTitle}
                  </h3>
                  <p className="mt-3 max-w-md text-mist">{t.sentBody}</p>
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
                  className="mt-8 space-y-7"
                >
                  <motion.div {...collapse(3)}>
                    <Input
                      name="name"
                      num="01"
                      label={t.name}
                      placeholder={t.namePlaceholder}
                      required
                    />
                  </motion.div>
                  <motion.div {...collapse(2)}>
                    <Input
                      name="email"
                      type="email"
                      num="02"
                      label={t.email}
                      placeholder={t.emailPlaceholder}
                      required
                    />
                  </motion.div>
                  <motion.div {...collapse(1)}>
                    <div className="flex items-baseline justify-between">
                      <span id="contact-domain-label" className="eyebrow">
                        {t.domain}
                      </span>
                      <span className="font-mono text-[0.6rem] tracking-widest text-fog">
                        03
                      </span>
                    </div>
                    <div
                      role="group"
                      aria-labelledby="contact-domain-label"
                      className="mt-3 flex flex-wrap gap-2"
                    >
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
                  </motion.div>
                  <motion.div {...collapse(0)}>
                    <Field label={t.message} num="04" htmlFor={messageId}>
                      <textarea
                        id={messageId}
                        name="message"
                        rows={4}
                        required
                        placeholder={t.messagePlaceholder}
                        className="w-full resize-y bg-transparent py-2.5 text-base text-chalk caret-accent outline-none placeholder:text-fog/50 md:resize-none"
                      />
                    </Field>
                  </motion.div>

                  {/* honeypot — hidden from humans, catches bots */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  />

                  <div className="flex flex-wrap items-center gap-4 pt-2">
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
                      <span className="text-sm text-accent">
                        {t.errorPrefix}{" "}
                        <a
                          className="link-underline"
                          href={`mailto:${SITE.email}`}
                        >
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
        </Compile>
      </div>
    </section>
  );
}

function Field({
  label,
  num,
  htmlFor,
  children,
}: {
  label: string;
  num: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group">
      <div className="flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="eyebrow">
          {label}
        </label>
        <span className="font-mono text-[0.6rem] tracking-widest text-fog">
          {num}
        </span>
      </div>
      <div className="relative mt-2">
        {children}
        <span className="absolute bottom-0 left-0 h-px w-full bg-white/12" />
        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-focus-within:scale-x-100" />
      </div>
    </div>
  );
}

function Input({
  label,
  num,
  ...props
}: { label: string; num: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Field label={label} num={num} htmlFor={id}>
      <input
        id={id}
        {...props}
        className="w-full bg-transparent py-2.5 text-base text-chalk caret-accent outline-none placeholder:text-fog/50"
      />
    </Field>
  );
}
