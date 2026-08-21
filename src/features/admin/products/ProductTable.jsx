import ProductRow from "./ProductRow";

function ProductTable({ products, onDelete, onEdit }) {
  return (
    <div className="lumora-product-table-wrapper">
      <table className="lumora-product-table">
        <thead>
          <tr>
            <th>Product</th>
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
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>

      <style>{`
        /* SEARCH */

        .lumora-product-search {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .lumora-product-search input {
          width: 100%;
          height: 42px;
          box-sizing: border-box;
          padding: 0 42px 0 40px;
          border: 1px solid #F0DDE0;
          border-radius: 10px;
          outline: none;
          background: #FFFFFF;
          color: #30272A;
          font-family: inherit;
          font-size: 12px;
          transition: border-color .18s ease,
                      box-shadow .18s ease;
        }

        .lumora-product-search input::placeholder {
          color: #B1A6A8;
        }

        .lumora-product-search input:hover {
          border-color: #F5C6CC;
        }

        .lumora-product-search input:focus {
          border-color: #D85C70;
          box-shadow: 0 0 0 3px rgba(216, 92, 112, .08);
        }

        .lumora-product-search-icon {
          position: absolute;
          left: 14px;
          z-index: 1;
          color: #D85C70;
          font-size: 21px;
          line-height: 1;
          pointer-events: none;
        }

        .lumora-product-search-clear {
          position: absolute;
          right: 10px;
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 7px;
          background: #FFF0EC;
          color: #D85C70;
          font-family: inherit;
          font-size: 17px;
          line-height: 1;
          cursor: pointer;
        }

        .lumora-product-search-clear:hover {
          background: #FCE0E2;
        }


        /* TABLE */

        .lumora-product-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .lumora-product-table {
          width: 100%;
          min-width: 850px;
          border-collapse: collapse;
          font-family: inherit;
        }

        .lumora-product-table thead {
          background: #FFF9F7;
        }

        .lumora-product-table th {
          height: 48px;
          padding: 0 17px;
          border-bottom: 1px solid #F0DDE0;
          color: #9A8F91;
          font-size: 10px;
          font-weight: 600;
          text-align: left;
          white-space: nowrap;
        }

        .lumora-product-table td {
          height: 68px;
          padding: 8px 17px;
          border-bottom: 1px solid #F6EAEB;
          color: #5F5355;
          font-size: 11px;
          vertical-align: middle;
          white-space: nowrap;
        }

        .lumora-product-table tbody tr:last-child td {
          border-bottom: 0;
        }


        /* ROW */

        .lumora-product-row {
          background: #FFFFFF;
          transition: background .18s ease;
        }

        .lumora-product-row:hover {
          background: #FFFBFA;
        }


        /* PRODUCT */

        .lumora-product-name {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .lumora-product-placeholder {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: grid;
          place-items: center;
          border: 1px solid #F5D9DC;
          border-radius: 10px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 13px;
          font-weight: 700;
        }

        .lumora-product-name > div:last-child {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .lumora-product-title {
          max-width: 220px;
          overflow: hidden;
          color: #403538;
          font-size: 11px;
          font-weight: 600;
          text-overflow: ellipsis;
        }

        .lumora-product-id {
          color: #B1A6A8;
          font-size: 9px;
        }


        /* PRICE */

        .lumora-product-price {
          color: #403538;
          font-size: 11px;
          font-weight: 700;
        }

        .lumora-product-currency {
          margin-left: 4px;
          color: #B1A6A8;
          font-size: 9px;
        }


        /* CATEGORY */

        .lumora-product-category {
          display: inline-flex;
          align-items: center;
          min-height: 25px;
          padding: 0 9px;
          border: 1px solid #F0DDE0;
          border-radius: 7px;
          background: #FFF9F7;
          color: #776B6D;
          font-size: 9px;
        }


        /* STOCK */

        .lumora-stock-badge {
          display: inline-flex;
          align-items: center;
          min-height: 25px;
          padding: 0 9px;
          border-radius: 7px;
          background: #EEF8F2;
          color: #4D9669;
          font-size: 9px;
          font-weight: 600;
        }

        .lumora-stock-badge.warning {
          background: #FFF6E7;
          color: #C58A32;
        }

        .lumora-stock-badge.danger {
          background: #FFF0EC;
          color: #D85C70;
        }


        /* ACTIONS */

        .lumora-product-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .lumora-product-actions button {
          height: 30px;
          padding: 0 10px;
          border-radius: 7px;
          font-family: inherit;
          font-size: 9px;
          font-weight: 600;
          cursor: pointer;
          transition: all .18s ease;
        }

        .lumora-product-edit {
          border: 1px solid #F0DDE0;
          background: #FFFFFF;
          color: #D85C70;
        }

        .lumora-product-edit:hover {
          border-color: #F5C6CC;
          background: #FFF0EC;
          transform: translateY(-1px);
        }

        .lumora-product-delete {
          border: 1px solid #F3D9DD;
          background: #FFF8F8;
          color: #C85A68;
        }

        .lumora-product-delete:hover {
          border-color: #E9AEB6;
          background: #FCE8EA;
          transform: translateY(-1px);
        }


        /* MOBILE */

        @media (max-width: 600px) {
          .lumora-product-table th {
            padding: 0 12px;
          }

          .lumora-product-table td {
            padding: 8px 12px;
          }

          .lumora-product-title {
            max-width: 150px;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductTable;
