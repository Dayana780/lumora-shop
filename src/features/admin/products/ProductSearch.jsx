function ProductSearch({ search, setSearch }) {
  return (
    <div className="lumora-product-search">
      <div className="lumora-product-search-icon">⌕</div>

      <input
        type="search"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <button
          type="button"
          className="lumora-product-search-clear"
          onClick={() => setSearch("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default ProductSearch;
