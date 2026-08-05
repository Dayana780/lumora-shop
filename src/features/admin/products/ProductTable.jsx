import ProductRow from "./ProductRow";

function ProductTable({ products, onDelete, onEdit }) {
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th>Name</th>

          <th>Price</th>

          <th>Category</th>

          <th>Stock</th>

          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <ProductRow
            key={product.id}
            onEdit={onEdit}
            product={product}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}

export default ProductTable;
