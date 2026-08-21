import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "../lib/supabase";

const ProductContext = createContext();

const PRODUCTS_QUERY_KEY = ["products"];

function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

// Fetch products
// Products are server state (they live in the DB and can change),
// so React Query owns fetching + caching them. This replaces the
// old manual useEffect/useState fetch.

async function fetchProducts() {
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
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

// Upload product image

async function uploadProductImage(file, productId) {
  if (!file) {
    return null;
  }

  const fileExt = file.name.split(".").pop()?.toLowerCase();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `products/${productId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return {
    publicUrl: data.publicUrl,
    filePath,
  };
}

// Delete image from storage

async function deleteStorageImage(imageUrl) {
  if (!imageUrl) {
    return;
  }

  const marker = "/product-images/";
  const markerIndex = imageUrl.indexOf(marker);

  if (markerIndex === -1) {
    console.warn("Could not extract storage path:", imageUrl);
    return;
  }

  const filePath = decodeURIComponent(
    imageUrl.substring(markerIndex + marker.length),
  );

  const { error } = await supabase.storage
    .from("product-images")
    .remove([filePath]);

  if (error) {
    console.error("Delete storage image error:", error);
    throw error;
  }
}

// ADD PRODUCT (mutation function)

async function createProduct(product) {
  // CREATE UNIQUE SLUG
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

  // CREATE PRODUCT
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

  // UPLOAD IMAGE
  let imageData = null;

  if (product.imageFile) {
    imageData = await uploadProductImage(product.imageFile, data.id);

    const { error: imageError } = await supabase.from("product_images").insert({
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

  return {
    ...data,
    product_images: imageData
      ? [{ image_url: imageData.publicUrl, sort_order: 1 }]
      : [],
  };
}

// UPDATE PRODUCT (mutation function)

async function editProduct(updatedProduct) {
  // CREATE UNIQUE SLUG
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

  // UPDATE PRODUCT DATA
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

  // UPDATE IMAGE
  let imageList = [];

  const { data: existingImages, error: existingImagesError } = await supabase
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

  if (updatedProduct.imageFile) {
    const oldImage = imageList[0];
    const newImage = await uploadProductImage(
      updatedProduct.imageFile,
      updatedProduct.id,
    );

    if (oldImage) {
      // اگر عکس قبلی وجود دارد
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

      imageList = [{ ...oldImage, image_url: newImage.publicUrl, sort_order: 1 }];
    } else {
      // اگر محصول قبلاً عکس نداشته
      const { data: insertedImage, error: imageInsertError } = await supabase
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

  return { ...data, product_images: imageList };
}

// DELETE PRODUCT (mutation function — soft delete)

async function removeProduct(id) {
  const { error } = await supabase
    .from("products")
    .update({ is_active: false })
    .eq("id", id);

  if (error) {
    throw error;
  }

  return id;
}

function ProductProvider({ children }) {
  const queryClient = useQueryClient();

  // Server state (products list) is handled by React Query now:
  // it gives us caching, loading/error state, and refetching for free.
  const {
    data: productList = [],
    isLoading: loading,
    error: fetchError,
  } = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: fetchProducts,
  });

  const addProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Add product error:", error);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: editProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Update product error:", error);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: removeProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Delete product error:", error);
    },
  });

  // Keep the same function signatures the rest of the app already
  // calls (`await addProduct(product)`), so no consumer needs to change.
  function addProduct(product) {
    return addProductMutation.mutateAsync(product);
  }

  function updateProduct(updatedProduct) {
    return updateProductMutation.mutateAsync(updatedProduct);
  }

  function deleteProduct(id) {
    return deleteProductMutation.mutateAsync(id);
  }

  return (
    <ProductContext.Provider
      value={{
        productList,
        loading,
        error: fetchError?.message ?? null,
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
