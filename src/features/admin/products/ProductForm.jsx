import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase.js";

const initialForm = {
  title: "",
  price: "",
  category_id: "",
  stock: "",
  description: "",
};

function ProductForm({ addProduct, updateProduct, onClose, selectedProduct }) {
  const [formData, setFormData] = useState(initialForm);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // GET CATEGORIES
  // =========================================

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, name, slug")
          .order("name");

        if (error) {
          throw error;
        }

        setCategories(data ?? []);
      } catch (error) {
        console.error("Fetch categories error:", error);
        setError(error.message);
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  // =========================================
  // EDIT PRODUCT
  // =========================================

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        title: selectedProduct.title ?? "",
        price: selectedProduct.price ?? "",
        category_id: selectedProduct.category_id ?? "",
        stock: selectedProduct.stock ?? "",
        description: selectedProduct.description ?? "",
      });

      setImageFile(null);
      setImagePreview("");
    } else {
      setFormData(initialForm);
      setImageFile(null);
      setImagePreview("");
    }
  }, [selectedProduct]);

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // =========================================
  // HANDLE IMAGE CHANGE
  // =========================================

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    // فقط عکس
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // حداکثر 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  // =========================================
  // SUBMIT
  // =========================================

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Product title is required.");
      return;
    }

    if (!formData.price) {
      setError("Price is required.");
      return;
    }

    if (!formData.category_id) {
      setError("Please select a category.");
      return;
    }

    if (!formData.stock) {
      setError("Stock is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required.");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        title: formData.title.trim(),
        price: Number(formData.price),
        category_id: formData.category_id,
        stock: Number(formData.stock),
        description: formData.description.trim(),

        // عکس را هم همراه محصول می‌فرستیم
        imageFile,
      };

      if (selectedProduct) {
        await updateProduct({
          ...productData,
          id: selectedProduct.id,
        });
      } else {
        await addProduct(productData);
      }

      setFormData(initialForm);
      setImageFile(null);
      setImagePreview("");

      onClose();
    } catch (error) {
      console.error("Product save failed:", error);
      setError(error.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // UI
  // =========================================

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* TITLE */}

      <input
        name="title"
        placeholder="Product Name"
        value={formData.title}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      {/* PRICE */}

      <input
        name="price"
        type="number"
        min="0"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      {/* CATEGORY */}

      <select
        name="category_id"
        value={formData.category_id}
        onChange={handleChange}
        disabled={loadingCategories}
        className="w-full border rounded p-2"
      >
        <option value="">
          {loadingCategories ? "Loading categories..." : "Select category"}
        </option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* STOCK */}

      <input
        name="stock"
        type="number"
        min="0"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      {/* DESCRIPTION */}

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      {/* IMAGE */}

      <div>
        <label className="block mb-2 font-medium">Product Image</label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border rounded p-2"
        />

        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Product preview"
              className="h-40 w-40 rounded-lg object-cover border"
            />
          </div>
        )}
      </div>

      {/* ERROR */}

      {error && <p className="text-red-500">{error}</p>}

      {/* BUTTON */}

      <button
        type="submit"
        disabled={loading || loadingCategories}
        className="w-full bg-pink-500 text-white rounded py-2 disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : selectedProduct
            ? "Update Product"
            : "Save Product"}
      </button>
    </form>
  );
}

export default ProductForm;
