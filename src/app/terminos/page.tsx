import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and conditions | J-NODE Digital Solutions",
  description:
    "Terms and conditions of use for J-NODE Digital Solutions services.",
};

export default function TerminosPage() {
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
            Terms and conditions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: February 2025
          </p>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              1. Identification and acceptance
            </h2>
            <p>
              These Terms and Conditions (&quot;Terms&quot;) govern the use of
              the services offered by <strong>J-NODE Digital Solutions</strong> (&quot;the
              Agency&quot;, &quot;we&quot;). By engaging our services, requesting
              quotes or using this website, you (&quot;the Client&quot;) accept
              these Terms in full. If you do not agree, do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              2. Services
            </h2>
            <p>
              J-NODE Digital Solutions offers software development, design
              (UI/UX and graphic), layout, maintenance and support, technical
              consulting, domain registration and web hosting. The specific
              scope of each engagement will be defined in the quote or contract
              signed for each project.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              3. Quotes and engagement
            </h2>
            <p>
              Quotes are valid for the period stated therein. Engagement is
              deemed to have taken place when the Client accepts the quote in
              writing (including by email) and, where applicable, pays the
              agreed amount or percentage as a deposit or first payment. We
              reserve the right not to start work until we receive confirmation
              and the agreed payment.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              4. Prices and payment
            </h2>
            <p>
              Prices are expressed in the currency indicated in the quote (e.g.
              EUR or USD) and may or may not include taxes as per applicable
              law. Payment may be made by bank transfer, card or other means we
              make available, including online payment systems (e.g. payment
              gateways such as Stripe). For recurring payments (maintenance,
              hosting), the billing conditions set out in the contract or on
              the payment platform will apply.
            </p>
            <p className="mt-4">
              Non-payment by the agreed dates may result in suspension of
              service and application of late interest as permitted by law.
              Refunds will be governed by what is set out in the quote or
              contract and by the policy of the payment gateway used.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              5. Intellectual property and deliverables
            </h2>
            <p>
              Once the agreed full payment has been made, intellectual property
              rights in deliverables created specifically for the Client (code,
              designs, layouts) will transfer to the Client as agreed in the
              quote. Tools, libraries, frameworks and pre-existing materials of
              the Agency will remain our property or that of third-party
              licensors. The Client may not reuse deliverables for other
              projects without authorisation where limited use has been agreed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              6. Client obligations
            </h2>
            <p>
              The Client undertakes to provide the information, content and
              access required within the reasonable timeframes we indicate, to
              respond to communications in good time and to meet payment
              obligations. Delays attributable to the Client may alter delivery
              timelines without this constituting a breach on our part.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              7. Limitation of liability
            </h2>
            <p>
              The Agency will perform the services with due professional care.
              We shall not be liable for indirect damages, loss of profit or
              data loss except in cases of wilful misconduct or gross
              negligence, and in any event our liability shall be limited to
              the amount paid by the Client for the relevant service in the
              last year. The Client is responsible for how they use the
              deliverables and for complying with applicable law (including
              data protection and third-party intellectual property).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              8. Confidentiality
            </h2>
            <p>
              Both parties undertake to keep confidential any sensitive
              information exchanged in the course of the project, except where
              disclosure is required by law or the information is already in
              the public domain.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              9. Termination and cancellation
            </h2>
            <p>
              Either party may terminate the engagement in the event of material
              breach by the other, with prior written notice where required by
              law or contract. If the Client cancels, they will pay for work
              completed to date and costs already committed. Subscription
              services (hosting, maintenance) will be cancelled in accordance
              with the conditions communicated when they were contracted.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              10. Modifications
            </h2>
            <p>
              We may update these Terms. Changes will be published on this page
              with the &quot;Last updated&quot; date. Continued use of our
              services after publication constitutes acceptance of the new
              Terms. For existing contracts, modifications will apply unless
              the law requires the Client&apos;s express consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              11. Governing law and jurisdiction
            </h2>
            <p>
              These Terms are governed by the law of the country where J-NODE
              Digital Solutions is established. For any dispute, the parties
              submit to the courts of that jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              12. Contact
            </h2>
            <p>
              For any questions about these Terms you may contact us at{" "}
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
