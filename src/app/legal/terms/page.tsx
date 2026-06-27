import type { Metadata } from "next";
import { LegalPage, Fill } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing the use of the ARDLABS® website.",
  alternates: { canonical: "/legal/terms" },
};

export default function Terms() {
  return (
    <LegalPage title="Terms of Use" updated="June 2026">
      <section>
        <p>
          These terms govern your use of this website, operated by{" "}
          <Fill>[Legal entity name]</Fill> ({SITE.legal}). By using the site you
          agree to them.
        </p>
      </section>

      <section>
        <h2>Use of the site</h2>
        <p>
          You may view and interact with the site for lawful, personal and
          professional purposes. You agree not to misuse it, attempt to disrupt
          it, or access it through automated means without permission.
        </p>
      </section>

      <section>
        <h2>Intellectual property</h2>
        <p>
          All trademarks, content, design and source code are owned by{" "}
          {SITE.legal} or its licensors and are protected by law. No rights are
          granted except as expressly stated.
        </p>
      </section>

      <section>
        <h2>No advice or offer</h2>
        <p>
          Content on this site is provided for general information only. It does
          not constitute professional, financial or investment advice, nor an
          offer or solicitation of any kind.
        </p>
      </section>

      <section>
        <h2>Disclaimer & liability</h2>
        <p>
          The site is provided &ldquo;as is&rdquo; without warranties of any
          kind. To the extent permitted by law, {SITE.legal} is not liable for
          any damages arising from use of, or inability to use, the site.
        </p>
      </section>

      <section>
        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of{" "}
          <Fill>[jurisdiction, e.g. Switzerland]</Fill>, and disputes are subject
          to the courts of <Fill>[competent venue]</Fill>.
        </p>
      </section>
    </LegalPage>
  );
}
