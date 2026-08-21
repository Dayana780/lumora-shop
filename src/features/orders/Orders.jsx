import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

async function getOrders() {
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

  // Get user orders
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return orders ?? [];
}

function Orders() {
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getOrders,
  });

  // Loading
  if (isLoading) {
    return (
      <main className="lumora-orders-page">
        <div className="lumora-orders-container">
          <div className="lumora-orders-header">
            <div className="lumora-orders-title-skeleton" />
            <div className="lumora-orders-subtitle-skeleton" />
          </div>

          <div className="lumora-orders-list">
            {[1, 2, 3].map((item) => (
              <div
                className="lumora-order-card lumora-order-skeleton"
                key={item}
              >
                <div className="lumora-skeleton-line lumora-skeleton-small" />
                <div className="lumora-skeleton-line lumora-skeleton-medium" />
                <div className="lumora-skeleton-line lumora-skeleton-large" />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .lumora-orders-page {
            min-height: 100vh;
            background: #FFF9F7;
            color: #30272A;
            padding: 48px 20px 80px;
          }

          .lumora-orders-container {
            width: min(1120px, 100%);
            margin: 0 auto;
          }

          .lumora-orders-header {
            margin-bottom: 32px;
          }

          .lumora-orders-title-skeleton {
            width: 220px;
            height: 36px;
            border-radius: 10px;
            background: #F5C6CC;
            opacity: 0.55;
            animation: lumoraPulse 1.5s ease-in-out infinite;
          }

          .lumora-orders-subtitle-skeleton {
            width: 340px;
            max-width: 80%;
            height: 18px;
            margin-top: 14px;
            border-radius: 8px;
            background: #F0DDE0;
            animation: lumoraPulse 1.5s ease-in-out infinite;
          }

          .lumora-orders-list {
            display: grid;
            gap: 18px;
          }

          .lumora-order-card {
            background: #FFFFFF;
            border: 1px solid #F0DDE0;
            border-radius: 18px;
            padding: 24px;
          }

          .lumora-order-skeleton {
            min-height: 150px;
          }

          .lumora-skeleton-line {
            height: 16px;
            border-radius: 8px;
            background: #F0DDE0;
            margin-bottom: 16px;
            animation: lumoraPulse 1.5s ease-in-out infinite;
          }

          .lumora-skeleton-small {
            width: 25%;
          }

          .lumora-skeleton-medium {
            width: 50%;
          }

          .lumora-skeleton-large {
            width: 75%;
          }

          @keyframes lumoraPulse {
            0%, 100% {
              opacity: 0.45;
            }
            50% {
              opacity: 0.9;
            }
          }

          @media (max-width: 600px) {
            .lumora-orders-page {
              padding: 32px 16px 60px;
            }

            .lumora-order-card {
              padding: 18px;
            }
          }
        `}</style>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <main className="lumora-orders-page">
        <div className="lumora-orders-container">
          <section className="lumora-orders-state lumora-orders-error">
            <div className="lumora-state-icon">!</div>

            <h1>Unable to load orders</h1>

            <p>
              {error.message ||
                "Something went wrong while loading your orders."}
            </p>

            <button
              type="button"
              className="lumora-retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </section>
        </div>

        <style>{`
          .lumora-orders-page {
            min-height: 100vh;
            background: #FFF9F7;
            color: #30272A;
            padding: 48px 20px 80px;
          }

          .lumora-orders-container {
            width: min(1120px, 100%);
            margin: 0 auto;
          }

          .lumora-orders-state {
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

          .lumora-state-icon {
            width: 58px;
            height: 58px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: #FFF0EC;
            color: #D85C5C;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 20px;
          }

          .lumora-orders-state h1 {
            margin: 0 0 10px;
            font-size: 26px;
            font-weight: 700;
            color: #30272A;
          }

          .lumora-orders-state p {
            max-width: 520px;
            margin: 0 0 24px;
            color: #776B6D;
            line-height: 1.7;
          }

          .lumora-retry-button {
            border: 0;
            border-radius: 12px;
            padding: 12px 24px;
            background: #D85C70;
            color: #FFFFFF;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s ease, transform 0.2s ease;
          }

          .lumora-retry-button:hover {
            background: #B83F55;
            transform: translateY(-1px);
          }

          .lumora-retry-button:focus-visible {
            outline: 3px solid #F5C6CC;
            outline-offset: 3px;
          }

          @media (max-width: 600px) {
            .lumora-orders-page {
              padding: 32px 16px 60px;
            }

            .lumora-orders-state {
              min-height: 360px;
              padding: 32px 18px;
              border-radius: 18px;
            }

            .lumora-orders-state h1 {
              font-size: 22px;
            }
          }
        `}</style>
      </main>
    );
  }

  // Empty
  if (orders.length === 0) {
    return (
      <main className="lumora-orders-page">
        <div className="lumora-orders-container">
          <section className="lumora-orders-state lumora-orders-empty">
            <div className="lumora-empty-icon">♡</div>

            <h1>No orders yet</h1>

            <p>
              You haven't placed an order yet. Explore our products and find
              something you love.
            </p>

            <Link to="/shop" className="lumora-shop-button">
              Start Shopping
            </Link>
          </section>
        </div>

        <style>{`
          .lumora-orders-page {
            min-height: 100vh;
            background: #FFF9F7;
            color: #30272A;
            padding: 48px 20px 80px;
          }

          .lumora-orders-container {
            width: min(1120px, 100%);
            margin: 0 auto;
          }

          .lumora-orders-state {
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

          .lumora-empty-icon {
            width: 72px;
            height: 72px;
            display: grid;
            place-items: center;
            border-radius: 50%;
            background: #FFF0EC;
            color: #D85C70;
            font-size: 32px;
            margin-bottom: 20px;
          }

          .lumora-orders-state h1 {
            margin: 0 0 10px;
            color: #30272A;
            font-size: 28px;
          }

          .lumora-orders-state p {
            max-width: 520px;
            margin: 0 0 26px;
            color: #776B6D;
            line-height: 1.8;
          }

          .lumora-shop-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 46px;
            padding: 0 24px;
            border-radius: 12px;
            background: #D85C70;
            color: #FFFFFF;
            text-decoration: none;
            font-size: 15px;
            font-weight: 600;
            transition: background 0.2s ease, transform 0.2s ease;
          }

          .lumora-shop-button:hover {
            background: #B83F55;
            transform: translateY(-1px);
          }

          .lumora-shop-button:focus-visible {
            outline: 3px solid #F5C6CC;
            outline-offset: 3px;
          }

          @media (max-width: 600px) {
            .lumora-orders-page {
              padding: 32px 16px 60px;
            }

            .lumora-orders-state {
              min-height: 360px;
              padding: 32px 18px;
              border-radius: 18px;
            }

            .lumora-orders-state h1 {
              font-size: 23px;
            }
          }
        `}</style>
      </main>
    );
  }

  // Orders
  return (
    <main className="lumora-orders-page">
      <div className="lumora-orders-container">
        <header className="lumora-orders-header">
          <div>
            <span className="lumora-orders-eyebrow">ACCOUNT</span>
            <h1>My Orders</h1>
            <p>Track and manage all your recent orders.</p>
          </div>

          <div className="lumora-orders-count">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </div>
        </header>

        <section className="lumora-orders-list" aria-label="My orders">
          {orders.map((order) => (
            <article className="lumora-order-card" key={order.id}>
              <div className="lumora-order-top">
                <div>
                  <span className="lumora-order-label">ORDER ID</span>
                  <p className="lumora-order-id">{order.id}</p>
                </div>

                <span
                  className={`lumora-order-status lumora-status-${String(
                    order.status || "pending",
                  ).toLowerCase()}`}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              <div className="lumora-order-divider" />

              <div className="lumora-order-info">
                <div className="lumora-order-info-item">
                  <span>Total Price</span>
                  <strong>{Number(order.total_price).toLocaleString()}</strong>
                </div>

                <div className="lumora-order-info-item">
                  <span>Payment</span>
                  <strong>{order.payment_status || "Pending"}</strong>
                </div>

                <div className="lumora-order-info-item">
                  <span>Created At</span>
                  <strong>{new Date(order.created_at).toLocaleString()}</strong>
                </div>
              </div>

              <div className="lumora-order-footer">
                <Link
                  to={`/orders/${order.id}`}
                  className="lumora-order-details-button"
                >
                  View Order Details
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>

      <style>{`
        .lumora-orders-page {
          min-height: 100vh;
          background: #FFF9F7;
          color: #30272A;
          padding: 48px 20px 80px;
        }

        .lumora-orders-container {
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .lumora-orders-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 32px;
        }

        .lumora-orders-eyebrow {
          display: inline-block;
          margin-bottom: 8px;
          color: #D85C70;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .lumora-orders-header h1 {
          margin: 0;
          color: #30272A;
          font-size: clamp(30px, 4vw, 42px);
          line-height: 1.2;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .lumora-orders-header p {
          margin: 10px 0 0;
          color: #776B6D;
          font-size: 15px;
          line-height: 1.7;
        }

        .lumora-orders-count {
          flex-shrink: 0;
          padding: 10px 16px;
          border: 1px solid #F0DDE0;
          border-radius: 999px;
          background: #FFFFFF;
          color: #D85C70;
          font-size: 14px;
          font-weight: 600;
        }

        .lumora-orders-list {
          display: grid;
          gap: 18px;
        }

        .lumora-order-card {
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid #F0DDE0;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(48, 39, 42, 0.04);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .lumora-order-card:hover {
          transform: translateY(-2px);
          border-color: #F5C6CC;
          box-shadow: 0 14px 34px rgba(48, 39, 42, 0.07);
        }

        .lumora-order-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 24px 26px 20px;
        }

        .lumora-order-label {
          display: block;
          margin-bottom: 7px;
          color: #776B6D;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .lumora-order-id {
          margin: 0;
          color: #30272A;
          font-size: 15px;
          font-weight: 600;
          word-break: break-all;
        }

        .lumora-order-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 34px;
          padding: 0 13px;
          border-radius: 999px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 13px;
          font-weight: 600;
          text-transform: capitalize;
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

        .lumora-order-divider {
          height: 1px;
          background: #F0DDE0;
        }

        .lumora-order-info {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          padding: 22px 26px;
          background: #FFF9F7;
        }

        .lumora-order-info-item {
          display: flex;
          flex-direction: column;
          gap: 7px;
          min-width: 0;
        }

        .lumora-order-info-item span {
          color: #776B6D;
          font-size: 13px;
        }

        .lumora-order-info-item strong {
          color: #30272A;
          font-size: 15px;
          font-weight: 600;
          word-break: break-word;
        }

        .lumora-order-footer {
          display: flex;
          justify-content: flex-end;
          padding: 18px 26px;
        }

        .lumora-order-details-button {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          min-height: 42px;
          padding: 0 18px;
          border: 1px solid #D85C70;
          border-radius: 11px;
          background: #FFFFFF;
          color: #D85C70;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .lumora-order-details-button span {
          font-size: 18px;
          line-height: 1;
          transition: transform 0.2s ease;
        }

        .lumora-order-details-button:hover {
          background: #D85C70;
          color: #FFFFFF;
          transform: translateY(-1px);
        }

        .lumora-order-details-button:hover span {
          transform: translateX(3px);
        }

        .lumora-order-details-button:focus-visible {
          outline: 3px solid #F5C6CC;
          outline-offset: 3px;
        }

        @media (max-width: 768px) {
          .lumora-orders-page {
            padding: 36px 16px 60px;
          }

          .lumora-orders-header {
            align-items: flex-start;
            flex-direction: column;
            margin-bottom: 24px;
          }

          .lumora-orders-count {
            align-self: flex-start;
          }

          .lumora-order-top {
            padding: 20px;
          }

          .lumora-order-info {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 20px;
          }

          .lumora-order-footer {
            justify-content: stretch;
            padding: 16px 20px 20px;
          }

          .lumora-order-details-button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .lumora-orders-page {
            padding: 28px 12px 48px;
          }

          .lumora-order-card {
            border-radius: 16px;
          }

          .lumora-order-top {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
          }

          .lumora-order-status {
            align-self: flex-start;
          }

          .lumora-orders-header h1 {
            font-size: 30px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lumora-order-card,
          .lumora-order-details-button,
          .lumora-order-details-button span {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}

export default Orders;
