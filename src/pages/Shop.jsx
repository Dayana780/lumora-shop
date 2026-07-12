import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import useFetch from "../hooks/useFetch";

function Shop() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  const { data, loading, error } = useFetch("https://dummyjson.com/products");

  const products = data.products || [];

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  function handleSort(e) {
    setSortBy(e.target.value);
  }

  if (loading) return <Loading />;

  if (error) return <ErrorMessage message={error} />;

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
    </div>
  );
}

export default Shop;
