import ProductForm from "./ProductForm";

function AddProductModal({
  onClose,
  updateProduct,
  addProduct,
  selectedProduct,
}) {
  const isEditing = Boolean(selectedProduct);

  return (
    <div
      className="lumora-product-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="lumora-product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lumora-product-modal-title"
      >
        {/* MODAL HEADER */}
        <div className="lumora-product-modal-header">
          <div>
            <span className="lumora-product-modal-eyebrow">
              PRODUCT MANAGEMENT
            </span>

            <h2 id="lumora-product-modal-title">
              {isEditing ? "Edit Product" : "Add Product"}
            </h2>

            <p>
              {isEditing
                ? "Update the product information below."
                : "Add a new product to your store."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="lumora-product-modal-close"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <div className="lumora-product-modal-body">
          <ProductForm
            updateProduct={updateProduct}
            selectedProduct={selectedProduct}
            onClose={onClose}
            addProduct={addProduct}
          />
        </div>
      </div>

      <style>{`
        .lumora-product-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(48, 39, 42, 0.48);
          backdrop-filter: blur(4px);
          overflow-y: auto;
          animation: lumoraProductModalOverlay .18s ease;
        }

        .lumora-product-modal {
          width: min(540px, 100%);
          max-height: calc(100vh - 48px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid #F0DDE0;
          border-radius: 20px;
          box-shadow: 0 24px 70px rgba(48, 39, 42, 0.18);
          animation: lumoraProductModalEnter .22s ease;
        }

        /* HEADER */

        .lumora-product-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          padding: 24px 26px 20px;
          border-bottom: 1px solid #F0DDE0;
          background: #FFF9F7;
        }

        .lumora-product-modal-eyebrow {
          display: block;
          margin-bottom: 6px;
          color: #D85C70;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .11em;
        }

        .lumora-product-modal-header h2 {
          margin: 0;
          color: #30272A;
          font-size: 22px;
          line-height: 1.3;
          font-weight: 700;
        }

        .lumora-product-modal-header p {
          margin: 6px 0 0;
          color: #776B6D;
          font-size: 12px;
          line-height: 1.6;
        }

        /* CLOSE */

        .lumora-product-modal-close {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          padding: 0;
          border: 1px solid #F0DDE0;
          border-radius: 10px;
          background: #FFFFFF;
          color: #776B6D;
          font-family: inherit;
          font-size: 23px;
          font-weight: 300;
          line-height: 1;
          cursor: pointer;
          transition:
            background .18s ease,
            border-color .18s ease,
            color .18s ease,
            transform .18s ease;
        }

        .lumora-product-modal-close:hover {
          border-color: #F5C6CC;
          background: #FFF0EC;
          color: #D85C70;
          transform: rotate(90deg);
        }

        .lumora-product-modal-close:focus-visible {
          outline: 3px solid #F5C6CC;
          outline-offset: 2px;
        }

        /* BODY */

        .lumora-product-modal-body {
          padding: 24px 26px 26px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #F5C6CC transparent;
        }

        /* ANIMATIONS */

        @keyframes lumoraProductModalOverlay {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes lumoraProductModalEnter {
          from {
            opacity: 0;
            transform: translateY(12px) scale(.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 600px) {
          .lumora-product-modal-overlay {
            align-items: flex-start;
            padding: 12px;
          }

          .lumora-product-modal {
            max-height: calc(100vh - 24px);
            border-radius: 17px;
          }

          .lumora-product-modal-header {
            padding: 20px;
          }

          .lumora-product-modal-body {
            padding: 20px;
          }

          .lumora-product-modal-header h2 {
            font-size: 19px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lumora-product-modal-overlay,
          .lumora-product-modal {
            animation: none;
          }

          .lumora-product-modal-close {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

export default AddProductModal;
