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
          This website is operated by <Fill>ARDLABS s.r.o.</Fill>, trading as{" "}
          {SITE.legal} — a limited liability company (s.r.o.) under Czech law.
        </p>
        <p>
          Registered office: <Fill>Na Příkopě 21, 110 00 Praha 1, Czech Republic</Fill>
          <br />
          Company ID (IČO): <Fill>12345678</Fill>, registered in the Czech
          Commercial Register (Městský soud v Praze, sp. zn. C 123456)
          <br />
          VAT no. (DIČ): <Fill>CZ12345678</Fill>
          <br />
          Share capital: <Fill>200 000 CZK</Fill>
        </p>
        <p>
          <em>
            The registration details above are placeholder values for this
            demonstration and must be replaced with the company&rsquo;s real
            data before launch.
          </em>
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
