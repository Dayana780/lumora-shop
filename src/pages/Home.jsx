import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Sparkles, Truck } from "lucide-react";

import { useProducts } from "../context/ProductContext";
import ProductCard from "../features/products/ProductCard";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import heroImage from "../assets/hero-image.png";
import abouteImage from "../assets/about.png";

const highlights = [
  { icon: Leaf, label: "Clean, considered formulas" },
  { icon: Sparkles, label: "Editor-loved essentials" },
  { icon: Truck, label: "Free shipping over $60" },
];

function Home() {
  const { productList, loading, error } = useProducts();

  const featuredProducts = productList.slice(0, 4);
  const newArrivals = productList.slice(4, 8);

  const categories = Array.from(
    new Map(
      productList
        .filter((product) => product.categories)
        .map((product) => [product.categories.id, product.categories]),
    ).values(),
  ).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up">
            <p className="section-eyebrow">New Season Edit</p>
            <h1 className="mt-4 text-4xl leading-[1.1] font-semibold sm:text-5xl lg:text-6xl">
              Beauty rituals,
              <br />
              made effortless.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-stone-500">
              Clean formulas and considered essentials designed to fit
              seamlessly into your everyday routine.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn-secondary">
                Our Story
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-stone-200 pt-6">
              {highlights.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs font-medium text-stone-500"
                >
                  <Icon size={16} className="text-rose-500" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-blush-100 lg:aspect-square">
            <img
              src={heroImage}
              alt="Lumora beauty collection"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-5 left-5 rounded-xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
              <p className="text-xs font-semibold text-charcoal">
                Loved by 10,000+
              </p>
              <p className="text-xs text-stone-500">beauty enthusiasts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="section-eyebrow">Browse</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Shop by Category
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?search=${encodeURIComponent(category.name)}`}
                className="card-surface flex aspect-square flex-col items-center justify-center gap-2 px-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="text-sm font-medium text-charcoal">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="section-eyebrow">Fan Favorites</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Editorial / Brand story banner */}
      <section className="bg-blush-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div className="order-2 aspect-[4/3] overflow-hidden rounded-3xl bg-blush-100 lg:order-1">
            <img
              src={abouteImage}
              alt="Lumora ingredients and formulas"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="section-eyebrow">Our Philosophy</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Beauty that respects your skin — and your time.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-stone-500">
              Every Lumora formula is developed with thoughtfully sourced
              ingredients, tested for real results, and designed to slot
              effortlessly into a modern routine. No filler, no noise — just
              beauty essentials worth keeping.
            </p>
            <Link to="/about" className="btn-secondary mt-6">
              Read Our Story <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="section-eyebrow">Just Dropped</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop"
              className="flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="card-surface flex flex-col items-center gap-4 rounded-3xl px-6 py-12 text-center sm:px-12">
          <p className="section-eyebrow">Stay in the Glow</p>
          <h2 className="max-w-md text-2xl font-semibold sm:text-3xl">
            Get first access to new drops &amp; beauty edits
          </h2>
          <form
            className="mt-2 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Your email address"
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home;
