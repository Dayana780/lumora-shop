import ProductForm from "./ProductForm";

function AddProductModal({
  onClose,
  updateProduct,
  addProduct,
  selectedProduct,
}) {
  return (
    <div
      className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      "
    >
      <div
        className="
        bg-white
        p-6
        rounded
        w-[500px]
        "
      >
        <div className="flex justify-between mb-5">
          <h2 className="text-xl font-bold">Add Product</h2>

          <button onClick={onClose}>✕</button>
        </div>

        <ProductForm
          updateProduct={updateProduct}
          selectedProduct={selectedProduct}
          onClose={onClose}
          addProduct={addProduct}
        />
      </div>
    </div>
  );
}

export default AddProductModal;
