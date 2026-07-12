"use client";

import type { ReactNode } from "react";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { Fill } from "@/components/legal/LegalPage";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { SITE } from "@/lib/site";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    title: "Privacy Policy",
    updated: "June 2026",
    homeLabel: "← Home",
    updatedLabel: "Last updated",
    contents: "Contents",
    dataWeCollect: "Data we collect",
    howWeUseIt: "How we use it",
    processors: "Processors",
    retention: "Retention",
    yourRights: "Your rights",
    cookies: "Cookies",
    contact: "Contact",
  },
  fr: {
    title: "Politique de confidentialité",
    updated: "Juin 2026",
    homeLabel: "← Accueil",
    updatedLabel: "Dernière mise à jour",
    contents: "Sommaire",
    dataWeCollect: "Données que nous collectons",
    howWeUseIt: "Utilisation des données",
    processors: "Sous-traitants",
    retention: "Conservation",
    yourRights: "Vos droits",
    cookies: "Cookies",
    contact: "Contact",
  },
};

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Numbered clause — mono register mark, hairline running out, prose measure. */
function Clause({
  index,
  id,
  title,
  children,
}: {
  index: string;
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-xs text-accent tabular-nums">{index}</span>
        <h2 className="font-display text-xl font-semibold tracking-tight text-chalk md:text-2xl">
          {title}
        </h2>
        <span className="h-px flex-1 self-center bg-gradient-to-r from-white/15 to-transparent" />
      </div>
      <div className="mt-5 max-w-[40rem] space-y-4 leading-relaxed text-mist [&_a]:text-chalk [&_a]:underline">
        {children}
      </div>
    </section>
  );
}

