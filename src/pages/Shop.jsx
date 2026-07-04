import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("https://fakestoreapi.com/products");

        // فقط برای تست Loading
        await new Promise((resolve) => setTimeout(resolve, 3000));

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1>Shop</h1>

      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.title}   // چون FakeStore API از title استفاده می‌کند
          price={product.price}
          image={product.image}
        />
      ))}
    </div>
  );
}

export default Shop;