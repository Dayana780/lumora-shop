import { useState } from "react";
import ProductCard from "../components/ProductCard";
import Loading from "../components/ui/Loading"
import ErrorMessage from "../components/ui/ErrorMessage"
import useFetch from "../hooks/useFetch";
import products from "../data/products"
function Shop() {
  const error = "";
  const loading = "";
  const [search, setSearch] = useState("");
const [sortBy, setSortBy] = useState("");
  function handleSearch(e){
    setSearch(e.target.value)

  }
function handleSort(e) {
  setSortBy(e.target.value);
}

  // const {data , loading , error}= useFetch("https://dummyjson.com/products")
  if (loading) {
    return <Loading />;
  }

 if (error) {
  return <ErrorMessage message={error} />;
}
const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(search.toLowerCase())
);
const sortedProducts = [...filteredProducts];

switch (sortBy) {
  case "low":
    sortedProducts.sort((a, b) => a.price - b.price);
    break;

  case "high":
    sortedProducts.sort((a, b) => b.price - a.price);
    break;

  case "az":
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    break;

  case "za":
    sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    break;

  default:
    break;
}  return (
    <div>
      <h1>Shop</h1>
<input
  className="bg-amber-400"
  placeholder="Search products..."
  value={search}
  onChange={handleSearch}
/>      
<select 
 value={sortBy}
  onChange={handleSort}
  >
  <option value="">Default</option>
  <option value="low">Price: Low to High</option>
  <option value="high">Price: High to Low</option>
  <option value="az">Name: A-Z</option>
  <option value="za">Name: Z-A</option>
</select>

{

sortedProducts.map((product) => (
  
  
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}   // چون FakeStore API از title استفاده می‌کند
          price={product.price}
          image={product.image}
        />
      ))}
    </div>
  );
}

export default Shop;