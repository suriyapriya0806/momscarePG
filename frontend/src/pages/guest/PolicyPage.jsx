import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import Card from "../../components/ui/Card";

const SUPPORT_EMAIL = "support@momscarepg.com";
const SUPPORT_PHONE = "+91 98765 43210";

const policyContent = {
  privacy: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    intro: "We're committed to protecting your personal information.",
    body: [
      "Our full privacy policy is being finalized.",
      "We take data protection seriously and will share exactly how we collect, use, and safeguard your information once the policy is published.",
      `For questions in the meantime, please contact us at ${SUPPORT_EMAIL}.`
    ]
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms & Conditions",
    intro: "The rules that keep our PG community clear and fair.",
    body: [
      "Our full terms and conditions are being finalized.",
      "They will cover bookings, bed blocking, payments, cancellations, and guest responsibilities.",
      `For questions in the meantime, please contact us at ${SUPPORT_EMAIL}.`
    ]
  },
  cancellation: {
    eyebrow: "Policies",
    title: "Cancellation & Refund Policy",
    intro: "Simple, transparent cancellation and refunds.",
    body: [
      "Our full cancellation and refund policy is being finalized.",
      "We aim to keep cancellations straightforward and refunds predictable, with clear timelines for every scenario.",
      `For questions in the meantime, please contact us at ${SUPPORT_EMAIL}.`
    ]
  },
  contact: {
    eyebrow: "Support",
    title: "Contact Support",
    intro: "We're here to help with your booking.",
    body: [
      "Our dedicated support channels are being finalized.",
      `For questions in the meantime, reach us at ${SUPPORT_EMAIL} or call ${SUPPORT_PHONE}.`
    ]
  }
};

const PolicyPage = ({ slug }) => {
  const page = policyContent[slug] || policyContent.privacy;

  return (
    <main className="bg-paper/70">
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-brand">{page.eyebrow}</p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-ink sm:text-5xl">{page.title}</h1>
            <p className="mt-5 text-lg leading-8 text-secondary">{page.intro}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Card className="hover:translate-y-0">
          <div className="grid gap-4 text-secondary">
            {page.body.map((sentence) => (
              <p key={sentence} className="leading-7">{sentence}</p>
            ))}
          </div>
          <div className="mt-8 grid gap-3 border-t border-line pt-6 text-sm sm:grid-cols-2">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-2 font-semibold text-brand transition hover:text-ink"
            >
              <Mail className="h-4 w-4" /> {SUPPORT_EMAIL}
            </a>
            <a
              href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 font-semibold text-brand transition hover:text-ink"
            >
              <Phone className="h-4 w-4" /> {SUPPORT_PHONE}
            </a>
          </div>
          <Link to="/" className="mt-6 inline-block text-sm font-semibold text-brand transition hover:text-ink">
            ← Back to Home
          </Link>
        </Card>
      </section>
    </main>
  );
};

export default PolicyPage;
