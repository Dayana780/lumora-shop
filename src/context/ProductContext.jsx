import { createContext, useContext, useEffect, useState } from "react";

const ProductContext = createContext();
function ProductProvider({ children }) {
  const [productList, setProductList] = useState(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : products;
  });
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(productList));
  }, [productList]);
  function addProduct(product) {
    const newProdudt = {
      ...product,
      id: Date.now(),
      price: Number(product.price),
      stock: Number(product.stock),
    };
    setProductList((prev) => [...prev, newProdudt]);
  }
  function updateProduct(updatedProduct) {
    setProductList((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
  }
  function deleteProduct(id) {
    setProductList((prev) => prev.filter((product) => product.id !== id));
  }
  return (
    <ProductContext.Provider
      value={{ productList, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}
export function useProducts() {
  return useContext(ProductContext);
}

export default ProductProvider;
