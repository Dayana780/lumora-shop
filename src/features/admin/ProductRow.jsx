function ProductRow({ product }) {
  return (
    <tr className="border-t">
      <td>{product.name}</td>

      <td>${product.price}</td>

      <td>{product.category}</td>

      <td>{product.stock}</td>

      <td>
        <button>Edit</button>

        {" | "}

        <button>Delete</button>
      </td>
    </tr>
  );
}

export default ProductRow;
