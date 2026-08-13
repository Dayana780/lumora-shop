import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

const ProductContext = createContext();
function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}
function ProductProvider({ children }) {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================================
  // Fetch Products
  // =========================================

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.from("products").select(`
            *,
            categories (
              id,
              name,
              slug
            )
          `);

        if (error) {
          throw error;
        }

        setProductList(data ?? []);
      } catch (error) {
        console.error("Fetch products error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // =========================================
  // ADD PRODUCT
  // =========================================

  async function addProduct(product) {
    setError(null);

    try {
      const baseSlug = createSlug(product.title);

      let slug = baseSlug;
      let counter = 1;

      while (true) {
        const { data: existingProduct, error: checkError } = await supabase
          .from("products")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();

        if (checkError) {
          throw checkError;
        }

        if (!existingProduct) {
          break;
        }

        counter++;
        slug = `${baseSlug}-${counter}`;
      }

      const productData = {
        title: product.title,
        slug,
        description: product.description,
        price: Number(product.price),
        stock: Number(product.stock),
        category_id: product.category_id,
      };

      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select(
          `
        *,
        categories (
          id,
          name,
          slug
        )
      `,
        )
        .single();

      if (error) {
        throw error;
      }

      setProductList((prev) => [...prev, data]);

      return data;
    } catch (error) {
      console.error("Add product error:", error);
      setError(error.message);
      throw error;
    }
  }
  // =========================================
  // UPDATE PRODUCT
  // =========================================

  async function updateProduct(updatedProduct) {
    setError(null);

    try {
      const baseSlug = createSlug(updatedProduct.title);
      let slug = baseSlug;
      let counter = 1;

      while (true) {
        const { data: existingProduct, error: checkError } = await supabase
          .from("products")
          .select("id")
          .eq("slug", slug)
          .neq("id", updatedProduct.id)
          .maybeSingle();

        if (checkError) {
          throw checkError;
        }

        if (!existingProduct) {
          break;
        }

        counter++;
        slug = `${baseSlug}-${counter}`;
      }

      const productData = {
        title: updatedProduct.title,
        slug,
        description: updatedProduct.description,
        price: Number(updatedProduct.price),
        stock: Number(updatedProduct.stock),
        category_id: updatedProduct.category_id,
      };

      const { data, error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", updatedProduct.id)
        .select(
          `
        *,
        categories (
          id,
          name,
          slug
        )
      `,
        )
        .single();

      if (error) {
        throw error;
      }

      setProductList((prev) =>
        prev.map((product) =>
          product.id === updatedProduct.id ? data : product,
        ),
      );

      return data;
    } catch (error) {
      console.error("Update product error:", error);
      setError(error.message);
      throw error;
    }
  }

  // =========================================
  // DELETE PRODUCT
  // =========================================

  async function deleteProduct(id) {
    setError(null);

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        throw error;
      }

      setProductList((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Delete product error:", error);
      setError(error.message);

      throw error;
    }
  }

  // =========================================
  // PROVIDER
  // =========================================

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
