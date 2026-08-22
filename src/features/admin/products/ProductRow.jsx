function ProductRow({ product, onDelete, onEdit }) {
  const price = Number(product.price || 0);

  return (
    <tr className="lumora-product-row">
      {/* PRODUCT */}
      <td className="lumora-product-name-cell">
        <div className="lumora-product-name">
          <div className="lumora-product-placeholder">
            {product.title?.charAt(0)?.toUpperCase() || "P"}
          </div>

          <div>
            <span className="lumora-product-title">{product.title}</span>

            <span className="lumora-product-id">ID: {product.id}</span>
          </div>
        </div>
      </td>

      {/* PRICE */}
      <td>
        <span className="lumora-product-price">{price.toLocaleString()}</span>

        <span className="lumora-product-currency">$</span>
      </td>

      {/* CATEGORY */}
      <td>
        <span className="lumora-product-category">
          {product.categories?.name || "—"}
        </span>
      </td>

      {/* STOCK */}
      <td>
        <span
          className={
            Number(product.stock) <= 0
              ? "lumora-stock-badge danger"
              : Number(product.stock) <= 5
                ? "lumora-stock-badge warning"
                : "lumora-stock-badge"
          }
        >
          {Number(product.stock) <= 0
            ? "Out of stock"
            : `${product.stock} in stock`}
        </span>
      </td>

      {/* ACTIONS */}
      <td>
        <div className="lumora-product-actions">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="lumora-product-edit"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(product.id)}
            className="lumora-product-delete"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ProductRow;
