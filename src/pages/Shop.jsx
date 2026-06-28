import ProductCard from "../components/ProductCard";
import products from "../data/products";

function Shop() {
  return (
    <div>
      <h1>Shop</h1>

      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
        />
      ))}
    </div>
  );
}

export default Shop;