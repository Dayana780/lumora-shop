const sections = [
  {
    title: "Information We Collect",
    text: "We collect the information you provide when creating an account, placing an order, or contacting us — such as your name, email address, shipping address, and order history.",
  },
  {
    title: "How We Use Your Information",
    text: "Your information is used to process orders, provide customer support, and improve your shopping experience. We do not sell your personal data to third parties.",
  },
  {
    title: "Cookies",
    text: "We use cookies to keep you signed in and to remember items in your cart. You can disable cookies in your browser settings, though some features may not work as expected.",
  },
  {
    title: "Data Security",
    text: "We take reasonable steps to protect your information, including secure storage and restricted access to personal data.",
  },
  {
    title: "Your Rights",
    text: "You may request access to, correction of, or deletion of your personal information at any time by contacting us.",
  },
];

function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="section-eyebrow text-center">Legal</p>
      <h1 className="mt-3 text-center text-4xl font-semibold">Privacy Policy</h1>
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

export default PrivacyPolicy;
