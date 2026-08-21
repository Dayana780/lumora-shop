import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Search } from "lucide-react";

import ProductCard from "../features/products/ProductCard";

import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";

import useDebounce from "../hooks/useDebounce";

import { useProducts } from "../context/ProductContext";

function Shop() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const { productList, loading, error } = useProducts();

  const debouncedSearch = useDebounce(search, 500);

  // Read url parameters

  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    const sortFromUrl = searchParams.get("sort");

    if (searchFromUrl !== null) {
      setSearch(searchFromUrl);
    }

    if (sortFromUrl !== null) {
      setSortBy(sortFromUrl);
    }
  }, []);

  // Filter

  const filteredProducts = useMemo(() => {
    return productList.filter((product) =>
      product.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [productList, debouncedSearch]);

  // Sort

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case "low":
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
        break;

      case "high":
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
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

  // Search

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value;

      setSearch(value);

      setSearchParams({
        search: value,
        sort: sortBy,
      });
    },
    [sortBy, setSearchParams],
  );

  // Sort

  const handleSort = useCallback(
    (e) => {
      const value = e.target.value;

      setSortBy(value);

      setSearchParams({
        search,
        sort: value,
      });
    },
    [search, setSearchParams],
  );

  // Loading

  if (loading) {
    return <Loading />;
  }

  // Error

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Render

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <p className="section-eyebrow">Full Collection</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Shop</h1>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-stone-500" />
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Search products..."
            className="input-field pl-10"
          />
        </div>

        <select value={sortBy} onChange={handleSort} className="input-field w-full sm:w-auto">
          <option value="">Sort: Default</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="az">Name: A-Z</option>
          <option value="za">Name: Z-A</option>
        </select>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="card-surface mt-10 flex flex-col items-center gap-2 px-6 py-16 text-center">
          <p className="font-medium text-charcoal">No products found</p>
          <p className="text-sm text-stone-500">Try a different search term or clear your filters.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Shop;
