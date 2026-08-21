function AddProductButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="lumora-add-product-button"
    >
      <span className="lumora-add-product-icon">+</span>
      <span>Add Product</span>

      <style>{`
        .lumora-add-product-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 16px;
          border: 0;
          border-radius: 11px;
          background: #D85C70;
          color: #FFFFFF;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(216, 92, 112, 0.16);
          transition:
            background 0.18s ease,
            transform 0.18s ease,
            box-shadow 0.18s ease;
        }

        .lumora-add-product-button:hover {
          background: #B83F55;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(216, 92, 112, 0.22);
        }

        .lumora-add-product-button:active {
          transform: translateY(0);
        }

        .lumora-add-product-button:focus-visible {
          outline: 3px solid #F5C6CC;
          outline-offset: 2px;
        }

        .lumora-add-product-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 19px;
          height: 19px;
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 6px;
          font-size: 16px;
          font-weight: 400;
        }

        @media (max-width: 500px) {
          .lumora-add-product-button {
            min-height: 40px;
            padding: 0 13px;
            font-size: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lumora-add-product-button {
            transition: none;
          }
        }
      `}</style>
    </button>
  );
}

export default AddProductButton;
