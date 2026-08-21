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

  const [deleteProductId, setDeleteProductId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search
  const searchProducts = productList.filter((product) =>
    product.title?.toLowerCase().includes(search.toLowerCase()),
  );

  // Category Filter
  const filteredProducts = searchProducts.filter((product) => {
    if (category === "all") {
      return true;
    }

    return product.categories?.slug?.toLowerCase() === category.toLowerCase();
  });

  // Sort
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

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const endIndex = startIndex + productsPerPage;

  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  const startProduct = sortedProducts.length === 0 ? 0 : startIndex + 1;

  const endProduct = Math.min(endIndex, sortedProducts.length);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, productsPerPage, sort]);

  // Edit
  function handleEditClick(product) {
    setSelectedProduct(product);
    setShowModal(true);
  }

  // Ask delete confirmation
  function handleDelete(id) {
    setDeleteProductId(id);
  }

  // Confirm delete
  async function confirmDelete() {
    if (!deleteProductId) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteProduct(deleteProductId);
      setDeleteProductId(null);
    } catch (error) {
      console.error("Delete product failed:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="lumora-products-loading">
        <div className="lumora-loading-spinner" />

        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="lumora-products-page">
      {/* PAGE HEADER */}
      <div className="lumora-products-header">
        <div>
          <span className="lumora-products-eyebrow">PRODUCT MANAGEMENT</span>

          <h1>Products</h1>

          <p>Manage your products, inventory and product information.</p>
        </div>

        <AddProductButton
          onClick={() => {
            setSelectedProduct(null);
            setShowModal(true);
          }}
        />
      </div>

      {/* SEARCH */}
      <div className="lumora-products-search-card">
        <ProductSearch search={search} setSearch={setSearch} />
      </div>

      {/* FILTERS */}
      <div className="lumora-products-toolbar">
        <div className="lumora-products-filter-group">
          <div className="lumora-products-filter">
            <label>Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="skincare">Skincare</option>
              <option value="lip">Lip</option>
              <option value="eye">Eye</option>
              <option value="face">Face</option>
              <option value="hair">Hair</option>
            </select>
          </div>

          <div className="lumora-products-filter">
            <label>Sort By</label>

            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="default">Default</option>

              <option value="price-low">Price: Low → High</option>

              <option value="price-high">Price: High → Low</option>

              <option value="name">Name: A → Z</option>

              <option value="stock">Stock</option>
            </select>
          </div>

          <div className="lumora-products-filter">
            <label>Per Page</label>

            <select
              value={productsPerPage}
              onChange={(e) => setProductsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* RESULT COUNT */}
        <div className="lumora-products-result">
          <span className="lumora-products-result-number">
            {sortedProducts.length}
          </span>

          <span>Products</span>
        </div>
      </div>

      {/* RESULTS INFO */}
      <div className="lumora-products-results-info">
        <span>
          Showing <strong>{startProduct}</strong>
          {" - "}
          <strong>{endProduct}</strong>
          {" of "}
          <strong>{sortedProducts.length}</strong>
          {" products"}
        </span>

        {(search || category !== "all" || sort !== "default") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setSort("default");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* PRODUCTS */}
      {sortedProducts.length === 0 ? (
        <div className="lumora-products-empty">
          <div className="lumora-products-empty-icon">◇</div>

          <h2>No products found</h2>

          <p>Try changing your search or filter settings.</p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setSort("default");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="lumora-products-table-card">
          <ProductTable
            products={paginatedProducts}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="lumora-products-pagination">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="lumora-pagination-arrow"
          >
            ←<span>Previous</span>
          </button>

          <div className="lumora-pagination-pages">
            {pages.map((page) => (
              <button
                type="button"
                key={page}
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? "lumora-pagination-page active"
                    : "lumora-pagination-page"
                }
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="lumora-pagination-arrow"
          >
            <span>Next</span>→
          </button>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
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

      {/* DELETE CONFIRM MODAL */}
      {deleteProductId && (
        <div
          className="lumora-delete-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setDeleteProductId(null);
            }
          }}
        >
          <div className="lumora-delete-modal">
            <div className="lumora-delete-icon">!</div>

            <h2>Delete Product?</h2>

            <p>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>

            <div className="lumora-delete-actions">
              <button
                type="button"
                onClick={() => setDeleteProductId(null)}
                disabled={isDeleting}
                className="lumora-delete-cancel"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="lumora-delete-confirm"
              >
                {isDeleting ? (
                  <>
                    <span className="lumora-delete-spinner" />
                    Deleting...
                  </>
                ) : (
                  "Delete Product"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .lumora-products-page {
          width: 100%;
          box-sizing: border-box;
          color: #30272A;
        }

        /* HEADER */

        .lumora-products-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .lumora-products-eyebrow {
          display: block;
          margin-bottom: 6px;
          color: #D85C70;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .12em;
        }

        .lumora-products-header h1 {
          margin: 0;
          color: #30272A;
          font-size: 26px;
          font-weight: 700;
          line-height: 1.3;
        }

        .lumora-products-header p {
          margin: 6px 0 0;
          color: #9A8F91;
          font-size: 12px;
        }

        /* SEARCH */

        .lumora-products-search-card {
          padding: 15px 17px;
          margin-bottom: 14px;
          border: 1px solid #F0DDE0;
          border-radius: 14px;
          background: #FFFFFF;
          box-shadow: 0 5px 20px rgba(48, 39, 42, .035);
        }

        /* TOOLBAR */

        .lumora-products-toolbar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          padding: 16px 17px;
          border: 1px solid #F0DDE0;
          border-radius: 14px;
          background: #FFF9F7;
        }

        .lumora-products-filter-group {
          display: flex;
          align-items: flex-end;
          gap: 12px;
        }

        .lumora-products-filter {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .lumora-products-filter label {
          color: #776B6D;
          font-size: 10px;
          font-weight: 600;
        }

        .lumora-products-filter select {
          min-width: 145px;
          height: 39px;
          padding: 0 11px;
          border: 1px solid #F0DDE0;
          border-radius: 9px;
          outline: none;
          background: #FFFFFF;
          color: #4D4144;
          font-family: inherit;
          font-size: 11px;
          cursor: pointer;
          transition: border-color .18s ease,
                      box-shadow .18s ease;
        }

        .lumora-products-filter select:hover {
          border-color: #F5C6CC;
        }

        .lumora-products-filter select:focus {
          border-color: #D85C70;
          box-shadow: 0 0 0 3px rgba(216, 92, 112, .08);
        }

        .lumora-products-result {
          display: flex;
          align-items: center;
          gap: 6px;
          height: 39px;
          padding: 0 12px;
          border: 1px solid #F0DDE0;
          border-radius: 9px;
          background: #FFFFFF;
          color: #9A8F91;
          font-size: 10px;
        }

        .lumora-products-result-number {
          color: #D85C70;
          font-size: 15px;
          font-weight: 700;
        }

        /* RESULTS */

        .lumora-products-results-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 45px;
          color: #9A8F91;
          font-size: 11px;
        }

        .lumora-products-results-info strong {
          color: #4D4144;
          font-weight: 700;
        }

        .lumora-products-results-info button {
          padding: 5px 8px;
          border: 0;
          background: transparent;
          color: #D85C70;
          font-family: inherit;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .lumora-products-results-info button:hover {
          color: #B83F55;
          text-decoration: underline;
        }

        /* TABLE */

        .lumora-products-table-card {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #F0DDE0;
          border-radius: 14px;
          background: #FFFFFF;
          box-shadow: 0 5px 20px rgba(48, 39, 42, .035);
        }

        .lumora-products-table-card > * {
          min-width: 850px;
        }

        /* EMPTY */

        .lumora-products-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          padding: 30px;
          border: 1px solid #F0DDE0;
          border-radius: 14px;
          background: #FFFFFF;
          text-align: center;
        }

        .lumora-products-empty-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin-bottom: 14px;
          border-radius: 17px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 25px;
        }

        .lumora-products-empty h2 {
          margin: 0;
          color: #4D4144;
          font-size: 16px;
        }

        .lumora-products-empty p {
          margin: 6px 0 16px;
          color: #9A8F91;
          font-size: 11px;
        }

        .lumora-products-empty button {
          min-height: 36px;
          padding: 0 14px;
          border: 1px solid #F0DDE0;
          border-radius: 9px;
          background: #FFFFFF;
          color: #D85C70;
          font-family: inherit;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }

        .lumora-products-empty button:hover {
          border-color: #F5C6CC;
          background: #FFF0EC;
        }

        /* PAGINATION */

        .lumora-products-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-top: 20px;
        }

        .lumora-pagination-pages {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .lumora-pagination-page,
        .lumora-pagination-arrow {
          height: 34px;
          border: 1px solid #F0DDE0;
          border-radius: 8px;
          background: #FFFFFF;
          color: #776B6D;
          font-family: inherit;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all .18s ease;
        }

        .lumora-pagination-page {
          width: 34px;
          padding: 0;
        }

        .lumora-pagination-page:hover:not(.active),
        .lumora-pagination-arrow:hover:not(:disabled) {
          border-color: #F5C6CC;
          background: #FFF0EC;
          color: #D85C70;
        }

        .lumora-pagination-page.active {
          border-color: #D85C70;
          background: #D85C70;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(216, 92, 112, .15);
        }

        .lumora-pagination-arrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0 11px;
        }

        .lumora-pagination-arrow:disabled {
          opacity: .4;
          cursor: not-allowed;
        }

        /* LOADING */

        .lumora-products-loading {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #9A8F91;
          font-size: 12px;
        }

        .lumora-loading-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid #F5C6CC;
          border-top-color: #D85C70;
          border-radius: 50%;
          animation: lumoraProductsSpin .7s linear infinite;
        }

        /* DELETE MODAL */

        .lumora-delete-overlay {
          position: fixed;
          inset: 0;
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(48, 39, 42, .48);
          backdrop-filter: blur(4px);
          animation: lumoraDeleteOverlay .18s ease;
        }

        .lumora-delete-modal {
          width: min(390px, 100%);
          padding: 27px;
          border: 1px solid #F0DDE0;
          border-radius: 18px;
          background: #FFFFFF;
          box-shadow: 0 24px 70px rgba(48, 39, 42, .18);
          text-align: center;
          animation: lumoraDeleteEnter .2s ease;
        }

        .lumora-delete-icon {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          margin: 0 auto 14px;
          border-radius: 15px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 20px;
          font-weight: 700;
        }

        .lumora-delete-modal h2 {
          margin: 0;
          color: #30272A;
          font-size: 18px;
        }

        .lumora-delete-modal p {
          margin: 8px 0 21px;
          color: #9A8F91;
          font-size: 11px;
          line-height: 1.7;
        }

        .lumora-delete-actions {
          display: flex;
          justify-content: center;
          gap: 9px;
        }

        .lumora-delete-cancel,
        .lumora-delete-confirm {
          min-height: 40px;
          padding: 0 16px;
          border-radius: 9px;
          font-family: inherit;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all .18s ease;
        }

        .lumora-delete-cancel {
          border: 1px solid #F0DDE0;
          background: #FFFFFF;
          color: #776B6D;
        }

        .lumora-delete-cancel:hover:not(:disabled) {
          border-color: #F5C6CC;
          background: #FFF0EC;
          color: #D85C70;
        }

        .lumora-delete-confirm {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-width: 125px;
          border: 0;
          background: #D85C70;
          color: #FFFFFF;
        }

        .lumora-delete-confirm:hover:not(:disabled) {
          background: #B83F55;
          transform: translateY(-1px);
        }

        .lumora-delete-cancel:disabled,
        .lumora-delete-confirm:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .lumora-delete-spinner {
          width: 13px;
          height: 13px;
          border: 2px solid rgba(255,255,255,.45);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: lumoraProductsSpin .7s linear infinite;
        }

        @keyframes lumoraProductsSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes lumoraDeleteOverlay {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes lumoraDeleteEnter {
          from {
            opacity: 0;
            transform: translateY(10px) scale(.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* RESPONSIVE */

        @media (max-width: 800px) {
          .lumora-products-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .lumora-products-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .lumora-products-filter-group {
            flex-wrap: wrap;
          }

          .lumora-products-result {
            width: fit-content;
          }
        }

        @media (max-width: 550px) {
          .lumora-products-filter-group {
            display: grid;
            grid-template-columns: 1fr;
          }

          .lumora-products-filter select {
            width: 100%;
          }

          .lumora-products-pagination {
            gap: 6px;
          }

          .lumora-pagination-arrow span {
            display: none;
          }

          .lumora-pagination-arrow {
            width: 34px;
            padding: 0;
            justify-content: center;
          }

          .lumora-products-results-info {
            align-items: flex-start;
            flex-direction: column;
            gap: 5px;
            padding: 8px 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lumora-loading-spinner,
          .lumora-delete-spinner,
          .lumora-delete-overlay,
          .lumora-delete-modal {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductPage;
