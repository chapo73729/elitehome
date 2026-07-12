"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { Compile } from "@/components/ui/Compile";
import { useLang } from "@/lib/lang";
import { usePerf } from "@/lib/perf";
import { SITE } from "@/lib/site";

/* ============================================================
   Security posture — we sell security engineering, so our own
   should be inspectable. Every claim on this page corresponds
   to a measure actually configured on this platform (see
   next.config.ts headers + the contact API route) and can be
   verified from outside the site.
   ============================================================ */

const T = {
  en: {
    home: "← Home",
    eyebrow: "Security posture",
    h1: "Our own security, in the open.",
    intro:
      "We engineer security for clients — so ours should be inspectable. This page lists how this platform itself is secured. Nothing here is aspirational: every claim is live in production, and you can verify each one from outside.",
    transportEyebrow: "Transport & isolation",
    transport: [
      { t: "HTTPS with strict transport security", d: "Every request is served over TLS. HSTS is set for two years with includeSubDomains and preload, so browsers refuse to ever downgrade." },
      { t: "Content-Security-Policy on every response", d: "A restrictive CSP limits where scripts, styles and media may load from, shutting down whole classes of injection attacks." },
      { t: "Cross-origin isolation", d: "Cross-Origin-Opener-Policy and Cross-Origin-Resource-Policy are pinned to same-origin — our browsing context and resources are isolated from other sites." },
      { t: "No embedding, no sniffing, no referrers", d: "X-Frame-Options: DENY (the site can never be framed), X-Content-Type-Options: nosniff, and Referrer-Policy: no-referrer — we leak nothing about your visit to anyone." },
      { t: "Hardware APIs denied by default", d: "The Permissions-Policy disables camera, microphone, geolocation, payment, USB, Bluetooth and a dozen other browser capabilities this site has no business using." },
    ],
    dataEyebrow: "Data minimisation",
    data: [
      { t: "No third-party trackers", d: "No advertising pixels, no fingerprinting, no cross-site anything. Only essential storage for your preferences — exactly what the cookie notice says." },
      { t: "The form sends only what you type", d: "The contact endpoint receives the fields you fill in, nothing more, and is rate-limited to blunt abuse and scraping." },
      { t: "Anonymous, aggregate analytics", d: "Traffic measurement is cookieless and aggregate. We can see that a page was visited — not who you are." },
    ],
    verifyEyebrow: "Verify it yourself",
    verifyIntro:
      "Don't take our word for it. Anyone can audit these claims in under a minute:",
    verifySteps: [
      { cmd: `curl -sI https://${SITE.domain} | grep -iE "strict-transport|content-security|x-frame"`, d: "Read the security headers straight off the wire." },
      { cmd: `https://www.ssllabs.com/ssltest/analyze.html?d=${SITE.domain}`, d: "Grade the TLS configuration with Qualys SSL Labs." },
      { cmd: `https://securityheaders.com/?q=${SITE.domain}`, d: "Score the full response-header set." },
      { cmd: `https://${SITE.domain}/.well-known/security.txt`, d: "Our machine-readable disclosure policy, where researchers expect it." },
    ],
    disclosureEyebrow: "Responsible disclosure",
    disclosureTitle: "Found something? Tell us.",
    disclosure: [
      `If you believe you have found a vulnerability in ${SITE.domain} or any service we operate, write to ${SITE.email} with enough detail to reproduce it. We read every report.`,
      "We acknowledge reports quickly — typically within 72 hours — and keep you informed while we fix. We will never pursue legal action against good-faith research that respects user data and avoids service disruption.",
      "We are happy to credit researchers who report responsibly, if they wish.",
    ],
    ctaTitle: "This is the standard we bring to client work.",
    ctaBody: "The same discipline — headers, minimisation, verifiability — applied to your platform.",
    cta: "Start a conversation",
  },
  fr: {
    home: "← Accueil",
    eyebrow: "Posture de sécurité",
    h1: "Notre propre sécurité, à découvert.",
    intro:
      "Nous concevons la sécurité de nos clients — la nôtre doit donc être inspectable. Cette page liste comment cette plateforme elle-même est sécurisée. Rien ici n'est déclaratif : chaque mesure est en production, et chacune se vérifie de l'extérieur.",
    transportEyebrow: "Transport & isolation",
    transport: [
      { t: "HTTPS avec sécurité de transport stricte", d: "Chaque requête est servie en TLS. HSTS est fixé à deux ans avec includeSubDomains et preload : les navigateurs refusent définitivement tout retour au HTTP." },
      { t: "Content-Security-Policy sur chaque réponse", d: "Une CSP restrictive limite les origines des scripts, styles et médias, neutralisant des classes entières d'attaques par injection." },
      { t: "Isolation cross-origin", d: "Cross-Origin-Opener-Policy et Cross-Origin-Resource-Policy sont verrouillés en same-origin — notre contexte de navigation et nos ressources sont isolés des autres sites." },
      { t: "Ni intégration, ni sniffing, ni referrer", d: "X-Frame-Options : DENY (le site ne peut jamais être encadré), X-Content-Type-Options : nosniff, et Referrer-Policy : no-referrer — nous ne divulguons rien de votre visite, à personne." },
      { t: "APIs matérielles refusées par défaut", d: "La Permissions-Policy désactive caméra, micro, géolocalisation, paiement, USB, Bluetooth et une douzaine d'autres capacités dont ce site n'a aucun usage." },
    ],
    dataEyebrow: "Minimisation des données",
    data: [
      { t: "Aucun traqueur tiers", d: "Pas de pixel publicitaire, pas de fingerprinting, rien de cross-site. Uniquement le stockage essentiel de vos préférences — exactement ce qu'annonce le bandeau." },
      { t: "Le formulaire n'envoie que ce que vous tapez", d: "Le point de contact reçoit les champs que vous remplissez, rien de plus, et il est limité en débit pour contrer l'abus et le scraping." },
      { t: "Mesure d'audience anonyme et agrégée", d: "La mesure de trafic est sans cookie et agrégée. Nous voyons qu'une page a été visitée — pas qui vous êtes." },
    ],
    verifyEyebrow: "Vérifiez par vous-même",
    verifyIntro:
      "Ne nous croyez pas sur parole. N'importe qui peut auditer ces affirmations en moins d'une minute :",
    verifySteps: [
      { cmd: `curl -sI https://${SITE.domain} | grep -iE "strict-transport|content-security|x-frame"`, d: "Lire les en-têtes de sécurité directement sur le réseau." },
      { cmd: `https://www.ssllabs.com/ssltest/analyze.html?d=${SITE.domain}`, d: "Noter la configuration TLS avec Qualys SSL Labs." },
      { cmd: `https://securityheaders.com/?q=${SITE.domain}`, d: "Évaluer l'ensemble des en-têtes de réponse." },
      { cmd: `https://${SITE.domain}/.well-known/security.txt`, d: "Notre politique de divulgation lisible par machine, là où les chercheurs l'attendent." },
    ],
    disclosureEyebrow: "Divulgation responsable",
    disclosureTitle: "Vous avez trouvé quelque chose ? Dites-le-nous.",
    disclosure: [
      `Si vous pensez avoir découvert une vulnérabilité sur ${SITE.domain} ou un service que nous opérons, écrivez à ${SITE.email} avec assez de détails pour la reproduire. Nous lisons chaque signalement.`,
      "Nous accusons réception rapidement — typiquement sous 72 heures — et vous tenons informé pendant la correction. Nous n'engagerons jamais de poursuites contre une recherche de bonne foi qui respecte les données des utilisateurs et évite toute interruption de service.",
      "Nous créditons volontiers les chercheurs qui signalent de manière responsable, s'ils le souhaitent.",
    ],
    ctaTitle: "C'est le standard que nous appliquons aux projets clients.",
    ctaBody: "La même discipline — en-têtes, minimisation, vérifiabilité — appliquée à votre plateforme.",
    cta: "Démarrer la conversation",
  },
} as const;

