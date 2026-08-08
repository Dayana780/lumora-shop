import { useState, useEffect } from "react";

import products from "../../../data/products";

import ProductSearch from "./ProductSearch";
import AddProductButton from "./AddProductButton";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";

function ProductPage() {
  const [search, setSearch] = useState("");
  const [productList, setProductList] = useState(products);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const searchProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredProducts = searchProducts.filter((product) => {
    if (category === "all") return true;

    return (
      product.category.toLocaleLowerCase() === category.toLocaleLowerCase()
    );
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sort, productsPerPage]);
  const sortedProducts = [...filteredProducts];

  if (sort === "price-low") {
    sortedProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "price-high") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  if (sort === "name") {
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === "stock") {
    sortedProducts.sort((a, b) => b.stock - a.stock);
  }
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
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
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="skincare">Skincare</option>
        <option value="lip">Lip</option>
        <option value="eye">Eye</option>
        <option value="face">Face</option>
        <option value="hair">Hair</option>
      </select>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="default">Default</option>

        <option value="price-low">Price Low → High</option>

        <option value="price-high">Price High → Low</option>

        <option value="name">Name A → Z</option>

        <option value="stock">Stock</option>
      </select>
      <select
        value={productsPerPage}
        onChange={(e) => setProductsPerPage(Number(e.target.value))}
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
      <ProductTable
        onEdit={handleEditClick}
        onDelete={handleDelete}
        products={paginatedProducts}
      />
      <button
        onClick={() => setCurrentPage((prev) => prev - 1)}
        disabled={currentPage == 1}
      >
        Previes
      </button>
      <div className="flex gap-2">
        {pages.map((page) => (
          <button key={page} onClick={() => setCurrentPage(page)}>
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={() => setCurrentPage((prev) => prev + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
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
