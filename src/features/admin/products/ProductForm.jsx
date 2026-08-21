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

  // Get categories
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

  // Edit product
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

    setError("");
  }, [selectedProduct]);

  // Cleanup image preview
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle input change
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  // Handle image change
  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  // Submit
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

  return (
    <form onSubmit={handleSubmit} className="lumora-product-form">
      {/* PRODUCT INFORMATION */}
      <div className="lumora-product-form-section">
        <div className="lumora-product-form-section-title">
          <span className="lumora-product-form-section-icon">P</span>

          <div>
            <h3>Product Information</h3>
            <p>Enter the basic information of your product.</p>
          </div>
        </div>

        {/* TITLE */}
        <div className="lumora-product-field">
          <label htmlFor="product-title">
            Product Name
            <span>*</span>
          </label>

          <input
            id="product-title"
            name="title"
            type="text"
            placeholder="Enter product name"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* PRICE + STOCK */}
        <div className="lumora-product-fields-row">
          <div className="lumora-product-field">
            <label htmlFor="product-price">
              Price
              <span>*</span>
            </label>

            <div className="lumora-input-with-suffix">
              <input
                id="product-price"
                name="price"
                type="number"
                min="0"
                placeholder="0"
                value={formData.price}
                onChange={handleChange}
                disabled={loading}
              />

              <span>تومان</span>
            </div>
          </div>

          <div className="lumora-product-field">
            <label htmlFor="product-stock">
              Stock
              <span>*</span>
            </label>

            <div className="lumora-input-with-suffix">
              <input
                id="product-stock"
                name="stock"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock}
                onChange={handleChange}
                disabled={loading}
              />

              <span>Units</span>
            </div>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="lumora-product-field">
          <label htmlFor="product-category">
            Category
            <span>*</span>
          </label>

          <select
            id="product-category"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            disabled={loadingCategories || loading}
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

          {loadingCategories && (
            <small className="lumora-product-helper">
              Loading available categories...
            </small>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="lumora-product-field">
          <label htmlFor="product-description">
            Description
            <span>*</span>
          </label>

          <textarea
            id="product-description"
            name="description"
            placeholder="Write a description for this product..."
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            rows={5}
          />

          <small className="lumora-product-helper">
            Add useful information about the product for customers.
          </small>
        </div>
      </div>

      {/* IMAGE */}
      <div className="lumora-product-form-section">
        <div className="lumora-product-form-section-title">
          <span className="lumora-product-form-section-icon">IMG</span>

          <div>
            <h3>Product Image</h3>
            <p>Upload an image for this product.</p>
          </div>
        </div>

        <label htmlFor="product-image" className="lumora-product-upload-area">
          {imagePreview ? (
            <div className="lumora-product-image-preview">
              <img src={imagePreview} alt="Product preview" />

              <div className="lumora-product-image-overlay">
                <span>Change Image</span>
              </div>
            </div>
          ) : (
            <>
              <div className="lumora-upload-icon">↑</div>

              <strong>Click to upload product image</strong>

              <span>PNG, JPG or WEBP · Maximum 5MB</span>
            </>
          )}

          <input
            id="product-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
        </label>

        {imageFile && (
          <div className="lumora-selected-file">
            <span className="lumora-selected-file-icon">✓</span>

            <div>
              <strong>{imageFile.name}</strong>

              <small>{(imageFile.size / 1024 / 1024).toFixed(2)} MB</small>
            </div>
          </div>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="lumora-product-form-error">
          <span className="lumora-product-error-icon">!</span>

          <div>
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="lumora-product-form-actions">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="lumora-product-cancel-button"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading || loadingCategories}
          className="lumora-product-submit-button"
        >
          {loading ? (
            <>
              <span className="lumora-product-button-spinner" />
              Saving...
            </>
          ) : (
            <>
              <span>{selectedProduct ? "✓" : "+"}</span>

              {selectedProduct ? "Update Product" : "Save Product"}
            </>
          )}
        </button>
      </div>

      <style>{`
        .lumora-product-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
          color: #30272A;
        }

        /* SECTION */

        .lumora-product-form-section {
          padding: 18px;
          border: 1px solid #F0DDE0;
          border-radius: 15px;
          background: #FFFFFF;
        }

        .lumora-product-form-section-title {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 18px;
        }

        .lumora-product-form-section-icon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 9px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .03em;
        }

        .lumora-product-form-section-title h3 {
          margin: 0;
          color: #30272A;
          font-size: 14px;
          font-weight: 700;
        }

        .lumora-product-form-section-title p {
          margin: 3px 0 0;
          color: #9A8F91;
          font-size: 11px;
          line-height: 1.5;
        }

        /* FIELDS */

        .lumora-product-field {
          width: 100%;
          margin-bottom: 15px;
        }

        .lumora-product-field:last-child {
          margin-bottom: 0;
        }

        .lumora-product-field label {
          display: block;
          margin-bottom: 7px;
          color: #4D4144;
          font-size: 12px;
          font-weight: 600;
        }

        .lumora-product-field label span {
          margin-left: 3px;
          color: #D85C70;
        }

        .lumora-product-field input,
        .lumora-product-field select,
        .lumora-product-field textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #F0DDE0;
          border-radius: 10px;
          outline: none;
          background: #FFFDFC;
          color: #30272A;
          font-family: inherit;
          font-size: 13px;
          transition:
            border-color .18s ease,
            box-shadow .18s ease,
            background .18s ease;
        }

        .lumora-product-field input,
        .lumora-product-field select {
          height: 42px;
          padding: 0 12px;
        }

        .lumora-product-field textarea {
          min-height: 110px;
          padding: 11px 12px;
          resize: vertical;
          line-height: 1.7;
        }

        .lumora-product-field input::placeholder,
        .lumora-product-field textarea::placeholder {
          color: #B5AAAC;
        }

        .lumora-product-field input:hover,
        .lumora-product-field select:hover,
        .lumora-product-field textarea:hover {
          border-color: #F5C6CC;
        }

        .lumora-product-field input:focus,
        .lumora-product-field select:focus,
        .lumora-product-field textarea:focus {
          border-color: #D85C70;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(216, 92, 112, .09);
        }

        .lumora-product-field input:disabled,
        .lumora-product-field select:disabled,
        .lumora-product-field textarea:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        /* PRICE / STOCK */

        .lumora-product-fields-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .lumora-input-with-suffix {
          position: relative;
        }

        .lumora-input-with-suffix input {
          padding-right: 58px;
        }

        .lumora-input-with-suffix span {
          position: absolute;
          top: 50%;
          right: 11px;
          transform: translateY(-50%);
          color: #9A8F91;
          font-size: 10px;
          font-weight: 600;
          pointer-events: none;
        }

        /* HELPER */

        .lumora-product-helper {
          display: block;
          margin-top: 5px;
          color: #9A8F91;
          font-size: 10px;
          line-height: 1.5;
        }

        /* IMAGE UPLOAD */

        .lumora-product-upload-area {
          position: relative;
          min-height: 170px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 18px;
          border: 1.5px dashed #F0C6CC;
          border-radius: 13px;
          background: #FFF9F7;
          text-align: center;
          cursor: pointer;
          overflow: hidden;
          transition:
            border-color .18s ease,
            background .18s ease;
        }

        .lumora-product-upload-area:hover {
          border-color: #D85C70;
          background: #FFF5F3;
        }

        .lumora-product-upload-area input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .lumora-upload-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          margin-bottom: 10px;
          border-radius: 12px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 22px;
          font-weight: 700;
        }

        .lumora-product-upload-area > strong {
          color: #4D4144;
          font-size: 12px;
          font-weight: 700;
        }

        .lumora-product-upload-area > span {
          margin-top: 5px;
          color: #9A8F91;
          font-size: 10px;
        }

        /* IMAGE PREVIEW */

        .lumora-product-image-preview {
          position: relative;
          width: 100%;
          height: 210px;
          overflow: hidden;
          border-radius: 11px;
          background: #F8F4F3;
        }

        .lumora-product-image-preview img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: contain;
        }

        .lumora-product-image-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 14px;
          background: linear-gradient(
            to top,
            rgba(48, 39, 42, .48),
            transparent 55%
          );
          opacity: 0;
          transition: opacity .18s ease;
        }

        .lumora-product-upload-area:hover
        .lumora-product-image-overlay {
          opacity: 1;
        }

        .lumora-product-image-overlay span {
          padding: 7px 12px;
          border-radius: 8px;
          background: rgba(255, 255, 255, .95);
          color: #D85C70;
          font-size: 11px;
          font-weight: 700;
        }

        /* SELECTED FILE */

        .lumora-selected-file {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 10px;
          padding: 9px 11px;
          border: 1px solid #E2EDE4;
          border-radius: 9px;
          background: #F5FAF6;
        }

        .lumora-selected-file-icon {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 7px;
          background: #DCEEE0;
          color: #6FA27C;
          font-size: 12px;
          font-weight: 700;
        }

        .lumora-selected-file div {
          min-width: 0;
        }

        .lumora-selected-file strong {
          display: block;
          overflow: hidden;
          color: #4D4144;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lumora-selected-file small {
          display: block;
          margin-top: 2px;
          color: #9A8F91;
          font-size: 9px;
        }

        /* ERROR */

        .lumora-product-form-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          border: 1px solid #F4D2D2;
          border-radius: 10px;
          background: #FFF6F6;
          color: #D85C5C;
        }

        .lumora-product-error-icon {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 7px;
          background: #FFE7E7;
          font-size: 12px;
          font-weight: 700;
        }

        .lumora-product-form-error strong {
          display: block;
          margin-bottom: 2px;
          font-size: 11px;
        }

        .lumora-product-form-error p {
          margin: 0;
          color: #9B5C5C;
          font-size: 11px;
          line-height: 1.5;
        }

        /* ACTIONS */

        .lumora-product-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 3px;
        }

        .lumora-product-cancel-button,
        .lumora-product-submit-button {
          min-height: 42px;
          padding: 0 17px;
          border-radius: 10px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition:
            background .18s ease,
            border-color .18s ease,
            color .18s ease,
            transform .18s ease,
            opacity .18s ease;
        }

        .lumora-product-cancel-button {
          border: 1px solid #F0DDE0;
          background: #FFFFFF;
          color: #776B6D;
        }

        .lumora-product-cancel-button:hover:not(:disabled) {
          border-color: #F5C6CC;
          background: #FFF0EC;
          color: #D85C70;
        }

        .lumora-product-submit-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 145px;
          border: 0;
          background: #D85C70;
          color: #FFFFFF;
          box-shadow: 0 6px 16px rgba(216, 92, 112, .16);
        }

        .lumora-product-submit-button:hover:not(:disabled) {
          background: #B83F55;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(216, 92, 112, .21);
        }

        .lumora-product-cancel-button:disabled,
        .lumora-product-submit-button:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .lumora-product-submit-button:focus-visible,
        .lumora-product-cancel-button:focus-visible {
          outline: 3px solid #F5C6CC;
          outline-offset: 2px;
        }

        .lumora-product-button-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, .45);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: lumoraProductSpin .7s linear infinite;
        }

        @keyframes lumoraProductSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 520px) {
          .lumora-product-fields-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .lumora-product-form-section {
            padding: 15px;
          }

          .lumora-product-form-actions {
            flex-direction: column-reverse;
          }

          .lumora-product-cancel-button,
          .lumora-product-submit-button {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lumora-product-button-spinner {
            animation: none;
          }

          .lumora-product-field input,
          .lumora-product-field select,
          .lumora-product-field textarea,
          .lumora-product-upload-area,
          .lumora-product-submit-button,
          .lumora-product-cancel-button {
            transition: none;
          }
        }
      `}</style>
    </form>
  );
}

export default ProductForm;
