const sections = [
  {
    title: "Acceptance of Terms",
    text: "By using the Lumora website and placing an order, you agree to these Terms & Conditions.",
  },
  {
    title: "Orders & Payment",
    text: "All orders are subject to availability. Prices are listed in the currency shown at checkout and may change without notice.",
  },
  {
    title: "Shipping",
    text: "Delivery times are estimates and are not guaranteed. Lumora is not responsible for delays caused by shipping carriers.",
  },
  {
    title: "Returns & Refunds",
    text: "Unopened items may be returned within 14 days of delivery for a refund, as described in our return policy.",
  },
  {
    title: "Account Responsibility",
    text: "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.",
  },
];

function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="section-eyebrow text-center">Legal</p>
      <h1 className="mt-3 text-center text-4xl font-semibold">Terms & Conditions</h1>
      <p className="mt-4 text-center text-sm text-stone-500">Last updated: January 2026</p>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold text-charcoal">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-500">{section.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Terms;
