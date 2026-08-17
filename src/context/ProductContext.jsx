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
  // FETCH PRODUCTS
  // =========================================

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            `
            *,
            categories (
              id,
              name,
              slug
            ),
            product_images (
              id,
              image_url,
              sort_order
            )
          `,
          )
          .order("created_at", { ascending: false });

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
  // UPLOAD PRODUCT IMAGE
  // =========================================

  async function uploadProductImage(file, productId) {
    if (!file) {
      return null;
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase();

    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const filePath = `products/${productId}/${fileName}`;

    console.log("🟡 Upload started:", file.name, file.size);
    console.log("🟡 Uploading to:", filePath);

    const start = performance.now();

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    const end = performance.now();

    console.log(`🟢 Upload finished in ${(end - start).toFixed(0)} ms`);

    if (uploadError) {
      console.error("🔴 Storage upload error:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    console.log("🟢 Public URL:", data.publicUrl);

    return {
      publicUrl: data.publicUrl,
      filePath,
    };
  }

  // =========================================
  // DELETE IMAGE FROM STORAGE
  // =========================================

  async function deleteStorageImage(imageUrl) {
    if (!imageUrl) {
      return;
    }

    try {
      const marker = "/product-images/";

      const markerIndex = imageUrl.indexOf(marker);

      if (markerIndex === -1) {
        console.warn("Could not extract storage path:", imageUrl);
        return;
      }

      const filePath = decodeURIComponent(
        imageUrl.substring(markerIndex + marker.length),
      );

      console.log("🟡 Deleting storage file:", filePath);

      const { data, error } = await supabase.storage
        .from("product-images")
        .remove([filePath]);

      if (error) {
        console.error("🔴 Delete storage image error:", error);

        throw error;
      }

      console.log("🟢 Storage delete response:", data);
    } catch (error) {
      console.error("Storage image deletion failed:", error);

      throw error;
    }
  }

  // =========================================
  // ADD PRODUCT
  // =========================================

  async function addProduct(product) {
    setError(null);

    try {
      // =========================================
      // CREATE UNIQUE SLUG
      // =========================================

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

      // =========================================
      // CREATE PRODUCT
      // =========================================

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

      // =========================================
      // UPLOAD IMAGE
      // =========================================

      let imageData = null;

      if (product.imageFile) {
        imageData = await uploadProductImage(product.imageFile, data.id);

        // =========================================
        // SAVE IMAGE URL
        // =========================================

        const { error: imageError } = await supabase
          .from("product_images")
          .insert({
            product_id: data.id,
            image_url: imageData.publicUrl,
            sort_order: 1,
          });

        if (imageError) {
          // اگر ثبت URL شکست خورد، فایل آپلودشده را پاک کن
          await deleteStorageImage(imageData.publicUrl);

          throw imageError;
        }
      }

      // =========================================
      // ADD TO LOCAL STATE
      // =========================================

      const productWithImages = {
        ...data,
        product_images: imageData
          ? [
              {
                image_url: imageData.publicUrl,
                sort_order: 1,
              },
            ]
          : [],
      };

      setProductList((prev) => [productWithImages, ...prev]);

      return productWithImages;
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
      // =========================================
      // CREATE UNIQUE SLUG
      // =========================================

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

      // =========================================
      // UPDATE PRODUCT DATA
      // =========================================

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

      // =========================================
      // UPDATE IMAGE
      // =========================================

      let imageList = [];

      const { data: existingImages, error: existingImagesError } =
        await supabase
          .from("product_images")
          .select(
            `
          id,
          image_url,
          sort_order
        `,
          )
          .eq("product_id", updatedProduct.id)
          .order("sort_order", { ascending: true });

      if (existingImagesError) {
        throw existingImagesError;
      }

      imageList = existingImages ?? [];

      // =========================================
      // NEW IMAGE SELECTED
      // =========================================

      if (updatedProduct.imageFile) {
        const oldImage = imageList[0];

        // اول عکس جدید را آپلود می‌کنیم
        const newImage = await uploadProductImage(
          updatedProduct.imageFile,
          updatedProduct.id,
        );

        // -----------------------------------------
        // اگر عکس قبلی وجود دارد
        // -----------------------------------------

        if (oldImage) {
          const { error: imageUpdateError } = await supabase
            .from("product_images")
            .update({
              image_url: newImage.publicUrl,
              sort_order: 1,
            })
            .eq("id", oldImage.id);

          if (imageUpdateError) {
            // اگر DB شکست خورد، عکس جدید را پاک می‌کنیم
            await deleteStorageImage(newImage.publicUrl);

            throw imageUpdateError;
          }

          // بعد از موفقیت DB، عکس قدیمی را پاک می‌کنیم
          await deleteStorageImage(oldImage.image_url);

          imageList = [
            {
              ...oldImage,
              image_url: newImage.publicUrl,
              sort_order: 1,
            },
          ];
        }

        // -----------------------------------------
        // اگر محصول قبلاً عکس نداشته
        // -----------------------------------------
        else {
          const { data: insertedImage, error: imageInsertError } =
            await supabase
              .from("product_images")
              .insert({
                product_id: updatedProduct.id,
                image_url: newImage.publicUrl,
                sort_order: 1,
              })
              .select()
              .single();

          if (imageInsertError) {
            // اگر DB شکست خورد، عکس جدید را پاک می‌کنیم
            await deleteStorageImage(newImage.publicUrl);

            throw imageInsertError;
          }

          imageList = [insertedImage];
        }
      }

      // =========================================
      // UPDATE LOCAL STATE
      // =========================================

      const updatedProductWithImages = {
        ...data,
        product_images: imageList,
      };

      setProductList((prev) =>
        prev.map((product) =>
          product.id === updatedProduct.id ? updatedProductWithImages : product,
        ),
      );

      return updatedProductWithImages;
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
