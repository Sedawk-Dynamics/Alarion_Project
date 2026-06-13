import FaqCard, { type FaqProps } from '../ui/Cards/FaqCard';

/**
 * Faqs — the "Frequently Asked Questions" accordion section.
 * Centered eyebrow + a list of reusable <FaqCard> items.
 */

const FAQS: FaqProps[] = [
  {
    question: 'How do I book a stay with Alarion?',
    answer:
      "Use the search bar to choose your destination, dates and guests, then browse our curated collection. Select your suite, review the rate and confirm — you'll receive instant confirmation by email along with your concierge's direct line.",
  },
  {
    question: 'What is your cancellation and refund policy?',
    answer:
      "Most stays offer free cancellation up to 48 hours before check-in, with a full refund processed to your original payment method within 5–7 business days. Specific terms appear on each property's page before you confirm.",
  },
  {
    question: 'Can I make special requests before arrival?',
    answer:
      "Absolutely. Airport transfers, dietary preferences, anniversary arrangements, early check-in — simply message your concierge or note it during booking, and we'll coordinate directly with the property on your behalf.",
  },
  {
    question: 'Which payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards, UPI, net banking and select bank EMI options. Eligible bank offers, such as the HDFC card discount, are applied automatically at checkout.',
  },
  {
    question: 'How do I reach customer care if I need help during my stay?',
    answer:
      'Our Customer Care Number, +91 124 716 0000, is available 24×7. You can also email concierge@alarion.com at any time — for guests already checked in, we aim to respond within minutes.',
  },
];

export default function Faqs({ faqs = FAQS }: { faqs?: FaqProps[] }) {
  return (
    <section id="faq" className="bg-[#0E1426] py-30">
      <div className="mx-auto w-[min(880px,calc(100%-3.5rem))]">
        {/* Centered eyebrow */}
        <div className="mb-9 flex justify-center">
          <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
            <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
            Frequently Asked Questions
          </div>
        </div>

        {/* Accordion list (top border so the first item has a line above it) */}
        <div className="border-t border-white/8">
          {faqs.map((faq) => (
            <FaqCard key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
