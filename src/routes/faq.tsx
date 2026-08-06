import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import type { FaqCategory } from '@/lib/i18n/types';

export const Route = createFileRoute('/faq')({
  component: FAQPage,
});

function FAQItem({ item, idx }: { item: FaqCategory; idx: number }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div key={idx} className="mb-12">
      <h3 className="font-serif text-xl text-gold mb-6 border-b border-onyx/20 pb-4">{item.category}</h3>
      <div className="space-y-4">
        {item.questions.map((qa, qidx) => (
          <div key={qidx} className="border border-onyx/10 rounded">
            <button
              onClick={() => setExpanded(expanded === qidx ? null : qidx)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-onyx/2 transition"
            >
              <span className="text-left font-medium text-onyx">{qa.q}</span>
              {expanded === qidx ? (
                <ChevronUp className="w-5 h-5 text-gold flex-shrink-0 ml-4" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gold/50 flex-shrink-0 ml-4" />
              )}
            </button>
            {expanded === qidx && (
              <div className="px-6 py-4 bg-onyx/1 border-t border-onyx/10 text-sm text-onyx/80 leading-relaxed">
                {qa.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQPage() {
  const { t, messages } = useI18n();
  const faqs = messages.faq.categories;

  return (
    <div>
      {/* Hero */}
      <section className="bg-onyx text-parchment py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl mb-4">{t("faq.title")}</h1>
          <p className="text-lg opacity-90">{t("faq.subtitle")}</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        {faqs.map((item, idx) => (
          <FAQItem key={idx} item={item} idx={idx} />
        ))}

        {/* Still Have Questions */}
        <div className="mt-16 p-8 border border-gold/30 bg-parchment/50 rounded">
          <h3 className="font-serif text-2xl text-onyx mb-4">{t("faq.contact.title")}</h3>
          <p className="text-onyx/70 mb-6">
            {t("faq.contact.body")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gold mb-2">{t("faq.contact.email")}</h4>
              <p className="text-sm text-onyx/70">{t("faq.contact.emailValue")}</p>
            </div>
            <div>
              <h4 className="font-medium text-gold mb-2">{t("faq.contact.phone")}</h4>
              <p className="text-sm text-onyx/70">{t("faq.contact.phoneValue")}</p>
            </div>
            <div>
              <h4 className="font-medium text-gold mb-2">{t("faq.contact.liveChat")}</h4>
              <p className="text-sm text-onyx/70">{t("faq.contact.chatValue")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
