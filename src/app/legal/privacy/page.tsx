import type { Metadata } from "next";
import { LegalPage, Fill } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ARDLABS® collects, uses and protects personal data.",
  alternates: { canonical: "/legal/privacy" },
};

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="June 2026">
      <section>
        <p>
          This policy explains how <Fill>[Legal entity name]</Fill> ({SITE.legal})
          processes personal data when you visit this website or contact us. We
          act as the data controller.
        </p>
      </section>

      <section>
        <h2>Data we collect</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-chalk">Contact data</strong> — the name,
            email address, selected domain and message you submit through our
            contact form.
          </li>
          <li>
            <strong className="text-chalk">Technical data</strong> — standard
            server log information (IP address, browser, timestamp) processed by
            our hosting provider to deliver and secure the site.
          </li>
        </ul>
      </section>

      <section>
        <h2>How we use it</h2>
        <p>
          We use contact data solely to respond to your enquiry, on the basis of
          your consent and our legitimate interest in answering you. Technical
          data is used to operate, secure and improve the website.
        </p>
      </section>

      <section>
        <h2>Processors</h2>
        <p>
          We rely on selected service providers to operate the site and handle
          form submissions (e.g. our hosting provider and form-delivery
          service). They process data on our behalf under appropriate
          agreements.
        </p>
      </section>

      <section>
        <h2>Retention</h2>
        <p>
          We keep enquiry data only as long as necessary to handle your request
          and to comply with legal obligations.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          Subject to applicable law, you may request access, correction,
          deletion, restriction or portability of your data, and object to its
          processing. To exercise these rights, contact{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. You also have the
          right to lodge a complaint with the Czech Data Protection Authority
          (Úřad pro ochranu osobních údajů).
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          This site uses only the cookies/local storage required for it to
          function and to remember your preferences (such as sound and theme).
          No advertising or third-party tracking cookies are set without your
          consent.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about this policy: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
