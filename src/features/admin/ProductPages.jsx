import { useState } from "react";

import products from "../../data/products";

import ProductSearch from "./ProductSearch";
import AddProductButton from "./AddProductButton";
import ProductTable from "./ProductTable";

function ProductPage() {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );
  console.log(search);
  console.log(filteredProducts);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>

        <AddProductButton />
      </div>

      <ProductSearch search={search} setSearch={setSearch} />

      <ProductTable products={filteredProducts} />
    </div>
  );
}

export default ProductPage;
