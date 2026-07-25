function ProductSearch({ search, setSearch }) {
  return (
    <input
      type="search"
      placeholder="Search product..."
      className="
      w-full
      border
      rounded
      px-3
      py-2
      "
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

export default ProductSearch;
