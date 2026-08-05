import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  price: "",
  category: "",
  stock: "",
  image: "",
  description: "",
};

function ProductForm({ addProduct, updateProduct, onClose, selectedProduct }) {
  const [formData, setFormData] = useState(initialForm);
  const [preview, setPreview] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const hasEmptyField = Object.entries(formData).some(([key, value]) => {
      if (key === "image") return false;

      return typeof value === "string" && value.trim() === "";
    });

    if (hasEmptyField) {
      alert("Please fill all fields");
      return;
    }

    if (selectedProduct) {
      updateProduct({
        ...formData,
        id: selectedProduct.id,
      });
    } else {
      addProduct(formData);
    }

    setFormData(initialForm);
    setPreview("");
    onClose();
  }

  useEffect(() => {
    if (selectedProduct) {
      setFormData(selectedProduct);
      setPreview(selectedProduct.image);
    } else {
      setFormData(initialForm);
      setPreview("");
    }
  }, [selectedProduct]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        name="stock"
        type="number"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full border rounded p-2"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-40 h-40 object-cover rounded border"
        />
      )}

      <button
        type="submit"
        className="w-full bg-pink-500 text-white rounded py-2"
      >
        {selectedProduct ? "Update Product" : "Save Product"}
      </button>
    </form>
  );
}

export default ProductForm;
