import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../features/products/ProductCard";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import useFetch from "../hooks/useFetch";
import useDebounce from "../hooks/useDebounce";

function Shop() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const limit = 20;
  const debouncedSearch = useDebounce(search, 500);
  const { data, loading, error } = useFetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${(page - 1) * limit}`,
  );

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) =>
      product.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [allProducts, debouncedSearch]);

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

  // خواندن پارامترهای URL در اولین رندر
  useEffect(() => {
    const sortFormUrl = searchParams.get("sort");
    const searchFormUrl = searchParams.get("search");

    if (searchFormUrl) {
      setSearch(searchFormUrl);
    }
    if (sortFormUrl) {
      setSortBy(sortFormUrl);
    }
  }, []);

  // ریست کردن صفحه و محصولات هنگام تغییر جستجو
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
    setHasMore(true);
  }, [debouncedSearch]);

  // لاگ کردن صفحه
  useEffect(() => {
    console.log(`fetching page ${page}`);
  }, [page]);

  // Intersection Observer برای infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading && hasMore) {
          console.log("load next page");
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
      observer.disconnect();
    };
  }, [loading, hasMore]);

  // ذخیره محصولات جدید
  useEffect(() => {
    if (data?.products) {
      setAllProducts((prev) => {
        const newProducts = data.products.filter(
          (product) => !prev.some((item) => item.id === product.id),
        );
        const updatedProducts = [...prev, ...newProducts];
        if (updatedProducts.length >= data.total) {
          setHasMore(false);
        }
        return updatedProducts;
      });
    }
  }, [data]);

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value;
      setSearch(value);
      setSearchParams({ search: value, sort: sortBy });
    },
    [sortBy, setSearchParams],
  );

  const handleSort = useCallback(
    (e) => {
      const value = e.target.value;
      setSortBy(value);
      setSearchParams({ search, sort: value });
    },
    [search, setSearchParams],
  );

  const handleAddToCart = useCallback((id) => {
    console.log("add product", id);
  }, []);
  if (loading && allProducts.length === 0) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

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
          onAddCart={handleAddToCart}
        />
      ))}
      <div ref={loaderRef}>{loading && <Loading />}</div>
      <p className="text-center">{page}</p>
    </div>
  );
}

export default Shop;
