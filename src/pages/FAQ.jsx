import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    category: "Orders",
    question: "How can I track my order?",
    answer:
      "Once your order ships, you can view its status any time from the Orders page in your account.",
  },
  {
    category: "Shipping",
    question: "How long does shipping take?",
    answer:
      "Most orders arrive within 3–5 business days. You'll receive an email once your order ships.",
  },
  {
    category: "Returns",
    question: "What is your return policy?",
    answer:
      "Unopened products can be returned within 14 days of delivery for a full refund.",
  },
  {
    category: "Payments",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards, along with the payment methods available at checkout.",
  },
  {
    category: "Account",
    question: "Do I need an account to place an order?",
    answer:
      "Yes, creating an account lets you track orders, save addresses, and manage your wishlist.",
  },
  {
    category: "Products",
    question: "Are Lumora products cruelty-free?",
    answer:
      "Yes, every Lumora product is formulated and tested without animal testing.",
  },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="card-surface overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span>
          <span className="section-eyebrow block">{item.category}</span>
          <span className="mt-1 block font-medium text-charcoal">{item.question}</span>
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-stone-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <p className="px-5 pb-5 text-sm leading-relaxed text-stone-500">{item.answer}</p>
      )}
    </div>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <p className="section-eyebrow">Support</p>
        <h1 className="mt-3 text-4xl font-semibold">Frequently Asked Questions</h1>
        <p className="mt-4 text-stone-500">
          Everything you need to know about shopping with Lumora.
        </p>
      </div>

      <div className="mt-10 space-y-3">
        {faqs.map((item, index) => (
          <FAQItem
            key={item.question}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>
    </div>
  );
}

export default FAQ;
