"use client";

import type { ReactNode } from "react";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { Fill } from "@/components/legal/LegalPage";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { SITE } from "@/lib/site";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    title: "Terms of Use",
    updated: "June 2026",
    homeLabel: "← Home",
    updatedLabel: "Last updated",
    contents: "Contents",
    useOfSite: "Use of the site",
    intellectualProperty: "Intellectual property",
    noAdvice: "No advice or offer",
    disclaimer: "Disclaimer & liability",
    governingLaw: "Governing law",
  },
  fr: {
    title: "Conditions d'utilisation",
    updated: "Juin 2026",
    homeLabel: "← Accueil",
    updatedLabel: "Dernière mise à jour",
    contents: "Sommaire",
    useOfSite: "Utilisation du site",
    intellectualProperty: "Propriété intellectuelle",
    noAdvice: "Absence de conseil ou d'offre",
    disclaimer: "Exclusion de garantie et responsabilité",
    governingLaw: "Droit applicable",
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

export function TermsView() {
  const lang = useLang();
  const t = T[lang];

  const toc = [
    { id: "use-of-site", title: t.useOfSite },
    { id: "intellectual-property", title: t.intellectualProperty },
    { id: "no-advice", title: t.noAdvice },
    { id: "disclaimer", title: t.disclaimer },
    { id: "governing-law", title: t.governingLaw },
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
            <ChapterNumeral n="§" label="terms" />
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
            {/* lede — acceptance statement, above the numbered clauses */}
            <div className="max-w-[40rem] leading-relaxed text-mist [&_a]:text-chalk [&_a]:underline">
              {lang === "fr" ? (
                <p>
                  Les présentes conditions régissent votre utilisation de ce site,
                  exploité par <Fill>BLACKFIRST Sàrl</Fill> ({SITE.legal}). En
                  utilisant le site, vous les acceptez.
                </p>
              ) : (
                <p>
                  These terms govern your use of this website, operated by{" "}
                  <Fill>BLACKFIRST Sàrl</Fill> ({SITE.legal}). By using the site
                  you agree to them.
                </p>
              )}
            </div>

            <Clause index="01" id="use-of-site" title={t.useOfSite}>
              {lang === "fr" ? (
                <p>
                  Vous pouvez consulter le site et interagir avec lui à des fins
                  licites, personnelles et professionnelles. Vous vous engagez à ne
                  pas en faire un usage abusif, à ne pas tenter de le perturber et à ne
                  pas y accéder par des moyens automatisés sans autorisation.
                </p>
              ) : (
                <p>
                  You may view and interact with the site for lawful, personal and
                  professional purposes. You agree not to misuse it, attempt to disrupt
                  it, or access it through automated means without permission.
                </p>
              )}
            </Clause>

            <Clause
              index="02"
              id="intellectual-property"
              title={t.intellectualProperty}
            >
              {lang === "fr" ? (
                <p>
                  L&rsquo;ensemble des marques, contenus, éléments de design et du code
                  source appartiennent à {SITE.legal} ou à ses concédants de licence et
                  sont protégés par la loi. Aucun droit n&rsquo;est concédé en dehors
                  de ce qui est expressément stipulé.
                </p>
              ) : (
                <p>
                  All trademarks, content, design and source code are owned by{" "}
                  {SITE.legal} or its licensors and are protected by law. No rights are
                  granted except as expressly stated.
                </p>
              )}
            </Clause>

            <Clause index="03" id="no-advice" title={t.noAdvice}>
              {lang === "fr" ? (
                <p>
                  Le contenu de ce site est fourni à titre d&rsquo;information générale
                  uniquement. Il ne constitue ni un conseil professionnel, financier ou
                  en investissement, ni une offre ou une sollicitation de quelque
                  nature que ce soit.
                </p>
              ) : (
                <p>
                  Content on this site is provided for general information only. It
                  does not constitute professional, financial or investment advice,
                  nor an offer or solicitation of any kind.
                </p>
              )}
            </Clause>

            <Clause index="04" id="disclaimer" title={t.disclaimer}>
              {lang === "fr" ? (
                <p>
                  Le site est fourni « en l&rsquo;état », sans garantie d&rsquo;aucune
                  sorte. Dans les limites autorisées par la loi, {SITE.legal} ne saurait
                  être tenue responsable de tout dommage résultant de
                  l&rsquo;utilisation du site ou de l&rsquo;impossibilité de
                  l&rsquo;utiliser.
                </p>
              ) : (
                <p>
                  The site is provided &ldquo;as is&rdquo; without warranties of any
                  kind. To the extent permitted by law, {SITE.legal} is not liable for
                  any damages arising from use of, or inability to use, the site.
                </p>
              )}
            </Clause>

            <Clause index="05" id="governing-law" title={t.governingLaw}>
              {lang === "fr" ? (
                <p>
                  Les présentes conditions sont régies par le droit suisse, et tout
                  litige en découlant relève de la compétence exclusive des tribunaux
                  compétents de Genève, Suisse.
                </p>
              ) : (
                <p>
                  These terms are governed by the laws of Switzerland, and any
                  disputes arising from them are subject to the exclusive jurisdiction
                  of the competent courts of Geneva, Switzerland.
                </p>
              )}
            </Clause>
          </div>
        </div>
      </section>
    </main>
  );
}
