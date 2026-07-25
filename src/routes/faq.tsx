import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const Route = createFileRoute('/faq')({
  component: FAQPage,
});

interface FAQItem {
  category: string;
  questions: {
    q: string;
    a: string;
  }[];
}

const faqs: FAQItem[] = [
  {
    category: "Products & Selection",
    questions: [
      {
        q: "What karat options do you offer?",
        a: "We offer gold jewelry in 18K, 22K, and 24K purity. 18K (75% gold) offers excellent durability, 22K (91.7% gold) provides richer color and is traditional in many cultures, and 24K (99.9% gold) is investment-grade purity. Choose based on your lifestyle and preference."
      },
      {
        q: "Can I customize my jewelry?",
        a: "Yes! Many of our pieces are customizable. You can adjust karat, gold color (yellow, white, rose, two-tone, three-tone), gemstones, and engravings. Contact our design team for personalized creations."
      },
      {
        q: "Do you offer products under $1000?",
        a: "Absolutely. We have a curated collection of elegant pieces under $1000, including delicate rings, necklaces, and bracelets. These are perfect for everyday wear or thoughtful gifts."
      },
      {
        q: "What's the difference between your bullion and jewelry?",
        a: "Our bullion (ingots and coins) are investment-grade with minimal making charges, focused on pure gold content. Our jewelry combines artistic design with gold craftsmanship, featuring higher making charges for artistry and design."
      },
      {
        q: "Are your diamonds and gemstones certified?",
        a: "Yes. All diamonds come with GIA certification detailing cut, clarity, carat, and color. Other gemstones are sourced from reputable suppliers and authenticated for quality."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "Do you offer free shipping?",
        a: "Yes! Many items qualify for free shipping. Check the product page for shipping details. Orders over a certain amount also receive complimentary shipping."
      },
      {
        q: "What's your express delivery option?",
        a: "We offer express delivery for selected items. This ensures your precious pieces arrive quickly, perfect for time-sensitive gifts or urgent needs."
      },
      {
        q: "How are items packaged?",
        a: "Each piece is carefully packaged in our signature luxury boxes with protective padding. Valuable items come with additional security measures and insurance options."
      }
    ]
  },
  {
    category: "Warranty & Returns",
    questions: [
      {
        q: "What warranty do you provide?",
        a: "Most items come with at least a 1-year warranty covering defects in craftsmanship. Select luxury pieces offer lifetime warranties. Warranty covers repair and restoration of your jewelry."
      },
      {
        q: "Is insurance available?",
        a: "Yes, we offer optional insurance for valuable pieces during shipping and for your peace of mind after purchase. This is especially recommended for engagement rings and investment-grade items."
      },
      {
        q: "What's your return policy?",
        a: "Most items are returnable within 30 days for refund or exchange. Customized or made-to-order pieces have different terms. Items must be in original condition with all documentation."
      },
      {
        q: "Can I return custom-made jewelry?",
        a: "Custom pieces are generally non-returnable once crafted. However, if there are defects in craftsmanship, we'll repair or replace at no cost. Consult our team before ordering."
      }
    ]
  },
  {
    category: "Sizing & Fit",
    questions: [
      {
        q: "How do I determine my ring size?",
        a: "Visit a local jeweler for professional sizing, or use our online ring sizer. Measure a ring that fits you well by placing it on a ruler. Most of our rings are resizable."
      },
      {
        q: "Are your pieces size-adjustable?",
        a: "Many of our rings and bracelets feature size-adjustable designs. Check the product page for details. Even non-adjustable pieces can often be resized by our master craftsmen."
      },
      {
        q: "What if I order the wrong size?",
        a: "No problem! We offer free resizing within 60 days of purchase. Simply return your item, and we'll adjust it to the correct size and return it to you."
      }
    ]
  },
  {
    category: "Care & Maintenance",
    questions: [
      {
        q: "How should I clean my gold jewelry?",
        a: "Use a soft brush with mild soap and warm water for daily cleaning. For deeper cleaning, use our professional jewelry cleaner or visit a jeweler. Avoid harsh chemicals and abrasive materials."
      },
      {
        q: "How do I store my jewelry?",
        a: "Store pieces individually in soft pouches or the original boxes. Keep away from moisture, heat, and direct sunlight. Remove jewelry during activities like swimming or exercising."
      },
      {
        q: "Can I wear gold jewelry daily?",
        a: "18K and 22K gold are durable for daily wear. 24K is softer and best for occasional wear or investment pieces. Regular maintenance and care extend the life of your jewelry significantly."
      },
      {
        q: "What if my jewelry gets damaged?",
        a: "We offer professional repair and restoration services. Bring your item to our workshop or contact us for mail-in repair options. Most repairs are covered under warranty."
      }
    ]
  },
  {
    category: "Pricing & Value",
    questions: [
      {
        q: "How do you calculate gold prices?",
        a: "Gold prices fluctuate daily based on international markets. We use live market rates and add our making charge (craftsmanship) and VAT. Our pricing is transparent with detailed breakdowns."
      },
      {
        q: "What's included in the price?",
        a: "Our prices include: gold content at market rate, making charge (craftsmanship), VAT (9%), and gemstones (if applicable). Any customization fees are added separately."
      },
      {
        q: "Do you offer discounts?",
        a: "Yes! We regularly offer seasonal sales and discounts on select items. Sign up for our newsletter to receive exclusive offers and early access to sales events."
      },
      {
        q: "Is investment-grade gold a good investment?",
        a: "Yes. 24K bullion offers investment value with minimal making charges. As precious metal, gold historically holds value and offers portfolio diversification. Consult a financial advisor for investment strategy."
      }
    ]
  },
  {
    category: "AI Recommendations",
    questions: [
      {
        q: "How does the AI recommendation system work?",
        a: "Our AI analyzes your browsing history, preferences, and similar customer purchases to suggest pieces you'll love. It learns from your interactions to provide increasingly personalized recommendations."
      },
      {
        q: "Can I trust the AI suggestions?",
        a: "Absolutely. Our recommendations are curated by fashion experts and refined by customer feedback. However, personal preference is paramount—feel free to explore beyond suggestions."
      },
      {
        q: "How can I see more recommendations?",
        a: "Browse different categories, check bestsellers, and view our 'Most Sold' and 'Newest Arrivals' sections. Each product page includes AI-powered 'Customers Also Liked' suggestions."
      }
    ]
  },
  {
    category: "Made-to-Order & Custom",
    questions: [
      {
        q: "What's the difference between custom and made-to-order?",
        a: "Made-to-order pieces follow our design but can be customized (size, color, etc.). Custom pieces are created from your unique design specifications. Both take 2-4 weeks."
      },
      {
        q: "How long does custom jewelry take?",
        a: "Custom pieces typically take 2-4 weeks depending on complexity. Rush orders available (1-2 weeks) with additional fee. We'll confirm timeline after design consultation."
      },
      {
        q: "Can I see my custom design before it's made?",
        a: "Yes! We provide digital renderings and detailed sketches for your approval before production. You can request modifications until you're completely satisfied."
      },
      {
        q: "What if I'm not happy with my custom piece?",
        a: "We'll work with you to make modifications within reason. If fundamentally unsatisfied, we offer store credit (non-refundable for custom work) for your next purchase."
      }
    ]
  },
  {
    category: "Account & Orders",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' in the header. Provide your email and create a secure password. Your account saves your preferences, order history, and saved items for faster checkout."
      },
      {
        q: "Can I track my order?",
        a: "Yes! After purchase, you'll receive a tracking number via email. Track your package in real-time through our system or the shipping provider's website."
      },
      {
        q: "How do I contact customer support?",
        a: "Reach us via email (support@aurum.com), phone (+1-800-AURUM-01), or live chat. Our team responds within 24 hours. Visit our contact page for office hours and locations."
      }
    ]
  },
  {
    category: "Bestsellers & Ratings",
    questions: [
      {
        q: "What makes an item a bestseller?",
        a: "Bestsellers are our most purchased items consistently. They've earned customer trust through quality, design, and value. These are proven favorites worth considering."
      },
      {
        q: "How are customer ratings calculated?",
        a: "Ratings are based on verified purchases only. Customers rate on quality, craftsmanship, value, and delivery experience. Average ratings help other customers make informed decisions."
      },
      {
        q: "Can I read customer reviews?",
        a: "Absolutely. Each product page features detailed reviews from verified buyers. Read about real experiences with sizing, quality, and satisfaction to make confident choices."
      },
      {
        q: "What are the newest arrivals?",
        a: "Our 'Newest' collection features recently added pieces, often including fresh designs and emerging trends. Check back regularly for the latest additions to our collections."
      }
    ]
  }
];

function FAQItem({ item, idx }: { item: FAQItem; idx: number }) {
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
  return (
    <div>
      {/* Hero */}
      <section className="bg-onyx text-parchment py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl mb-4">Frequently Asked Questions</h1>
          <p className="text-lg opacity-90">Find answers to common questions about our products, ordering, and care.</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        {faqs.map((item, idx) => (
          <FAQItem key={idx} item={item} idx={idx} />
        ))}

        {/* Still Have Questions */}
        <div className="mt-16 p-8 border border-gold/30 bg-parchment/50 rounded">
          <h3 className="font-serif text-2xl text-onyx mb-4">Still Have Questions?</h3>
          <p className="text-onyx/70 mb-6">
            Our customer service team is here to help. Reach out and we'll get back to you within 24 hours.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gold mb-2">Email</h4>
              <p className="text-sm text-onyx/70">support@aurum.com</p>
            </div>
            <div>
              <h4 className="font-medium text-gold mb-2">Phone</h4>
              <p className="text-sm text-onyx/70">+1-800-AURUM-01</p>
            </div>
            <div>
              <h4 className="font-medium text-gold mb-2">Live Chat</h4>
              <p className="text-sm text-onyx/70">Available 9am-6pm EST</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
