import type { Metadata } from "next";
import { LegalPage, Fill } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Legal Notice",
  description: "Legal notice and company information for ARDLABS®.",
  alternates: { canonical: "/legal/imprint" },
  robots: { index: true, follow: true },
};

export default function Imprint() {
  return (
    <LegalPage title="Legal Notice" updated="June 2026">
      <section>
        <h2>Company</h2>
        <p>
          This website is operated by <Fill>[Legal entity name]</Fill>, trading
          as {SITE.legal}.
        </p>
        <p>
          Registered office: <Fill>[Street, postal code, city, country]</Fill>
          <br />
          Commercial register no.: <Fill>[e.g. CHE-XXX.XXX.XXX]</Fill>
          <br />
          VAT no.: <Fill>[VAT number]</Fill>
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <br />
          Represented by: <Fill>[Authorised representative / director]</Fill>
        </p>
      </section>

      <section>
        <h2>Liability for content</h2>
        <p>
          The content of this site has been prepared with care. We assume no
          liability for the accuracy, completeness or timeliness of the content.
        </p>
      </section>

      <section>
        <h2>Liability for links</h2>
        <p>
          Our site may contain links to external websites over which we have no
          control. We accept no responsibility for their content.
        </p>
      </section>

      <section>
        <h2>Copyright</h2>
        <p>
          All content, design, code and visual assets on this site are the
          property of {SITE.legal} unless stated otherwise, and may not be
          reproduced without written permission.
        </p>
      </section>
    </LegalPage>
  );
}
