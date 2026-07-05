import ProductCard from "../components/ProductCard";
import Loading from "../components/ui/Loading"
import ErrorMessage from "../components/ui/ErrorMessage"
import useFetch from "../hooks/useFetch";
function Shop() {
  
  const {data , loading , error}= useFetch("https://fakestoreapi.com/products")
  if (loading) {
    return <Loading />;
  }

 if (error) {
  return <ErrorMessage message={error} />;
}

  return (
    <div>
      <h1>Shop</h1>

      {data.map((product) => (
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