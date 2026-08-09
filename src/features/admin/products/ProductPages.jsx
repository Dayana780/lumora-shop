import { useState, useEffect } from "react";
import ProductSearch from "./ProductSearch";
import AddProductButton from "./AddProductButton";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";
import { useProducts } from "../../../context/ProductContext";

function ProductPage() {
  const [search, setSearch] = useState("");
  const { productList, addProduct, updateProduct, deleteProduct } =
    useProducts();
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const searchProducts = productList.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredProducts = searchProducts.filter((product) => {
    if (category === "all") return true;

    return (
      product.categories?.slug?.toLocaleLowerCase() ===
      category.toLocaleLowerCase()
    );
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, productsPerPage]);

  const sortedProducts = [...filteredProducts];

  if (sort === "price-low") {
    sortedProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "price-high") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  if (sort === "name") {
    sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sort === "stock") {
    sortedProducts.sort((a, b) => b.stock - a.stock);
  }
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
  const startProduct = sortedProducts.length === 0 ? 0 : startIndex + 1;
  const endProduct = Math.min(endIndex, sortedProducts.length);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  function handleEditClick(product) {
    setSelectedProduct(product);
    setShowModal(true);
  }
  function handleDelete(id) {
    const confrimDelete = window.confirm(
      "Are you sure about Delete this product?",
    );
    if (!confrimDelete) return;
    deleteProduct(id);
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
      <p>
        showing {startProduct}-{endProduct}of{""}
        {sortedProducts.length} products
      </p>

      {sortedProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg font-semibold">No products found</p>

          <p className="text-gray-500">Try changing your search or filter.</p>
        </div>
      ) : (
        <ProductTable
          onEdit={handleEditClick}
          onDelete={handleDelete}
          products={paginatedProducts}
        />
      )}
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
          updateProduct={updateProduct}
          selectedProduct={selectedProduct}
          addProduct={addProduct}
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
