"use client";

import { LegalPage, Fill } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    title: "Terms of Use",
    updated: "June 2026",
    homeLabel: "← Home",
    updatedLabel: "Last updated",
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
    useOfSite: "Utilisation du site",
    intellectualProperty: "Propriété intellectuelle",
    noAdvice: "Absence de conseil ou d'offre",
    disclaimer: "Exclusion de garantie et responsabilité",
    governingLaw: "Droit applicable",
  },
};

export function TermsView() {
  const lang = useLang();
  const t = T[lang];

  return (
    <LegalPage
      title={t.title}
      updated={t.updated}
      homeLabel={t.homeLabel}
      updatedLabel={t.updatedLabel}
    >
      <section>
        {lang === "fr" ? (
          <p>
            Les présentes conditions régissent votre utilisation de ce site,
            exploité par <Fill>[Legal entity name]</Fill> ({SITE.legal}). En
            utilisant le site, vous les acceptez.
          </p>
        ) : (
          <p>
            These terms govern your use of this website, operated by{" "}
            <Fill>[Legal entity name]</Fill> ({SITE.legal}). By using the site
            you agree to them.
          </p>
        )}
      </section>

      <section>
        <h2>{t.useOfSite}</h2>
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
      </section>

      <section>
        <h2>{t.intellectualProperty}</h2>
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
      </section>

      <section>
        <h2>{t.noAdvice}</h2>
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
      </section>

      <section>
        <h2>{t.disclaimer}</h2>
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
      </section>

      <section>
        <h2>{t.governingLaw}</h2>
        {lang === "fr" ? (
          <p>
            Les présentes conditions sont régies par le droit de la République
            tchèque, et tout litige en découlant relève de la compétence
            exclusive des tribunaux compétents de Prague.
          </p>
        ) : (
          <p>
            These terms are governed by the laws of the Czech Republic, and any
            disputes arising from them are subject to the exclusive jurisdiction
            of the competent courts of Prague.
          </p>
        )}
      </section>
    </LegalPage>
  );
}
