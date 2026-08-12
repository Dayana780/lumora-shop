import { useEffect, useState } from "react";
import ProductSearch from "./ProductSearch";
import AddProductButton from "./AddProductButton";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";
import { useProducts } from "../../../context/ProductContext";

function ProductPage() {
  const { productList, addProduct, updateProduct, deleteProduct, loading } =
    useProducts();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);

  // -----------------------------
  // Search
  // -----------------------------

  const searchProducts = productList.filter((product) =>
    product.title?.toLowerCase().includes(search.toLowerCase()),
  );

  // -----------------------------
  // Category Filter
  // -----------------------------

  const filteredProducts = searchProducts.filter((product) => {
    if (category === "all") {
      return true;
    }

    return product.categories?.slug?.toLowerCase() === category.toLowerCase();
  });

  // -----------------------------
  // Sort
  // -----------------------------

  const sortedProducts = [...filteredProducts];

  if (sort === "price-low") {
    sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (sort === "price-high") {
    sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  if (sort === "name") {
    sortedProducts.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  }

  if (sort === "stock") {
    sortedProducts.sort((a, b) => Number(b.stock) - Number(a.stock));
  }

  // -----------------------------
  // Pagination
  // -----------------------------

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const startProduct = sortedProducts.length === 0 ? 0 : startIndex + 1;

  const endProduct = Math.min(endIndex, sortedProducts.length);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  // -----------------------------
  // Reset page when filters change
  // -----------------------------

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, productsPerPage]);

  // -----------------------------
  // Edit
  // -----------------------------

  function handleEditClick(product) {
    setSelectedProduct(product);
    setShowModal(true);
  }

  // -----------------------------
  // Delete
  // -----------------------------

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure about deleting this product?",
    );

    if (!confirmDelete) {
      return;
    }

    deleteProduct(id);
  }

  // -----------------------------
  // Loading
  // -----------------------------

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p>Loading products...</p>
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>

        <AddProductButton
          onClick={() => {
            setSelectedProduct(null);
            setShowModal(true);
          }}
        />
      </div>

      {/* Search */}

      <ProductSearch search={search} setSearch={setSearch} />

      {/* Filters */}

      <div className="flex gap-3">
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
      </div>

      {/* Results info */}

      <p>
        Showing {startProduct} - {endProduct} of {sortedProducts.length}{" "}
        products
      </p>

      {/* Products */}

      {sortedProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg font-semibold">No products found</p>

          <p className="text-gray-500">Try changing your search or filter.</p>
        </div>
      ) : (
        <ProductTable
          products={paginatedProducts}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "font-bold" : ""}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}

      {showModal && (
        <AddProductModal
          selectedProduct={selectedProduct}
          addProduct={addProduct}
          updateProduct={updateProduct}
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
