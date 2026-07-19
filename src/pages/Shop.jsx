import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../components/ProductCard";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import useFetch from "../hooks/useFetch";

function Shop() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);
  const limit = 20;
  const { data, loading, error } = useFetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${(page - 1) * limit}`,
  );

  const products = data?.products || [];

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case "low":
        sorted.sort((a, b) => a.price - b.price);
        break;

      case "high":
        sorted.sort((a, b) => b.price - a.price);
        break;

      case "az":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "za":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;

      default:
        break;
    }

    return sorted;
  }, [filteredProducts, sortBy]);

  useEffect(() => {
    console.log(`fetching page ${page}`);
  }, [page]);

  useEffect(() => {
    console.log("observer hast");
    const observer = new IntersectionObserver(
      (entries) => {
        console.log(entries[0]);
        const entry = entries[0];
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 },
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => observer.disconnect();
  }, [loading]); // ✅ فقط این خط رو تغییر دادم

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  function handleSort(e) {
    setSortBy(e.target.value);
  }

  return (
    <div>
      <h1>Shop</h1>
      <input value={search} onChange={handleSearch} placeholder="Search..." />
      <select value={sortBy} onChange={handleSort}>
        <option value="">Default</option>
        <option value="low">Price: Low to High</option>
        <option value="high">Price: High to Low</option>
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
      </select>
      {sortedProducts.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.title}
          price={product.price}
          image={product.thumbnail}
        />
      ))}
      <div ref={loaderRef} className="bg-red-500 h-40 mt-10"></div>{" "}
      {/* ✅ اینجا رو هم درست کردم */}
      <p className="text-center">{page}</p>
      <button onClick={() => setPage((prev) => prev + 1)}>Next</button>{" "}
      <br></br>
      <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
        prev
      </button>
    </div>
  );
}

export default Shop;
