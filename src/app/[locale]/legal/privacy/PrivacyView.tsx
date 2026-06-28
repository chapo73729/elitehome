"use client";

import { LegalPage, Fill } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    title: "Privacy Policy",
    updated: "June 2026",
    homeLabel: "← Home",
    updatedLabel: "Last updated",
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
    dataWeCollect: "Données que nous collectons",
    howWeUseIt: "Utilisation des données",
    processors: "Sous-traitants",
    retention: "Conservation",
    yourRights: "Vos droits",
    cookies: "Cookies",
    contact: "Contact",
  },
};

export function PrivacyView() {
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
            La présente politique explique comment{" "}
            <Fill>[Legal entity name]</Fill> ({SITE.legal}) traite les données à
            caractère personnel lorsque vous visitez ce site ou nous contactez.
            Nous agissons en qualité de responsable du traitement.
          </p>
        ) : (
          <p>
            This policy explains how <Fill>[Legal entity name]</Fill> (
            {SITE.legal}) processes personal data when you visit this website or
            contact us. We act as the data controller.
          </p>
        )}
      </section>

      <section>
        <h2>{t.dataWeCollect}</h2>
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
      </section>

      <section>
        <h2>{t.howWeUseIt}</h2>
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
      </section>

      <section>
        <h2>{t.processors}</h2>
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
      </section>

      <section>
        <h2>{t.retention}</h2>
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
      </section>

      <section>
        <h2>{t.yourRights}</h2>
        {lang === "fr" ? (
          <p>
            Sous réserve du droit applicable, vous pouvez demander l&rsquo;accès,
            la rectification, l&rsquo;effacement, la limitation ou la
            portabilité de vos données, ainsi que vous opposer à leur
            traitement. Pour exercer ces droits, contactez{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Vous disposez
            également du droit d&rsquo;introduire une réclamation auprès de
            l&rsquo;autorité tchèque de protection des données (Úřad pro ochranu
            osobních údajů).
          </p>
        ) : (
          <p>
            Subject to applicable law, you may request access, correction,
            deletion, restriction or portability of your data, and object to its
            processing. To exercise these rights, contact{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. You also have the
            right to lodge a complaint with the Czech Data Protection Authority
            (Úřad pro ochranu osobních údajů).
          </p>
        )}
      </section>

      <section>
        <h2>{t.cookies}</h2>
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
      </section>

      <section>
        <h2>{t.contact}</h2>
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
      </section>
    </LegalPage>
  );
}
