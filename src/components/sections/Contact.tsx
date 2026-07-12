"use client";

import { useCallback, useId, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { Compile } from "@/components/ui/Compile";
import { RollingText } from "@/components/ui/RollingText";
import { Decode } from "@/components/ui/Decode";
import { SITE } from "@/lib/site";
import { useContent } from "@/lib/content";
import { track } from "@vercel/analytics";
import { audio } from "@/lib/audio";
import { copyText, toast } from "@/lib/toast";

type Status = "idle" | "sending" | "sent" | "error";

const EASE = [0.16, 1, 0.3, 1] as const;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const TOTAL = 4; // name → email → domain → message; step 4 = compiled brief
const REVIEW = 4;

export function Contact() {
  const c = useContent();
  const t = c.contact;
  const statement = c.cta.title;
  const FIELDS = t.domains;
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1); // 1 = forward, -1 = back
  const [answers, setAnswers] = useState({ name: "", email: "", message: "" });
  const [field, setField] = useState<string>(FIELDS[0]);
  const [error, setError] = useState<string | null>(null);
  const sent = status === "sent";
  const reduce = useSafeReducedMotion();
  const uid = useId();
  const honeypotRef = useRef<HTMLInputElement>(null);
  const interactedRef = useRef(false);

  const stepLabels = [t.name, t.email, t.domain, t.message];

  // Focus lands on the fresh step's control — but never on initial page load.
  const focusOnMount = useCallback((node: HTMLElement | null) => {
    if (node && interactedRef.current) {
      requestAnimationFrame(() => node.focus({ preventScroll: true }));
    }
  }, []);

  const validate = (s: number): string | null => {
    if (s === 0 && !answers.name.trim()) return t.nameError;
    if (s === 1 && !EMAIL_RE.test(answers.email.trim())) return t.emailError;
    if (s === 3 && !answers.message.trim()) return t.messageError;
    return null;
  };

  const goTo = (next: number) => {
    interactedRef.current = true;
    setDir(next < step ? -1 : 1);
    setError(null);
    setStep(next);
  };

  const goNext = () => {
    const err = validate(step);
    if (err) {
      setError(err);
      return;
    }
    audio.click();
    // conversion funnel: where do visitors drop out of the brief?
    track("brief_step", { step: step + 1 });
    goTo(step + 1);
  };

  const goBack = () => {
    if (step === 0) return;
    audio.click();
    goTo(step - 1);
  };

  const advanceOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      goNext();
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    // Belt-and-braces: re-check every step before transmitting.
    for (let i = 0; i < TOTAL; i++) {
      const err = validate(i);
      if (err) {
        goTo(i);
        setError(err);
        return;
      }
    }
    audio.click();
    const payload = {
      name: answers.name.trim(),
      email: answers.email.trim(),
      message: answers.message.trim(),
      domain: field,
      company: honeypotRef.current?.value ?? "", // honeypot
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
        audio.success();
        track("brief_transmitted", { domain: field });
        return;
      }
      // delivery failed — stay on the page and show the direct address
      // instead (never bounce the visitor into their mail client).
      setStatus("error");
      track("brief_failed", { status: res.status });
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setAnswers({ name: "", email: "", message: "" });
    setField(FIELDS[0]);
    setError(null);
    setDir(-1);
    setStep(0);
  };

  // Slide/fade between steps — reduced motion swaps on opacity alone.
  const stepVariants: Variants = {
    initial: (d: number) =>
      reduce ? { opacity: 0 } : { opacity: 0, y: 24 * d },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: EASE },
    },
    exit: (d: number) =>
      reduce
        ? { opacity: 0, transition: { duration: 0.25 } }
        : { opacity: 0, y: -24 * d, transition: { duration: 0.45, ease: EASE } },
  };

  const stepOf = (n: number) =>
    t.stepOf.replace("{n}", String(n)).replace("{total}", String(TOTAL));
  const progressText =
    step < REVIEW
      ? `${stepOf(step + 1)} — ${stepLabels[step]}`
      : `// ${t.briefCompiled}`;

  const excerpt =
    answers.message.trim().length > 140
      ? `${answers.message.trim().slice(0, 140)}…`
      : answers.message.trim();

  const briefRows: { label: string; value: string; target: number }[] = [
    { label: t.name, value: answers.name.trim(), target: 0 },
    { label: t.email, value: answers.email.trim(), target: 1 },
    { label: t.domain, value: field, target: 2 },
    { label: t.message, value: excerpt, target: 3 },
  ];

  const inputClass =
    "w-full bg-transparent py-3 font-display text-2xl text-chalk caret-accent outline-none placeholder:text-fog/40 md:text-4xl";

  return (
    <section
      id="contact"
      className="relative z-10 scroll-mt-24 overflow-hidden py-28 md:py-40"
    >
      <div className="container-x relative">
        <ChapterNumeral n="06" label="ENGAGE" />

        <Compile label="engage" index="06" className="relative z-10">
          {/* Oversized payoff statement — the one white→mist gradient headline. */}
          <Reveal>
            <Decode text={t.eyebrow} className="eyebrow" />
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
              className="group link-underline mt-10 inline-block text-left font-display text-2xl text-chalk md:text-3xl"
            >
              <span className="sr-only">{SITE.email}</span>
              <RollingText text={SITE.email} />
            </button>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-fog">
              <span aria-hidden className="text-accent">↳ </span>
              {t.promise}
            </p>
          </Reveal>

          {/* « The Brief » — a guided, one-question-at-a-time briefing flow.
              Bare on the void, numbered 01→04, compiled into a blueprint card. */}
          <div className="mt-20 max-w-3xl">
            <Reveal delay={0.1}>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.42em] text-fog">
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
                    onClick={reset}
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
                  exit={
                    reduce
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          y: -16,
                          transition: { duration: 0.4, ease: EASE },
                        }
                  }
                  className="mt-8"
                >
                  {/* Progress announced to screen readers on every step change. */}
                  <p aria-live="polite" className="sr-only">
                    {progressText}
                  </p>

                  <div className="flex flex-col gap-7 md:flex-row md:gap-12">
                    {/* Progress rail — top row on mobile, left spine on md+.
                        Completed steps are checkmarked and clickable. */}
                    <ol
                      aria-label={progressText}
                      className="flex items-center gap-2 md:w-11 md:flex-col"
                    >
                      {stepLabels.map((label, i) => {
                        const done = i < step;
                        const current = i === step;
                        return (
                          <li key={label} className="flex items-center gap-2 md:flex-col">
                            {i > 0 && (
                              <span
                                aria-hidden
                                className="h-px w-4 bg-white/10 md:h-4 md:w-px"
                              />
                            )}
                            <button
                              type="button"
                              disabled={!done}
                              onClick={() => {
                                if (!done) return;
                                audio.click();
                                goTo(i);
                              }}
                              data-cursor={done ? true : undefined}
                              aria-label={`${stepOf(i + 1)} — ${label}`}
                              aria-current={current ? "step" : undefined}
                              className={`flex h-11 w-11 items-center justify-center rounded-full border font-mono text-[0.68rem] transition-colors duration-300 ${
                                current
                                  ? "border-accent/70 text-accent shadow-[0_0_16px_rgba(79,140,255,0.25)]"
                                  : done
                                    ? "border-white/15 text-accent hover:border-accent/60"
                                    : "border-white/8 text-fog"
                              }`}
                            >
                              {done ? (
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  aria-hidden
                                >
                                  <path
                                    d="M4 12.5l5 5L20 6.5"
                                    stroke="currentColor"
                                    strokeWidth={2.4}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : (
                                `0${i + 1}`
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ol>

                    {/* The stage — one question at a time. */}
                    <div className="min-h-[280px] flex-1 md:min-h-[320px]">
                      <AnimatePresence mode="wait" custom={dir} initial={false}>
                        <motion.div
                          key={step}
                          custom={dir}
                          variants={stepVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          {step === 0 && (
                            <StepFrame
                              label={t.name}
                              num="01"
                              htmlFor={`${uid}-name`}
                              error={error}
                            >
                              <input
                                ref={focusOnMount}
                                id={`${uid}-name`}
                                name="name"
                                type="text"
                                autoComplete="name"
                                enterKeyHint="next"
                                value={answers.name}
                                onChange={(e) => {
                                  setAnswers((a) => ({ ...a, name: e.target.value }));
                                  setError(null);
                                }}
                                onKeyDown={advanceOnEnter}
                                placeholder={t.namePlaceholder}
                                className={inputClass}
                              />
                            </StepFrame>
                          )}

                          {step === 1 && (
                            <StepFrame
                              label={t.email}
                              num="02"
                              htmlFor={`${uid}-email`}
                              error={error}
                            >
                              <input
                                ref={focusOnMount}
                                id={`${uid}-email`}
                                name="email"
                                type="email"
                                autoComplete="email"
                                enterKeyHint="next"
                                value={answers.email}
                                onChange={(e) => {
                                  setAnswers((a) => ({ ...a, email: e.target.value }));
                                  setError(null);
                                }}
                                onKeyDown={advanceOnEnter}
                                placeholder={t.emailPlaceholder}
                                className={inputClass}
                              />
                            </StepFrame>
                          )}

                          {step === 2 && (
                            <div>
                              <div className="flex items-baseline justify-between">
                                <span
                                  id={`${uid}-domain-label`}
                                  className="eyebrow"
                                >
                                  {t.domain}
                                </span>
                                <span className="font-mono text-[0.6rem] tracking-widest text-fog">
                                  03 / 04
                                </span>
                              </div>
                              <div
                                role="group"
                                aria-labelledby={`${uid}-domain-label`}
                                className="mt-6 flex flex-wrap gap-3"
                              >
                                {FIELDS.map((f) => (
                                  <button
                                    type="button"
                                    key={f}
                                    ref={f === field ? focusOnMount : undefined}
                                    onClick={() => {
                                      audio.click();
                                      setField(f);
                                    }}
                                    onKeyDown={advanceOnEnter}
                                    aria-pressed={field === f}
                                    aria-label={`${t.domain}: ${f}`}
                                    data-cursor
                                    className={`min-h-11 rounded-full px-5 py-2.5 font-mono text-xs transition-all duration-300 md:px-6 md:py-3 md:text-sm ${
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
                          )}

                          {step === 3 && (
                            <StepFrame
                              label={t.message}
                              num="04"
                              htmlFor={`${uid}-message`}
                              error={error}
                            >
                              <textarea
                                ref={focusOnMount}
                                id={`${uid}-message`}
                                name="message"
                                rows={3}
                                value={answers.message}
                                onChange={(e) => {
                                  setAnswers((a) => ({
                                    ...a,
                                    message: e.target.value,
                                  }));
                                  setError(null);
                                }}
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Enter" &&
                                    (e.metaKey || e.ctrlKey)
                                  ) {
                                    e.preventDefault();
                                    goNext();
                                  }
                                }}
                                placeholder={t.messagePlaceholder}
                                className={`${inputClass} resize-y md:resize-none`}
                              />
                            </StepFrame>
                          )}

                          {step === REVIEW && (
                            <div>
                              <p className="font-mono text-xs tracking-widest text-accent">
                                {`// ${t.briefCompiled}`}
                              </p>
                              <div className="relative mt-5 border border-white/10 p-6 md:p-8">
                                {/* blueprint dimension ticks */}
                                <span
                                  aria-hidden
                                  className="absolute -left-px -top-px h-3 w-3 border-l border-t border-accent/60"
                                />
                                <span
                                  aria-hidden
                                  className="absolute -right-px -top-px h-3 w-3 border-r border-t border-accent/60"
                                />
                                <span
                                  aria-hidden
                                  className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-accent/60"
                                />
                                <span
                                  aria-hidden
                                  className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-accent/60"
                                />
                                <dl className="space-y-5 font-mono text-sm">
                                  {briefRows.map((row) => (
                                    <div
                                      key={row.label}
                                      className="flex items-start gap-4"
                                    >
                                      <dt className="w-20 shrink-0 pt-0.5 text-[0.6rem] uppercase tracking-[0.3em] text-fog md:w-24">
                                        {row.label}
                                      </dt>
                                      <dd className="min-w-0 flex-1 break-words text-chalk">
                                        {row.value}
                                      </dd>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          audio.click();
                                          goTo(row.target);
                                        }}
                                        data-cursor
                                        aria-label={`${t.edit} — ${row.label}`}
                                        className="link-underline -my-2 shrink-0 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-fog transition-colors hover:text-accent"
                                      >
                                        {t.edit}
                                      </button>
                                    </div>
                                  ))}
                                </dl>
                              </div>
                              <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-fog">
                                {t.briefHint}
                              </p>

                              <div className="mt-8 flex flex-wrap items-center gap-4">
                                <button
                                  type="button"
                                  onClick={goBack}
                                  data-cursor
                                  aria-label={t.back}
                                  className="hairline flex h-11 w-11 items-center justify-center rounded-full text-mist transition-colors duration-300 hover:border-white/30 hover:text-chalk"
                                >
                                  <span aria-hidden>←</span>
                                </button>
                                <button
                                  ref={focusOnMount}
                                  type="submit"
                                  disabled={status === "sending"}
                                  data-cursor
                                  className="group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-chalk px-7 py-3 text-sm font-medium text-void transition-transform duration-300 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-70"
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
                                    <button
                                      type="button"
                                      data-cursor
                                      className="link-underline"
                                      onClick={async () => {
                                        if (await copyText(SITE.email)) toast(t.copied, "✓");
                                      }}
                                    >
                                      {SITE.email}
                                    </button>
                                    .
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {step < REVIEW && (
                            <div className="mt-8 flex flex-wrap items-center gap-4">
                              {step > 0 && (
                                <button
                                  type="button"
                                  onClick={goBack}
                                  data-cursor
                                  aria-label={t.back}
                                  className="hairline flex h-11 w-11 items-center justify-center rounded-full text-mist transition-colors duration-300 hover:border-white/30 hover:text-chalk"
                                >
                                  <span aria-hidden>←</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={goNext}
                                data-cursor
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-chalk px-7 py-3 text-sm font-medium text-void transition-transform duration-300 hover:scale-[1.03]"
                              >
                                {t.continueLabel} <span aria-hidden>→</span>
                              </button>
                              <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.3em] text-fog md:inline">
                                {step === 3 ? t.cmdEnterHint : t.enterHint}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* honeypot — hidden from humans, catches bots; stays mounted
                      across every step so the trap is always in the DOM */}
                  <input
                    ref={honeypotRef}
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  />
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Compile>
      </div>
    </section>
  );
}

/* One question's frame: numbered label, huge input, azure focus hairline,
   and an inline (never silent) validation line. */
function StepFrame({
  label,
  num,
  htmlFor,
  error,
  children,
}: {
  label: string;
  num: string;
  htmlFor: string;
  error: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="group">
      <div className="flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="eyebrow">
          {label}
        </label>
        <span className="font-mono text-[0.6rem] tracking-widest text-fog">
          {num} / 04
        </span>
      </div>
      <div className="relative mt-4">
        {children}
        <span className="absolute bottom-0 left-0 h-px w-full bg-white/12" />
        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-focus-within:scale-x-100" />
      </div>
      {error && (
        <p role="alert" className="mt-3 font-mono text-xs text-accent">
          {`// ${error}`}
        </p>
      )}
    </div>
  );
}