function Row({ t: title, d, n }: { t: string; d: string; n: string }) {
  return (
    <div className="grid items-baseline gap-x-6 gap-y-2 py-7 hairline-t md:grid-cols-12">
      <span className="font-mono text-xs text-accent tabular-nums md:col-span-1">{n}</span>
      <h3 className="font-display text-xl font-semibold tracking-tight text-chalk md:col-span-4">{title}</h3>
      <p className="max-w-lg leading-relaxed text-mist md:col-span-7">{d}</p>
    </div>
  );
}

export function SecurityView() {
  const t = T[useLang()];
  const perf = usePerf();

  return (
    <main className="relative">
      {/* ---------- HEADER ---------- */}
      <section className="relative overflow-hidden pb-10 pt-40">
        <PageHeaderFX accent="#4f8cff" />
        <div className="container-x relative">
          <ChapterNumeral n="05" label="POSTURE" />
          <div className="relative z-10">
            <Reveal>
              <LocaleLink href="/" data-cursor className="link-underline font-mono text-xs tracking-widest text-mist">
                {t.home}
              </LocaleLink>
            </Reveal>
            <Reveal delay={0.06}>
              <span className="eyebrow mt-8 block">{t.eyebrow}</span>
            </Reveal>
            <Reveal delay={0.12}>
              <h1 className="text-giant text-gradient mt-5 max-w-3xl text-balance">{t.h1}</h1>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-6 max-w-2xl text-balance text-lg text-mist">{t.intro}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- TRANSPORT & ISOLATION ---------- */}
      <section className="relative z-10 bg-void py-16 md:py-24">
        <div className="container-x">
          <Reveal>
            <h2 className="eyebrow">{t.transportEyebrow}</h2>
          </Reveal>
          <Compile label="headers" index="01" disabled={perf} className="mt-10">
            <div className="border-b border-white/[0.07]">
              {t.transport.map((row, i) => (
                <Reveal key={row.t} delay={Math.min(i * 0.05, 0.25)}>
                  <Row n={String(i + 1).padStart(2, "0")} t={row.t} d={row.d} />
                </Reveal>
              ))}
            </div>
          </Compile>
        </div>
      </section>

      {/* ---------- DATA MINIMISATION ---------- */}
      <section className="relative z-10 bg-void pb-16 md:pb-24">
        <div className="container-x">
          <Reveal>
            <h2 className="eyebrow">{t.dataEyebrow}</h2>
          </Reveal>
          <Compile label="data" index="02" disabled={perf} className="mt-10">
            <div className="border-b border-white/[0.07]">
              {t.data.map((row, i) => (
                <Reveal key={row.t} delay={Math.min(i * 0.05, 0.25)}>
                  <Row n={String(i + 1).padStart(2, "0")} t={row.t} d={row.d} />
                </Reveal>
              ))}
            </div>
          </Compile>
        </div>
      </section>

      {/* ---------- VERIFY IT YOURSELF ---------- */}
      <section className="relative z-10 bg-void pb-16 md:pb-24">
        <div className="container-x">
          <Reveal>
            <h2 className="eyebrow">{t.verifyEyebrow}</h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-6 max-w-2xl text-mist">{t.verifyIntro}</p>
          </Reveal>
          <Compile label="verify" index="03" disabled={perf} className="mt-10">
            <div className="spot-card lit-top overflow-hidden rounded-xl border border-chalk/10 bg-[#05070c]">
              {t.verifySteps.map((s, i) => (
                <Reveal key={s.cmd} delay={Math.min(i * 0.05, 0.25)}>
                  <div className={`px-5 py-5 md:px-7 ${i > 0 ? "hairline-t" : ""}`}>
                    <div className="overflow-x-auto">
                      <code className="whitespace-nowrap font-mono text-[0.72rem] leading-relaxed text-accent-2">
                        {s.cmd.startsWith("http") ? (
                          <a href={s.cmd} target="_blank" rel="noopener noreferrer" data-cursor className="link-underline">
                            {s.cmd}
                          </a>
                        ) : (
                          <>
                            <span aria-hidden className="select-none text-fog">$ </span>
                            {s.cmd}
                          </>
                        )}
                      </code>
                    </div>
                    <p className="mt-2 text-sm text-mist">{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Compile>
        </div>
      </section>

      {/* ---------- RESPONSIBLE DISCLOSURE ---------- */}
      <section className="relative z-10 bg-void pb-20 md:pb-28">
        <div className="container-x">
          <Reveal>
            <h2 className="eyebrow">{t.disclosureEyebrow}</h2>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-section-title mt-6 max-w-2xl text-chalk">{t.disclosureTitle}</h2>
          </Reveal>
          <div className="mt-8 max-w-2xl space-y-5">
            {t.disclosure.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.05}>
                <p className="leading-relaxed text-mist">{p}</p>
              </Reveal>
            ))}
          </div>

          {/* CTA */}
          <Reveal delay={0.2}>
            <div className="mt-20 hairline-t pt-10">
              <p className="font-display text-2xl font-semibold tracking-tight text-chalk md:text-3xl">{t.ctaTitle}</p>
              <p className="mt-3 max-w-xl text-mist">{t.ctaBody}</p>
              <LocaleLink
                href="/contact"
                data-cursor
                className="mt-8 inline-block rounded-full bg-chalk px-7 py-3 text-sm font-medium text-void transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {t.cta}
              </LocaleLink>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
