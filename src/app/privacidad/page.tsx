import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy policy | J-NODE Digital Solutions",
  description:
    "Privacy policy and data protection for J-NODE Digital Solutions.",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-background pt-16 lg:pt-20">
      <article className="container mx-auto max-w-3xl px-4 py-12">
        <Button variant="ghost" asChild className="mb-8 -ml-2">
          <Link href="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy policy
          </h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: February 2025
          </p>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              1. Data controller
            </h2>
            <p>
              The controller of the personal data we collect through this
              website and the services of <strong>J-NODE Digital Solutions</strong> (&quot;we&quot;,
              &quot;the Agency&quot;) is J-NODE Digital Solutions. You may contact
              us at{" "}
              <a
                href="mailto:contacto@jnode.digital"
                className="text-primary underline hover:no-underline"
              >
                contacto@jnode.digital
              </a>{" "}
              for any privacy-related questions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              2. Data we collect
            </h2>
            <p>
              We may collect the following data depending on how you interact
              with us:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Identification and contact data:</strong> name,
                surname, email, phone, company or project, when you contact us
                to request quotes, engage services or subscribe to communications.
              </li>
              <li>
                <strong>Billing data:</strong> legal name, tax ID, address,
                required to issue invoices and meet tax obligations.
              </li>
              <li>
                <strong>Payment data:</strong> when you use an online payment
                method (e.g. card via a payment gateway such as Stripe), payment
                data is processed directly by the payment provider. We do not
                store full card numbers.
              </li>
              <li>
                <strong>Technical and usage data:</strong> IP address, browser
                type, pages visited, date and time of access, when you use our
                website (including via cookies or similar technologies), for
                the proper functioning of the site and, where applicable,
                statistical analysis.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              3. Purpose of processing
            </h2>
            <p>We use your data to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Manage quote requests, engagement and provision of services.</li>
              <li>Invoice and manage payments, including use of payment gateways.</li>
              <li>Comply with legal obligations (tax, accounting).</li>
              <li>Respond to enquiries and provide support.</li>
              <li>Send marketing or informational communications, if you have given consent.</li>
              <li>Improve our website and services (usage analysis, where lawful).</li>
              <li>Handle complaints or incidents.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              4. Legal basis
            </h2>
            <p>
              Processing is based on: (a) performance of a contract or
              pre-contractual measures (quotes, engagement); (b) compliance with
              legal obligations (invoicing, document retention); (c) your
              consent when we request it expressly (e.g. newsletters); (d) our
              legitimate interest where necessary for site management,
              security or defence of claims, provided your rights do not
              prevail.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              5. Recipients and transfers
            </h2>
            <p>
              Your data may be shared with:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Payment providers</strong> (e.g. Stripe), which process
                payments under their own privacy policy. We recommend reading
                the privacy policy of the provider used for each transaction.
              </li>
              <li>
                <strong>Hosting and technical service providers</strong> that
                host this site or our email and management tools, within the EEA
                or with adequate safeguards.
              </li>
              <li>
                <strong>Public authorities</strong> when required by law.
              </li>
            </ul>
            <p className="mt-4">
              We do not sell your personal data. If we use services in countries
              outside the EEA in the future, we will ensure appropriate
              measures (standard clauses, adequacy decisions, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              6. Retention
            </h2>
            <p>
              We retain your data for as long as necessary for the purposes
              stated: during the contractual relationship and, thereafter, for
              the period required by law (e.g. invoices and tax data). Browsing
              and cookie data are retained as set out in our cookie information.
              After that period, data will be deleted or anonymised.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              7. Your rights
            </h2>
            <p>
              You may exercise the following rights where applicable law
              provides for them (e.g. in the EU, Regulation (EU) 2016/679):
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Access:</strong> know whether we process your data and obtain a copy.</li>
              <li><strong>Rectification:</strong> correct inaccurate or incomplete data.</li>
              <li><strong>Erasure:</strong> request deletion when no longer necessary or you withdraw consent.</li>
              <li><strong>Restriction:</strong> request that we only retain data for claims.</li>
              <li><strong>Portability:</strong> receive your data in a structured format where applicable.</li>
              <li><strong>Objection:</strong> object to processing based on legitimate interest or to marketing.</li>
              <li><strong>Withdraw consent</strong> at any time, without affecting the lawfulness of prior processing.</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, write to us at{" "}
              <a
                href="mailto:contacto@jnode.digital"
                className="text-primary underline hover:no-underline"
              >
                contacto@jnode.digital
              </a>
              . You have the right to lodge a complaint with the data protection
              supervisory authority in your country.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              8. Cookies and similar technologies
            </h2>
            <p>
              This site may use cookies and similar technologies for proper
              functioning (e.g. language or theme preferences), usage analysis or
              integration with third-party services. You can set your browser
              to reject or delete cookies; this may affect some features. When
              we use cookies that are not strictly necessary, we will ask for
              your consent where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              9. Security
            </h2>
            <p>
              We apply reasonable technical and organisational measures to
              protect your data against unauthorised access, loss or alteration.
              Data transmission over the internet is not fully secure; although
              we act with care, we cannot guarantee absolute security of email
              or web communications.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              10. Minors
            </h2>
            <p>
              Our services are aimed at persons who can legally contract. We do
              not knowingly collect data from minors. If you are aware that a
              minor has provided us with data, please contact us so we can
              delete it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              11. Changes to this policy
            </h2>
            <p>
              We may update this Privacy policy. Changes will be published on
              this page with the new &quot;Last updated&quot; date. We recommend
              reviewing it periodically. Continued use of our services after
              publication constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              12. Contact
            </h2>
            <p>
              For any questions about how we process your data or to exercise
              your rights, you may contact us at{" "}
              <a
                href="mailto:contacto@jnode.digital"
                className="text-primary underline hover:no-underline"
              >
                contacto@jnode.digital
              </a>
              .
            </p>
          </section>
        </div>

        <footer className="mt-12 pt-8 border-t">
          <Button variant="outline" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </footer>
      </article>
    </div>
  );
}
