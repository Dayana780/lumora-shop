import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

async function getOrderDetails(orderId) {
  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Please login first.");
  }

  // Get order + address
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      `
      *,
      addresses (
        id,
        full_name,
        phone,
        province,
        city,
        postal_code,
        address
      )
    `,
    )
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderError) {
    throw orderError;
  }

  // Get order items + products
  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select(
      `
      id,
      quantity,
      price,
      product_id,
      products (
        id,
        title,
        price
      )
    `,
    )
    .eq("order_id", orderId);

  if (itemsError) {
    throw itemsError;
  }

  return {
    order,
    orderItems: orderItems ?? [],
  };
}

function CustomerOrderDetails() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["order-details", id],
    queryFn: () => getOrderDetails(id),
  });

  const order = data?.order;
  const orderItems = data?.orderItems ?? [];

  // Loading
  if (isLoading) {
    return (
      <main className="lumora-order-details-page">
        <div className="lumora-order-details-container">
          <div className="lumora-details-skeleton-header">
            <div className="lumora-skeleton lumora-skeleton-title" />
            <div className="lumora-skeleton lumora-skeleton-subtitle" />
          </div>

          <div className="lumora-details-layout">
            <section className="lumora-details-main-card">
              <div className="lumora-skeleton lumora-skeleton-block" />
              <div className="lumora-skeleton lumora-skeleton-block" />
              <div className="lumora-skeleton lumora-skeleton-block" />
            </section>

            <aside className="lumora-details-side-card">
              <div className="lumora-skeleton lumora-skeleton-block" />
              <div className="lumora-skeleton lumora-skeleton-block" />
            </aside>
          </div>
        </div>

        <style>{`
          .lumora-order-details-page {
            min-height: 100vh;
            background: #FFF9F7;
            color: #30272A;
            padding: 48px 20px 80px;
          }

          .lumora-order-details-container {
            width: min(1120px, 100%);
            margin: 0 auto;
          }

          .lumora-details-skeleton-header {
            margin-bottom: 30px;
          }

          .lumora-skeleton {
            background: #F0DDE0;
            border-radius: 10px;
            animation: lumoraDetailsPulse 1.5s ease-in-out infinite;
          }

          .lumora-skeleton-title {
            width: 270px;
            height: 38px;
          }

          .lumora-skeleton-subtitle {
            width: 360px;
            max-width: 80%;
            height: 18px;
            margin-top: 13px;
          }

          .lumora-details-layout {
            display: grid;
            grid-template-columns: minmax(0, 1.7fr) minmax(300px, 0.8fr);
            gap: 22px;
          }

          .lumora-details-main-card,
          .lumora-details-side-card {
            background: #FFFFFF;
            border: 1px solid #F0DDE0;
            border-radius: 20px;
            padding: 26px;
          }

          .lumora-skeleton-block {
            height: 72px;
            margin-bottom: 18px;
          }

          .lumora-skeleton-block:last-child {
            margin-bottom: 0;
          }

          @keyframes lumoraDetailsPulse {
            0%, 100% {
              opacity: 0.45;
            }
            50% {
              opacity: 0.9;
            }
          }

          @media (max-width: 800px) {
            .lumora-details-layout {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 600px) {
            .lumora-order-details-page {
              padding: 32px 16px 60px;
            }

            .lumora-details-main-card,
            .lumora-details-side-card {
              padding: 20px;
              border-radius: 16px;
            }
          }
        `}</style>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <main className="lumora-order-details-page">
        <div className="lumora-order-details-container">
          <section className="lumora-details-state">
            <div className="lumora-details-state-icon">!</div>

            <h1>Unable to load order</h1>

            <p>
              {error.message ||
                "Something went wrong while loading this order."}
            </p>

            <Link to="/orders" className="lumora-back-orders-button">
              Back to My Orders
            </Link>
          </section>
        </div>

        <style>{`
          .lumora-order-details-page {
            min-height: 100vh;
            background: #FFF9F7;
            color: #30272A;
            padding: 48px 20px 80px;
          }

          .lumora-order-details-container {
            width: min(1120px, 100%);
            margin: 0 auto;
          }

          .lumora-details-state {
            min-height: 420px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: #FFFFFF;
            border: 1px solid #F0DDE0;
            border-radius: 24px;
            padding: 48px 24px;
          }

          .lumora-details-state-icon {
            width: 58px;
            height: 58px;
            display: grid;
            place-items: center;
            border-radius: 50%;
            background: #FFF1F1;
            color: #D85C5C;
            font-size: 27px;
            font-weight: 700;
            margin-bottom: 20px;
          }

          .lumora-details-state h1 {
            margin: 0 0 10px;
            font-size: 27px;
            color: #30272A;
          }

          .lumora-details-state p {
            max-width: 520px;
            margin: 0 0 25px;
            color: #776B6D;
            line-height: 1.8;
          }

          .lumora-back-orders-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 44px;
            padding: 0 22px;
            border-radius: 11px;
            background: #D85C70;
            color: #FFFFFF;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            transition: background 0.2s ease, transform 0.2s ease;
          }

          .lumora-back-orders-button:hover {
            background: #B83F55;
            transform: translateY(-1px);
          }

          .lumora-back-orders-button:focus-visible {
            outline: 3px solid #F5C6CC;
            outline-offset: 3px;
          }

          @media (max-width: 600px) {
            .lumora-order-details-page {
              padding: 32px 16px 60px;
            }

            .lumora-details-state {
              min-height: 360px;
              padding: 32px 18px;
              border-radius: 18px;
            }

            .lumora-details-state h1 {
              font-size: 23px;
            }
          }
        `}</style>
      </main>
    );
  }

  // Order not found
  if (!order) {
    return (
      <main className="lumora-order-details-page">
        <div className="lumora-order-details-container">
          <section className="lumora-details-state">
            <div className="lumora-details-state-icon lumora-not-found-icon">
              ?
            </div>

            <h1>Order not found</h1>

            <p>We couldn't find the order you're looking for.</p>

            <Link to="/orders" className="lumora-back-orders-button">
              Back to My Orders
            </Link>
          </section>
        </div>

        <style>{`
          .lumora-order-details-page {
            min-height: 100vh;
            background: #FFF9F7;
            color: #30272A;
            padding: 48px 20px 80px;
          }

          .lumora-order-details-container {
            width: min(1120px, 100%);
            margin: 0 auto;
          }

          .lumora-details-state {
            min-height: 420px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: #FFFFFF;
            border: 1px solid #F0DDE0;
            border-radius: 24px;
            padding: 48px 24px;
          }

          .lumora-details-state-icon {
            width: 58px;
            height: 58px;
            display: grid;
            place-items: center;
            border-radius: 50%;
            background: #FFF0EC;
            color: #D85C70;
            font-size: 27px;
            font-weight: 700;
            margin-bottom: 20px;
          }

          .lumora-details-state h1 {
            margin: 0 0 10px;
            font-size: 27px;
            color: #30272A;
          }

          .lumora-details-state p {
            margin: 0 0 25px;
            color: #776B6D;
            line-height: 1.8;
          }

          .lumora-back-orders-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 44px;
            padding: 0 22px;
            border-radius: 11px;
            background: #D85C70;
            color: #FFFFFF;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            transition: background 0.2s ease, transform 0.2s ease;
          }

          .lumora-back-orders-button:hover {
            background: #B83F55;
            transform: translateY(-1px);
          }

          .lumora-back-orders-button:focus-visible {
            outline: 3px solid #F5C6CC;
            outline-offset: 3px;
          }

          @media (max-width: 600px) {
            .lumora-order-details-page {
              padding: 32px 16px 60px;
            }

            .lumora-details-state {
              min-height: 360px;
              padding: 32px 18px;
            }
          }
        `}</style>
      </main>
    );
  }

  const address = order.addresses;

  return (
    <main className="lumora-order-details-page">
      <div className="lumora-order-details-container">
        {/* PAGE HEADER */}
        <header className="lumora-order-details-header">
          <div>
            <Link to="/orders" className="lumora-back-link">
              <span aria-hidden="true">←</span>
              Back to My Orders
            </Link>

            <span className="lumora-details-eyebrow">ORDER DETAILS</span>

            <h1>Order Details</h1>

            <p>Review your order information, products and shipping address.</p>
          </div>

          <div
            className={`lumora-order-status lumora-status-${String(
              order.status || "pending",
            ).toLowerCase()}`}
          >
            {order.status || "Pending"}
          </div>
        </header>

        {/* ORDER SUMMARY */}
        <section className="lumora-order-summary-card">
          <div className="lumora-summary-item">
            <span>Order ID</span>
            <strong>{order.id}</strong>
          </div>

          <div className="lumora-summary-item">
            <span>Payment Status</span>
            <strong>{order.payment_status || "Pending"}</strong>
          </div>

          <div className="lumora-summary-item">
            <span>Created At</span>
            <strong>{new Date(order.created_at).toLocaleString()}</strong>
          </div>

          <div className="lumora-summary-total">
            <span>Total</span>
            <strong>{Number(order.total_price).toLocaleString()} تومان</strong>
          </div>
        </section>

        <div className="lumora-details-grid">
          {/* PRODUCTS */}
          <section className="lumora-details-card">
            <div className="lumora-card-heading">
              <div>
                <span className="lumora-card-eyebrow">ORDER ITEMS</span>

                <h2>Products</h2>
              </div>

              <span className="lumora-items-count">
                {orderItems.length} {orderItems.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            {orderItems.length === 0 ? (
              <div className="lumora-products-empty">
                <span>♡</span>
                <p>No products found.</p>
              </div>
            ) : (
              <div className="lumora-products-list">
                {orderItems.map((item) => {
                  const subtotal = Number(item.price) * Number(item.quantity);

                  return (
                    <article
                      className="lumora-product-order-item"
                      key={item.id}
                    >
                      <div className="lumora-product-placeholder">
                        {item.products?.title?.charAt(0)?.toUpperCase() || "P"}
                      </div>

                      <div className="lumora-product-order-info">
                        <h3>{item.products?.title || "Product"}</h3>

                        <div className="lumora-product-meta">
                          <span>
                            Quantity: <strong>{item.quantity}</strong>
                          </span>

                          <span>
                            Price:{" "}
                            <strong>
                              {Number(item.price).toLocaleString()} تومان
                            </strong>
                          </span>
                        </div>
                      </div>

                      <div className="lumora-product-subtotal">
                        <span>Subtotal</span>

                        <strong>{subtotal.toLocaleString()} تومان</strong>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* SHIPPING ADDRESS */}
          <aside className="lumora-details-card lumora-address-card">
            <div className="lumora-card-heading">
              <div>
                <span className="lumora-card-eyebrow">DELIVERY</span>

                <h2>Shipping Address</h2>
              </div>
            </div>

            {address ? (
              <div className="lumora-address-content">
                <div className="lumora-address-person">
                  <div className="lumora-address-avatar">
                    {address.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <strong>{address.full_name}</strong>
                    <span>{address.phone}</span>
                  </div>
                </div>

                <div className="lumora-address-divider" />

                <div className="lumora-address-row">
                  <span>Province</span>
                  <strong>{address.province || "-"}</strong>
                </div>

                <div className="lumora-address-row">
                  <span>City</span>
                  <strong>{address.city || "-"}</strong>
                </div>

                <div className="lumora-address-row lumora-address-long">
                  <span>Address</span>
                  <strong>{address.address || "-"}</strong>
                </div>

                <div className="lumora-address-row">
                  <span>Postal Code</span>
                  <strong>{address.postal_code || "-"}</strong>
                </div>
              </div>
            ) : (
              <div className="lumora-products-empty">
                <span>⌂</span>
                <p>No shipping address found.</p>
              </div>
            )}
          </aside>
        </div>
      </div>

      <style>{`
        .lumora-order-details-page {
          min-height: 100vh;
          background: #FFF9F7;
          color: #30272A;
          padding: 48px 20px 80px;
        }

        .lumora-order-details-container {
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .lumora-order-details-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 26px;
        }

        .lumora-back-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 18px;
          color: #776B6D;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .lumora-back-link:hover {
          color: #D85C70;
        }

        .lumora-back-link span {
          font-size: 18px;
        }

        .lumora-details-eyebrow,
        .lumora-card-eyebrow {
          display: block;
          margin-bottom: 7px;
          color: #D85C70;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.11em;
        }

        .lumora-order-details-header h1 {
          margin: 0;
          color: #30272A;
          font-size: clamp(30px, 4vw, 42px);
          line-height: 1.2;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .lumora-order-details-header p {
          margin: 10px 0 0;
          color: #776B6D;
          font-size: 15px;
          line-height: 1.7;
        }

        .lumora-order-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 36px;
          padding: 0 14px;
          border-radius: 999px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 13px;
          font-weight: 600;
          text-transform: capitalize;
          white-space: nowrap;
        }

        .lumora-status-completed,
        .lumora-status-delivered,
        .lumora-status-paid {
          background: #EEF7F0;
          color: #6FA27C;
        }

        .lumora-status-cancelled,
        .lumora-status-canceled,
        .lumora-status-failed {
          background: #FFF1F1;
          color: #D85C5C;
        }

        .lumora-order-summary-card {
          display: grid;
          grid-template-columns: repeat(3, 1fr) 1.2fr;
          gap: 0;
          overflow: hidden;
          margin-bottom: 22px;
          background: #FFFFFF;
          border: 1px solid #F0DDE0;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(48, 39, 42, 0.04);
        }

        .lumora-summary-item,
        .lumora-summary-total {
          min-width: 0;
          padding: 22px 24px;
        }

        .lumora-summary-item {
          border-right: 1px solid #F0DDE0;
        }

        .lumora-summary-item span,
        .lumora-summary-total span {
          display: block;
          margin-bottom: 8px;
          color: #776B6D;
          font-size: 12px;
        }

        .lumora-summary-item strong {
          display: block;
          color: #30272A;
          font-size: 14px;
          font-weight: 600;
          word-break: break-word;
        }

        .lumora-summary-total {
          background: #FFF0EC;
        }

        .lumora-summary-total strong {
          display: block;
          color: #D85C70;
          font-size: 20px;
          font-weight: 700;
        }

        .lumora-details-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.65fr) minmax(310px, 0.85fr);
          gap: 22px;
          align-items: start;
        }

        .lumora-details-card {
          background: #FFFFFF;
          border: 1px solid #F0DDE0;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(48, 39, 42, 0.04);
        }

        .lumora-card-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding: 25px 26px 20px;
        }

        .lumora-card-heading h2 {
          margin: 0;
          color: #30272A;
          font-size: 22px;
          font-weight: 700;
        }

        .lumora-items-count {
          flex-shrink: 0;
          padding: 7px 11px;
          border-radius: 999px;
          background: #FFF9F7;
          color: #776B6D;
          font-size: 12px;
          font-weight: 600;
        }

        .lumora-products-list {
          border-top: 1px solid #F0DDE0;
        }

        .lumora-product-order-item {
          display: grid;
          grid-template-columns: 64px minmax(0, 1fr) auto;
          align-items: center;
          gap: 16px;
          padding: 20px 26px;
          border-bottom: 1px solid #F0DDE0;
        }

        .lumora-product-order-item:last-child {
          border-bottom: 0;
        }

        .lumora-product-placeholder {
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 22px;
          font-weight: 700;
        }

        .lumora-product-order-info {
          min-width: 0;
        }

        .lumora-product-order-info h3 {
          overflow: hidden;
          margin: 0 0 9px;
          color: #30272A;
          font-size: 15px;
          font-weight: 650;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lumora-product-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 18px;
        }

        .lumora-product-meta span {
          color: #776B6D;
          font-size: 12px;
        }

        .lumora-product-meta strong {
          color: #30272A;
          font-weight: 600;
        }

        .lumora-product-subtotal {
          min-width: 130px;
          text-align: right;
        }

        .lumora-product-subtotal span {
          display: block;
          margin-bottom: 5px;
          color: #776B6D;
          font-size: 11px;
        }

        .lumora-product-subtotal strong {
          color: #30272A;
          font-size: 14px;
          font-weight: 700;
        }

        .lumora-products-empty {
          min-height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          border-top: 1px solid #F0DDE0;
          text-align: center;
        }

        .lumora-products-empty span {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
          border-radius: 50%;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 23px;
        }

        .lumora-products-empty p {
          margin: 0;
          color: #776B6D;
          font-size: 14px;
        }

        .lumora-address-card {
          overflow: hidden;
        }

        .lumora-address-content {
          padding: 0 26px 26px;
        }

        .lumora-address-person {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 4px;
        }

        .lumora-address-avatar {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #F5C6CC;
          color: #B83F55;
          font-size: 16px;
          font-weight: 700;
        }

        .lumora-address-person div:last-child {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .lumora-address-person strong {
          color: #30272A;
          font-size: 14px;
        }

        .lumora-address-person span {
          color: #776B6D;
          font-size: 12px;
        }

        .lumora-address-divider {
          height: 1px;
          margin: 20px 0;
          background: #F0DDE0;
        }

        .lumora-address-row {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 10px 0;
        }

        .lumora-address-row span {
          flex-shrink: 0;
          color: #776B6D;
          font-size: 12px;
        }

        .lumora-address-row strong {
          color: #30272A;
          font-size: 13px;
          font-weight: 600;
          text-align: right;
          word-break: break-word;
        }

        .lumora-address-long {
          align-items: flex-start;
        }

        @media (max-width: 900px) {
          .lumora-order-summary-card {
            grid-template-columns: repeat(2, 1fr);
          }

          .lumora-summary-item:nth-child(2) {
            border-right: 0;
          }

          .lumora-summary-item:nth-child(1),
          .lumora-summary-item:nth-child(2) {
            border-bottom: 1px solid #F0DDE0;
          }

          .lumora-summary-total {
            border-top: 0;
          }

          .lumora-details-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .lumora-order-details-page {
            padding: 32px 16px 60px;
          }

          .lumora-order-details-header {
            align-items: flex-start;
            flex-direction: column;
            margin-bottom: 22px;
          }

          .lumora-order-summary-card {
            grid-template-columns: 1fr;
            border-radius: 16px;
          }

          .lumora-summary-item,
          .lumora-summary-total {
            border-right: 0;
            border-bottom: 1px solid #F0DDE0;
          }

          .lumora-summary-total {
            border-bottom: 0;
          }

          .lumora-details-card {
            border-radius: 16px;
          }

          .lumora-card-heading {
            padding: 21px 20px 18px;
          }

          .lumora-product-order-item {
            grid-template-columns: 52px minmax(0, 1fr);
            padding: 18px 20px;
          }

          .lumora-product-placeholder {
            width: 52px;
            height: 52px;
            border-radius: 12px;
          }

          .lumora-product-subtotal {
            grid-column: 2;
            min-width: 0;
            text-align: left;
          }

          .lumora-product-order-info h3 {
            white-space: normal;
          }

          .lumora-address-content {
            padding: 0 20px 22px;
          }
        }

        @media (max-width: 420px) {
          .lumora-order-details-page {
            padding: 26px 12px 48px;
          }

          .lumora-order-details-header h1 {
            font-size: 30px;
          }

          .lumora-card-heading h2 {
            font-size: 19px;
          }

          .lumora-address-row {
            flex-direction: column;
            gap: 4px;
          }

          .lumora-address-row strong {
            text-align: left;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lumora-back-link,
          .lumora-back-orders-button {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}

export default CustomerOrderDetails;
