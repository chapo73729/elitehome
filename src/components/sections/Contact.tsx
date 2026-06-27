"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/site";

const FIELDS = ["AI", "Software", "Automation", "Industrial", "Strategy", "Maritime"];

export function Contact() {
  const [sent, setSent] = useState(false);
  const [field, setField] = useState<string>("AI");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const message = String(data.get("message") || "");
    const subject = encodeURIComponent(`ARDLABS enquiry — ${field}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nDomain: ${field}\n\n${message}`
    );
    // graceful fallback: open the user's mail client pre-filled
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" className="relative z-10 scroll-mt-24 overflow-hidden bg-void py-28 md:py-40">
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
              <span className="eyebrow">Contact · Section 14</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="text-giant text-gradient mt-6 max-w-xl text-balance">
                Let&apos;s build the improbable.
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-balance text-mist">
                We partner with a small number of founders, operators and
                institutions each year. Tell us what you&apos;re trying to make
                inevitable.
              </p>
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
                      <span className="text-2xl text-accent-2">✓</span>
                    </div>
                    <h3 className="mt-6 font-display text-2xl text-chalk">
                      Transmission opened.
                    </h3>
                    <p className="mt-3 max-w-xs text-sm text-mist">
                      Your mail client should be composing a message to our team.
                      We respond to every signal worth answering.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="link-underline mt-8 text-sm text-mist"
                    >
                      Send another
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
                    <Input name="name" label="Name" placeholder="Ada Lovelace" required />
                    <Input
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="you@company.com"
                      required
                    />
                    <div>
                      <label className="eyebrow mb-3 block">Domain</label>
                      <div className="flex flex-wrap gap-2">
                        {FIELDS.map((f) => (
                          <button
                            type="button"
                            key={f}
                            onClick={() => setField(f)}
                            className={`rounded-full px-4 py-1.5 font-mono text-xs transition-colors duration-300 ${
                              field === f
                                ? "bg-chalk text-void"
                                : "hairline text-mist hover:text-chalk"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="eyebrow mb-3 block">Message</label>
                      <textarea
                        name="message"
                        rows={4}
                        required
                        placeholder="What are you building?"
                        className="w-full resize-none rounded-2xl border border-white/10 bg-void/60 px-4 py-3 text-sm text-chalk outline-none transition-colors placeholder:text-fog focus:border-accent/50"
                      />
                    </div>
                    <Button>
                      Transmit
                      <span aria-hidden>→</span>
                    </Button>
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

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="eyebrow mb-3 block">{label}</label>
      <input
        {...props}
        className="w-full rounded-2xl border border-white/10 bg-void/60 px-4 py-3 text-sm text-chalk outline-none transition-colors placeholder:text-fog focus:border-accent/50"
      />
    </div>
  );
}
