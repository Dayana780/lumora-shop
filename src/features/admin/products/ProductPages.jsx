import { useState } from "react";

import products from "../../../data/products";

import ProductSearch from "./ProductSearch";
import AddProductButton from "./AddProductButton";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";

function ProductPage() {
  const [search, setSearch] = useState("");
  const [productList, setProductList] = useState(products);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );
  function handleAddProduct(product) {
    const newProdudt = {
      ...product,
      id: Date.now(),
      price: Number(product.price),
      stock: Number(product.stock),
    };
    setProductList((prev) => [...prev, newProdudt]);
  }
  function handleEditClick(product) {
    setSelectedProduct(product);
    setShowModal(true);
  }

  function handleDelete(id) {
    const confrimDelete = window.confirm(
      "Are you sure about Delete this product?",
    );
    if (!confrimDelete) return;

    setProductList((prev) => prev.filter((product) => product.id !== id));
  }
  function handleUpdateProduct(updatedProduct) {
    setProductList((prev) =>
      prev.map((product) => {
        if (product.id === updatedProduct.id) {
          return updatedProduct;
        }

        return product;
      }),
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>

        <AddProductButton onClick={() => setShowModal(true)} />
      </div>

      <ProductSearch search={search} setSearch={setSearch} />

      <ProductTable
        onEdit={handleEditClick}
        onDelete={handleDelete}
        products={filteredProducts}
      />
      {showModal && (
        <AddProductModal
          updateProduct={handleUpdateProduct}
          selectedProduct={selectedProduct}
          addProduct={handleAddProduct}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}

export default ProductPage;
