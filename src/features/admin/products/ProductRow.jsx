function ProductRow({ product, onDelete, onEdit }) {
  return (
    <tr className="border-t">
      <td>{product.title}</td>

      <td>${product.price}</td>

      <td>{product.categories?.name || "—"}</td>

      <td>{product.stock}</td>

      <td>
        <button onClick={() => onEdit(product)}>Edit</button>

        {" | "}

        <button onClick={() => onDelete(product.id)}>Delete</button>
      </td>
    </tr>
  );
}

export default ProductRow;
