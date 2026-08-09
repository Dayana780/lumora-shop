import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  price: "",
  category_id: "",
  stock: "",
  description: "",
};

function ProductForm({ addProduct, updateProduct, onClose, selectedProduct }) {
  const [formData, setFormData] = useState(initialForm);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const hasEmptyField = Object.values(formData).some(
      (value) => String(value).trim() === "",
    );

    if (hasEmptyField) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (selectedProduct) {
        await updateProduct({
          ...formData,
          id: selectedProduct.id,
        });
      } else {
        await addProduct(formData);
      }

      setFormData(initialForm);
      onClose();
    } catch (error) {
      console.error("Product save failed:", error);
    }
  }

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        title: selectedProduct.title ?? "",
        price: selectedProduct.price ?? "",
        category_id: selectedProduct.category_id ?? "",
        stock: selectedProduct.stock ?? "",
        description: selectedProduct.description ?? "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [selectedProduct]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        placeholder="Product Name"
        value={formData.title}
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
        name="category_id"
        placeholder="Category ID"
        value={formData.category_id}
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

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

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