export function PrivacyView() {
  const lang = useLang();
  const t = T[lang];

  const toc = [
    { id: "data-we-collect", title: t.dataWeCollect },
    { id: "how-we-use-it", title: t.howWeUseIt },
    { id: "processors", title: t.processors },
    { id: "retention", title: t.retention },
    { id: "your-rights", title: t.yourRights },
    { id: "cookies", title: t.cookies },
    { id: "contact", title: t.contact },
  ];

  return (
    <main className="relative">
      {/* ---------- HEADER — ghost section mark, mono dateline ---------- */}
      <section className="relative overflow-hidden pb-12 pt-40">
        <div className="container-x relative">
          <LocaleLink
            href="/"
            data-cursor
            className="link-underline font-mono text-xs tracking-widest text-mist"
          >
            {t.homeLabel}
          </LocaleLink>
          <div className="relative mt-12">
            <ChapterNumeral n="§" label="privacy" />
            <div className="relative z-10">
              <h1 className="text-giant text-gradient max-w-3xl text-balance">
                {t.title}
              </h1>
              <p className="mt-5 font-mono text-xs tracking-widest text-fog">
                {t.updatedLabel} · {t.updated}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- BODY — mono TOC left, numbered clauses right ---------- */}
      <section className="relative z-10 bg-void pb-32 pt-6">
        <div className="container-x grid gap-x-12 gap-y-14 lg:grid-cols-12">
          <nav aria-label={t.contents} className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-accent">§</span>
                <span className="eyebrow">{t.contents}</span>
                <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
              </div>
              <ol className="mt-6 border-b border-white/[0.07]">
                {toc.map((s, i) => (
                  <li key={s.id} className="hairline-t">
                    <a
                      href={`#${s.id}`}
                      data-cursor
                      className="group flex items-baseline gap-4 py-3 font-mono text-xs tracking-wider text-mist transition-colors hover:text-chalk"
                    >
                      <span className="text-accent tabular-nums">{pad2(i + 1)}</span>
                      <span className="flex-1">{s.title}</span>
                      <span
                        aria-hidden
                        className="text-fog transition-transform duration-300 group-hover:translate-y-0.5"
                      >
                        ↓
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="space-y-14 lg:col-span-8">
            {/* lede — controller statement, above the numbered clauses */}
            <div className="max-w-[40rem] leading-relaxed text-mist [&_a]:text-chalk [&_a]:underline">
              {lang === "fr" ? (
                <p>
                  La présente politique explique comment{" "}
                  <Fill>BLACKFIRST Sàrl</Fill> ({SITE.legal}) traite les données à
                  caractère personnel lorsque vous visitez ce site ou nous contactez.
                  Nous agissons en qualité de responsable du traitement.
                </p>
              ) : (
                <p>
                  This policy explains how <Fill>BLACKFIRST Sàrl</Fill> (
                  {SITE.legal}) processes personal data when you visit this website or
                  contact us. We act as the data controller.
                </p>
              )}
            </div>

            <Clause index="01" id="data-we-collect" title={t.dataWeCollect}>
              {lang === "fr" ? (
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <strong className="text-chalk">Données de contact</strong> — le
                    nom, l&rsquo;adresse électronique, le domaine sélectionné et le
                    message que vous transmettez via notre formulaire de contact.
                  </li>
                  <li>
                    <strong className="text-chalk">Données techniques</strong> — les
                    informations standard des journaux serveur (adresse IP,
                    navigateur, horodatage) traitées par notre hébergeur afin de
                    fournir et de sécuriser le site.
                  </li>
                </ul>
              ) : (
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <strong className="text-chalk">Contact data</strong> — the name,
                    email address, selected domain and message you submit through our
                    contact form.
                  </li>
                  <li>
                    <strong className="text-chalk">Technical data</strong> — standard
                    server log information (IP address, browser, timestamp) processed
                    by our hosting provider to deliver and secure the site.
                  </li>
                </ul>
              )}
            </Clause>

            <Clause index="02" id="how-we-use-it" title={t.howWeUseIt}>
              {lang === "fr" ? (
                <p>
                  Nous utilisons les données de contact uniquement pour répondre à
                  votre demande, sur le fondement de votre consentement et de notre
                  intérêt légitime à vous répondre. Les données techniques servent à
                  exploiter, sécuriser et améliorer le site.
                </p>
              ) : (
                <p>
                  We use contact data solely to respond to your enquiry, on the basis
                  of your consent and our legitimate interest in answering you.
                  Technical data is used to operate, secure and improve the website.
                </p>
              )}
            </Clause>

            <Clause index="03" id="processors" title={t.processors}>
              {lang === "fr" ? (
                <p>
                  Nous faisons appel à des prestataires sélectionnés pour exploiter le
                  site et traiter les soumissions de formulaires (par exemple notre
                  hébergeur et notre service d&rsquo;acheminement des formulaires). Ils
                  traitent les données pour notre compte dans le cadre
                  d&rsquo;accords appropriés.
                </p>
              ) : (
                <p>
                  We rely on selected service providers to operate the site and handle
                  form submissions (e.g. our hosting provider and form-delivery
                  service). They process data on our behalf under appropriate
                  agreements.
                </p>
              )}
            </Clause>

            <Clause index="04" id="retention" title={t.retention}>
              {lang === "fr" ? (
                <p>
                  Nous conservons les données relatives aux demandes uniquement
                  pendant la durée nécessaire au traitement de votre demande et au
                  respect de nos obligations légales.
                </p>
              ) : (
                <p>
                  We keep enquiry data only as long as necessary to handle your
                  request and to comply with legal obligations.
                </p>
              )}
            </Clause>

            <Clause index="05" id="your-rights" title={t.yourRights}>
              {lang === "fr" ? (
                <p>
                  Sous réserve du droit applicable, vous pouvez demander l&rsquo;accès,
                  la rectification, l&rsquo;effacement, la limitation ou la
                  portabilité de vos données, ainsi que vous opposer à leur
                  traitement. Pour exercer ces droits, contactez{" "}
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Vous disposez
                  également du droit d&rsquo;introduire une réclamation auprès du
                  Préposé fédéral à la protection des données et à la transparence
                  (PFPDT).
                </p>
              ) : (
                <p>
                  Subject to applicable law, you may request access, correction,
                  deletion, restriction or portability of your data, and object to its
                  processing. To exercise these rights, contact{" "}
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. You also have the
                  right to lodge a complaint with the Swiss Federal Data Protection
                  and Information Commissioner (FDPIC).
                </p>
              )}
            </Clause>

            <Clause index="06" id="cookies" title={t.cookies}>
              {lang === "fr" ? (
                <p>
                  Ce site n&rsquo;utilise que les cookies / le stockage local
                  nécessaires à son fonctionnement et à la mémorisation de vos
                  préférences (telles que le son et le thème). Aucun cookie
                  publicitaire ou de traçage tiers n&rsquo;est déposé sans votre
                  consentement.
                </p>
              ) : (
                <p>
                  This site uses only the cookies/local storage required for it to
                  function and to remember your preferences (such as sound and theme).
                  No advertising or third-party tracking cookies are set without your
                  consent.
                </p>
              )}
            </Clause>

            <Clause index="07" id="contact" title={t.contact}>
              {lang === "fr" ? (
                <p>
                  Questions concernant la présente politique :{" "}
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                </p>
              ) : (
                <p>
                  Questions about this policy:{" "}
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                </p>
              )}
            </Clause>
          </div>
        </div>
      </section>
    </main>
  );
}
