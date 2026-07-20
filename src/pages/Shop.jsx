import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../components/ProductCard";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import useFetch from "../hooks/useFetch";
import { useSearchParams } from "react-router-dom";

function Shop() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const limit = 20;
  const { data, loading, error } = useFetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${(page - 1) * limit}`,
  );

  const products = data?.products || [];

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [allProducts, search]);

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
    // console.log("observer hast");
    const observer = new IntersectionObserver(
      (entries) => {
        // console.log(entries[0]);
        const entry = entries[0];

        if (entry.isIntersecting && !loading && hasMore) {
          console.log("load next page");
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 },
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
      console.log(loaderRef);
    }
    return () => observer.disconnect();
  }, [loading, hasMore]);
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
  useEffect(() => {
    const sortFormUrl = searchParams.get("sort");
    const searchFormUrl = searchParams.get("search");
    if (searchFormUrl && sortFormUrl) {
      setSortBy(sortFormUrl);
    }
    if (searchFormUrl) {
      setSearch(searchFormUrl);
    }
  }, []);
  if (loading && allProducts.length === 0) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  function handleSearch(e) {
    const value = e.target.value;
    setSearch(value);
    setSearchParams({ search: value, sort: sortBy });
  }

  function handleSort(e) {
    const value = e.target.value;

    setSortBy(e.target.value);
    setSearchParams({ search, sort: value });
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
      <div ref={loaderRef}>{loading && <Loading />}</div>{" "}
      <p className="text-center">{page}</p>
    </div>
  );
}

export default Shop;
