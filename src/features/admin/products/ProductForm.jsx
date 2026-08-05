import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  price: "",
  category: "",
  stock: "",
  image: "",
  description: "",
};

function ProductForm({ addProduct, onClose, selectedProduct, updateProduct }) {
  const [formData, setFormData] = useState(initialForm);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const hasEmptyFild = Object.values(formData).some((value) => {
      if (typeof value === "string") {
        return value.trim() === "";
      }

      return false;
    });
    if (hasEmptyFild) {
      alert("por kon");
      return;
    }
    if (selectedProduct) {
      updateProduct(formData);
    } else {
      addProduct(formData);
    }
    setFormData(initialForm);
    onClose();
  }
  useEffect(() => {
    if (selectedProduct) {
      setFormData(selectedProduct);
    } else {
      setFormData(initialForm);
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
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <button className="w-full bg-pink-500 text-white rounded py-2">
        Save Product
      </button>
    </form>
  );
}

export default ProductForm;
