import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
const ProductContext = createContext();

function ProductProvider({ children }) {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(`* , categories (id , name , slug)`);
        if (error) {
          throw error;
        }
        setProductList(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);
  async function addProduct(product) {
    console.log("pppppppppppp");
    setError(null);
    try {
      const { data, error } = await supabase
        .from("products")
        .insert({
          title: product.title,
          description: product.description,
          price: Number(product.price),
          stock: Number(product.stock),
          category_id: product.category_id,
        })
        .select()
        .single();
      console.log("dddddrr", { data, error });
      if (error) {
        throw error;
      }
      setProductList((prev) => [...prev, data]);
      console.log("added");
    } catch (error) {
      console.log("eeror", { error });
      setError(error.message);
    }
    //  finally {
    // }
  }

  function updateProduct(updatedProduct) {
    const productWithNumbers = {
      ...updatedProduct,
      price: Number(updatedProduct.price),
      stock: Number(updatedProduct.stock),
    };

    setProductList((prev) =>
      prev.map((product) =>
        product.id === productWithNumbers.id ? productWithNumbers : product,
      ),
    );
  }

  function deleteProduct(id) {
    setProductList((prev) => prev.filter((product) => product.id !== id));
  }

  return (
    <ProductContext.Provider
      value={{
        productList,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}

export default ProductProvider;
