"use client";

import type { ReactNode } from "react";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { Fill } from "@/components/legal/LegalPage";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { SITE } from "@/lib/site";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    title: "Legal Notice",
    updated: "June 2026",
    homeLabel: "← Home",
    updatedLabel: "Last updated",
    contents: "Contents",
    company: "Company",
    contact: "Contact",
    liabilityContent: "Liability for content",
    liabilityLinks: "Liability for links",
    copyright: "Copyright",
  },
  fr: {
    title: "Mentions légales",
    updated: "Juin 2026",
    homeLabel: "← Accueil",
    updatedLabel: "Dernière mise à jour",
    contents: "Sommaire",
    company: "Société",
    contact: "Contact",
    liabilityContent: "Responsabilité du contenu",
    liabilityLinks: "Responsabilité des liens",
    copyright: "Droits d'auteur",
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

export function ImprintView() {
  const lang = useLang();
  const t = T[lang];

  const toc = [
    { id: "company", title: t.company },
    { id: "contact", title: t.contact },
    { id: "liability-content", title: t.liabilityContent },
    { id: "liability-links", title: t.liabilityLinks },
    { id: "copyright", title: t.copyright },
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
            <ChapterNumeral n="§" label="imprint" />
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
            <Clause index="01" id="company" title={t.company}>
              {lang === "fr" ? (
                <p>
                  Ce site est exploité par <Fill>ARDLABS s.r.o.</Fill>, exerçant sous
                  la dénomination {SITE.legal} — une société à responsabilité limitée
                  (s.r.o.) de droit tchèque.
                </p>
              ) : (
                <p>
                  This website is operated by <Fill>ARDLABS s.r.o.</Fill>, trading as{" "}
                  {SITE.legal} — a limited liability company (s.r.o.) under Czech law.
                </p>
              )}
              {lang === "fr" ? (
                <p>
                  Siège social :{" "}
                  <Fill>Na Příkopě 21, 110 00 Praha 1, Czech Republic</Fill>
                  <br />
                  Numéro d&rsquo;identification (IČO) : <Fill>19341698</Fill>, inscrite
                  au Registre du commerce tchèque (Městský soud v Praze, sp. zn. C
                  163956)
                  <br />
                  Capital social : <Fill>500 000 CZK</Fill>
                </p>
              ) : (
                <p>
                  Registered office:{" "}
                  <Fill>Na Příkopě 21, 110 00 Praha 1, Czech Republic</Fill>
                  <br />
                  Company ID (IČO): <Fill>19341698</Fill>, registered in the Czech
                  Commercial Register (Městský soud v Praze, sp. zn. C 163956)
                  <br />
                  Share capital: <Fill>500 000 CZK</Fill>
                </p>
              )}
            </Clause>

            <Clause index="02" id="contact" title={t.contact}>
              {lang === "fr" ? (
                <p>
                  E-mail : <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                  <br />
                  Représentée par : <Fill>Metaforbs</Fill>
                </p>
              ) : (
                <p>
                  Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                  <br />
                  Represented by: <Fill>Metaforbs</Fill>
                </p>
              )}
            </Clause>

            <Clause index="03" id="liability-content" title={t.liabilityContent}>
              {lang === "fr" ? (
                <p>
                  Le contenu de ce site a été élaboré avec soin. Nous déclinons toute
                  responsabilité quant à l&rsquo;exactitude, l&rsquo;exhaustivité ou
                  l&rsquo;actualité de ce contenu.
                </p>
              ) : (
                <p>
                  The content of this site has been prepared with care. We assume no
                  liability for the accuracy, completeness or timeliness of the
                  content.
                </p>
              )}
            </Clause>

            <Clause index="04" id="liability-links" title={t.liabilityLinks}>
              {lang === "fr" ? (
                <p>
                  Notre site peut contenir des liens vers des sites externes sur
                  lesquels nous n&rsquo;exerçons aucun contrôle. Nous déclinons toute
                  responsabilité quant à leur contenu.
                </p>
              ) : (
                <p>
                  Our site may contain links to external websites over which we have no
                  control. We accept no responsibility for their content.
                </p>
              )}
            </Clause>

            <Clause index="05" id="copyright" title={t.copyright}>
              {lang === "fr" ? (
                <p>
                  L&rsquo;ensemble du contenu, du design, du code et des éléments
                  visuels de ce site est la propriété de {SITE.legal}, sauf mention
                  contraire, et ne peut être reproduit sans autorisation écrite.
                </p>
              ) : (
                <p>
                  All content, design, code and visual assets on this site are the
                  property of {SITE.legal} unless stated otherwise, and may not be
                  reproduced without written permission.
                </p>
              )}
            </Clause>
          </div>
        </div>
      </section>
    </main>
  );
}
