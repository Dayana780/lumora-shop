import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Heart, Sparkles } from "lucide-react";
import abouteImage from "../assets/about.png";

const values = [
  {
    icon: Leaf,
    title: "Clean Formulas",
    text: "Every product is formulated without harsh chemicals, so your skin gets only what it needs.",
  },
  {
    icon: Heart,
    title: "Made With Care",
    text: "We test extensively and work with dermatologists to keep every formula gentle and effective.",
  },
  {
    icon: Sparkles,
    title: "Everyday Ritual",
    text: "Beauty shouldn't be complicated. We design routines that fit naturally into your day.",
  },
];

function About() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="section-eyebrow">Our Story</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
            Beauty, made honest.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-stone-500">
            Lumora began with a simple idea: skincare and beauty essentials
            should be effective, honest, and a genuine pleasure to use.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-blush-100">
            <img
              src={abouteImage}
              alt="Lumora studio"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="section-eyebrow">Our Philosophy</p>
            <h2 className="mt-3 text-3xl font-semibold">
              Considered ingredients, thoughtful rituals.
            </h2>
            <p className="mt-4 leading-relaxed text-stone-500">
              We started Lumora because we were tired of choosing between
              products that felt good and products that actually worked. Our
              small team sources quality ingredients, keeps formulas simple, and
              designs every product to feel like a small daily luxury — never a
              chore.
            </p>
            <p className="mt-4 leading-relaxed text-stone-500">
              Today, Lumora is a home for the essentials people actually reach
              for — skincare, makeup, and body care built for real routines, not
              just wishlists.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <p className="section-eyebrow">What We Stand For</p>
          <h2 className="mt-3 text-3xl font-semibold">Our values</h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="card-surface p-6 text-center">
              <value.icon className="mx-auto text-rose-500" size={26} />
              <h3 className="mt-4 font-medium text-charcoal">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-stone-200/70 bg-blush-50/60">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-semibold">Ready to find your ritual?</h2>
          <p className="mt-3 text-stone-500">
            Explore the full Lumora collection and discover what belongs in your
            routine.
          </p>
          <Link to="/shop" className="btn-primary mt-6">
            Shop the Collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;
