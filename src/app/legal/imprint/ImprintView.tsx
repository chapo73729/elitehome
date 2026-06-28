"use client";

import { LegalPage, Fill } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    title: "Legal Notice",
    updated: "June 2026",
    homeLabel: "← Home",
    updatedLabel: "Last updated",
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
    company: "Société",
    contact: "Contact",
    liabilityContent: "Responsabilité du contenu",
    liabilityLinks: "Responsabilité des liens",
    copyright: "Droits d'auteur",
  },
};

export function ImprintView() {
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
        <h2>{t.company}</h2>
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
            Numéro d&rsquo;identification (IČO) : <Fill>12345678</Fill>, inscrite
            au Registre du commerce tchèque (Městský soud v Praze, sp. zn. C
            123456)
            <br />
            Numéro de TVA (DIČ) : <Fill>CZ12345678</Fill>
            <br />
            Capital social : <Fill>200 000 CZK</Fill>
          </p>
        ) : (
          <p>
            Registered office:{" "}
            <Fill>Na Příkopě 21, 110 00 Praha 1, Czech Republic</Fill>
            <br />
            Company ID (IČO): <Fill>12345678</Fill>, registered in the Czech
            Commercial Register (Městský soud v Praze, sp. zn. C 123456)
            <br />
            VAT no. (DIČ): <Fill>CZ12345678</Fill>
            <br />
            Share capital: <Fill>200 000 CZK</Fill>
          </p>
        )}
        {lang === "fr" ? (
          <p>
            <em>
              Les informations d&rsquo;immatriculation ci-dessus sont des valeurs
              fictives destinées à cette démonstration et doivent être remplacées
              par les données réelles de la société avant la mise en ligne.
            </em>
          </p>
        ) : (
          <p>
            <em>
              The registration details above are placeholder values for this
              demonstration and must be replaced with the company&rsquo;s real
              data before launch.
            </em>
          </p>
        )}
      </section>

      <section>
        <h2>{t.contact}</h2>
        {lang === "fr" ? (
          <p>
            Courriel : <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <br />
            Représentée par : <Fill>[Représentant autorisé / gérant]</Fill>
          </p>
        ) : (
          <p>
            Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <br />
            Represented by: <Fill>[Authorised representative / director]</Fill>
          </p>
        )}
      </section>

      <section>
        <h2>{t.liabilityContent}</h2>
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
      </section>

      <section>
        <h2>{t.liabilityLinks}</h2>
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
      </section>

      <section>
        <h2>{t.copyright}</h2>
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
      </section>
    </LegalPage>
  );
}
