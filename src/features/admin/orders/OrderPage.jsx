import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import OrderTable from "./OrderTable";
import { supabase } from "../../../lib/supabase";

function OrderPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  async function getOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  if (isLoading) {
    return (
      <main className="lumora-admin-orders-page">
        <div className="lumora-admin-orders-container">
          <div className="lumora-orders-page-header">
            <div>
              <div className="lumora-orders-skeleton lumora-skeleton-title" />
              <div className="lumora-orders-skeleton lumora-skeleton-text" />
            </div>
          </div>

          <div className="lumora-orders-loading-card">
            <div className="lumora-orders-spinner" />
            <h3>Loading orders...</h3>
            <p>Please wait while we fetch the latest orders.</p>
          </div>
        </div>

        <style>{`
          .lumora-admin-orders-page {
            min-height: 100vh;
            background: #FFF9F7;
            padding: 40px 20px 70px;
            color: #30272A;
          }

          .lumora-admin-orders-container {
            width: min(1250px, 100%);
            margin: 0 auto;
          }

          .lumora-orders-page-header {
            margin-bottom: 25px;
          }

          .lumora-orders-skeleton {
            background: #F0DDE0;
            border-radius: 9px;
            animation: lumoraOrdersPulse 1.5s ease-in-out infinite;
          }

          .lumora-skeleton-title {
            width: 220px;
            height: 38px;
          }

          .lumora-skeleton-text {
            width: 350px;
            max-width: 80%;
            height: 17px;
            margin-top: 12px;
          }

          .lumora-orders-loading-card {
            min-height: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #FFFFFF;
            border: 1px solid #F0DDE0;
            border-radius: 20px;
            text-align: center;
          }

          .lumora-orders-spinner {
            width: 36px;
            height: 36px;
            margin-bottom: 18px;
            border: 3px solid #F5C6CC;
            border-top-color: #D85C70;
            border-radius: 50%;
            animation: lumoraOrdersSpin .7s linear infinite;
          }

          .lumora-orders-loading-card h3 {
            margin: 0 0 7px;
            font-size: 18px;
          }

          .lumora-orders-loading-card p {
            margin: 0;
            color: #776B6D;
            font-size: 13px;
          }

          @keyframes lumoraOrdersSpin {
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes lumoraOrdersPulse {
            0%, 100% {
              opacity: .45;
            }
            50% {
              opacity: .9;
            }
          }
        `}</style>
      </main>
    );
  }

  if (error) {
    return (
      <main className="lumora-admin-orders-page">
        <div className="lumora-admin-orders-container">
          <section className="lumora-orders-error-card">
            <div className="lumora-orders-error-icon">!</div>

            <h2>Unable to load orders</h2>

            <p>
              {error.message || "Something went wrong while loading orders."}
            </p>
          </section>
        </div>

        <style>{`
          .lumora-admin-orders-page {
            min-height: 100vh;
            background: #FFF9F7;
            padding: 40px 20px 70px;
            color: #30272A;
          }

          .lumora-admin-orders-container {
            width: min(1250px, 100%);
            margin: 0 auto;
          }

          .lumora-orders-error-card {
            min-height: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 24px;
            background: #FFFFFF;
            border: 1px solid #F0DDE0;
            border-radius: 20px;
            text-align: center;
          }

          .lumora-orders-error-icon {
            width: 58px;
            height: 58px;
            display: grid;
            place-items: center;
            margin-bottom: 18px;
            border-radius: 50%;
            background: #FFF1F1;
            color: #D85C5C;
            font-size: 25px;
            font-weight: 700;
          }

          .lumora-orders-error-card h2 {
            margin: 0 0 9px;
            font-size: 23px;
          }

          .lumora-orders-error-card p {
            max-width: 550px;
            margin: 0;
            color: #776B6D;
            font-size: 14px;
            line-height: 1.7;
          }
        `}</style>
      </main>
    );
  }

  const statusFilterOrder = orders.filter((order) => {
    if (statusFilter === "all") {
      return true;
    }

    return order.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  const paymentFilterOrder = statusFilterOrder.filter((order) => {
    if (paymentFilter === "all") {
      return true;
    }

    return order.payment_status?.toLowerCase() === paymentFilter.toLowerCase();
  });

  return (
    <main className="lumora-admin-orders-page">
      <div className="lumora-admin-orders-container">
        {/* PAGE HEADER */}
        <header className="lumora-orders-page-header">
          <div>
            <span className="lumora-orders-page-eyebrow">ADMINISTRATION</span>

            <h1>Orders</h1>

            <p>Manage customer orders, payments and delivery status.</p>
          </div>

          <div className="lumora-orders-total-badge">
            <strong>{orders.length}</strong>
            <span>Total Orders</span>
          </div>
        </header>

        {/* FILTER BAR */}
        <section className="lumora-orders-filter-card">
          <div className="lumora-orders-filter-heading">
            <div className="lumora-filter-icon">≡</div>

            <div>
              <h2>Filter Orders</h2>
              <p>Use the filters to find specific orders.</p>
            </div>
          </div>

          <div className="lumora-orders-filters">
            {/* STATUS FILTER */}
            <div className="lumora-orders-filter-group">
              <label htmlFor="lumora-order-status-filter">Order Status</label>

              <div className="lumora-filter-select-wrapper">
                <select
                  id="lumora-order-status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* PAYMENT FILTER */}
            <div className="lumora-orders-filter-group">
              <label htmlFor="lumora-payment-filter">Payment Status</label>

              <div className="lumora-filter-select-wrapper">
                <select
                  id="lumora-payment-filter"
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <option value="all">All Payments</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* RESULT COUNT */}
            <div className="lumora-filter-results">
              <span>Showing</span>

              <strong>{paymentFilterOrder.length}</strong>

              <span>
                {paymentFilterOrder.length === 1 ? "order" : "orders"}
              </span>
            </div>

            {/* RESET */}
            {(statusFilter !== "all" || paymentFilter !== "all") && (
              <button
                type="button"
                className="lumora-reset-filter-button"
                onClick={() => {
                  setStatusFilter("all");
                  setPaymentFilter("all");
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </section>

        {/* EMPTY FILTER RESULT */}
        {paymentFilterOrder.length === 0 ? (
          <section className="lumora-filter-empty-card">
            <div className="lumora-filter-empty-icon">♡</div>

            <h2>No matching orders</h2>

            <p>
              No orders match the selected filters. Try changing or resetting
              the filters.
            </p>

            <button
              type="button"
              className="lumora-empty-reset-button"
              onClick={() => {
                setStatusFilter("all");
                setPaymentFilter("all");
              }}
            >
              Show All Orders
            </button>
          </section>
        ) : (
          <OrderTable orders={paymentFilterOrder} />
        )}
      </div>

      <style>{`
        .lumora-admin-orders-page {
          min-height: 100vh;
          background: #FFF9F7;
          padding: 40px 20px 70px;
          color: #30272A;
        }

        .lumora-admin-orders-container {
          width: min(1250px, 100%);
          margin: 0 auto;
        }

        /* HEADER */

        .lumora-orders-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 25px;
        }

        .lumora-orders-page-eyebrow {
          display: block;
          margin-bottom: 7px;
          color: #D85C70;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
        }

        .lumora-orders-page-header h1 {
          margin: 0;
          color: #30272A;
          font-size: clamp(30px, 4vw, 40px);
          line-height: 1.2;
          font-weight: 700;
          letter-spacing: -.02em;
        }

        .lumora-orders-page-header p {
          margin: 9px 0 0;
          color: #776B6D;
          font-size: 14px;
          line-height: 1.6;
        }

        .lumora-orders-total-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border: 1px solid #F0DDE0;
          border-radius: 12px;
          background: #FFFFFF;
          box-shadow: 0 5px 20px rgba(48, 39, 42, .03);
        }

        .lumora-orders-total-badge strong {
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          border-radius: 9px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 14px;
        }

        .lumora-orders-total-badge span {
          color: #776B6D;
          font-size: 12px;
          font-weight: 600;
        }

        /* FILTER CARD */

        .lumora-orders-filter-card {
          margin-bottom: 22px;
          padding: 22px 24px;
          background: #FFFFFF;
          border: 1px solid #F0DDE0;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(48, 39, 42, .04);
        }

        .lumora-orders-filter-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .lumora-filter-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 22px;
          font-weight: 700;
          transform: rotate(90deg);
        }

        .lumora-orders-filter-heading h2 {
          margin: 0;
          color: #30272A;
          font-size: 17px;
          font-weight: 700;
        }

        .lumora-orders-filter-heading p {
          margin: 3px 0 0;
          color: #9A8F91;
          font-size: 12px;
        }

        .lumora-orders-filters {
          display: flex;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 15px;
        }

        .lumora-orders-filter-group {
          min-width: 190px;
        }

        .lumora-orders-filter-group label {
          display: block;
          margin-bottom: 7px;
          color: #776B6D;
          font-size: 11px;
          font-weight: 700;
        }

        .lumora-filter-select-wrapper {
          position: relative;
        }

        .lumora-filter-select-wrapper select {
          width: 100%;
          min-width: 190px;
          height: 42px;
          padding: 0 13px;
          border: 1px solid #F0DDE0;
          border-radius: 10px;
          outline: none;
          background: #FFF9F7;
          color: #30272A;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition:
            border-color .18s ease,
            box-shadow .18s ease;
        }

        .lumora-filter-select-wrapper select:hover {
          border-color: #F5C6CC;
        }

        .lumora-filter-select-wrapper select:focus {
          border-color: #D85C70;
          box-shadow: 0 0 0 3px rgba(216, 92, 112, .1);
        }

        /* RESULT */

        .lumora-filter-results {
          min-height: 42px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 14px;
          border-radius: 10px;
          background: #FFF9F7;
          color: #776B6D;
          font-size: 12px;
        }

        .lumora-filter-results strong {
          color: #D85C70;
          font-size: 15px;
        }

        /* RESET */

        .lumora-reset-filter-button {
          height: 42px;
          padding: 0 16px;
          border: 1px solid #F0DDE0;
          border-radius: 10px;
          background: #FFFFFF;
          color: #776B6D;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition:
            background .18s ease,
            border-color .18s ease,
            color .18s ease;
        }

        .lumora-reset-filter-button:hover {
          border-color: #D85C70;
          background: #FFF0EC;
          color: #D85C70;
        }

        /* EMPTY */

        .lumora-filter-empty-card {
          min-height: 360px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 25px;
          background: #FFFFFF;
          border: 1px solid #F0DDE0;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 8px 30px rgba(48, 39, 42, .04);
        }

        .lumora-filter-empty-icon {
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          margin-bottom: 17px;
          border-radius: 50%;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 27px;
        }

        .lumora-filter-empty-card h2 {
          margin: 0 0 8px;
          color: #30272A;
          font-size: 20px;
        }

        .lumora-filter-empty-card p {
          max-width: 480px;
          margin: 0 0 20px;
          color: #776B6D;
          font-size: 13px;
          line-height: 1.7;
        }

        .lumora-empty-reset-button {
          min-height: 42px;
          padding: 0 18px;
          border: 0;
          border-radius: 10px;
          background: #D85C70;
          color: #FFFFFF;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition:
            background .18s ease,
            transform .18s ease;
        }

        .lumora-empty-reset-button:hover {
          background: #B83F55;
          transform: translateY(-1px);
        }

        .lumora-empty-reset-button:focus-visible,
        .lumora-reset-filter-button:focus-visible {
          outline: 3px solid #F5C6CC;
          outline-offset: 2px;
        }

        @media (max-width: 800px) {
          .lumora-admin-orders-page {
            padding: 30px 16px 55px;
          }

          .lumora-orders-page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .lumora-orders-filters {
            align-items: stretch;
            flex-direction: column;
          }

          .lumora-orders-filter-group,
          .lumora-filter-select-wrapper select {
            width: 100%;
            min-width: 0;
          }

          .lumora-filter-results,
          .lumora-reset-filter-button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 500px) {
          .lumora-admin-orders-page {
            padding: 25px 12px 45px;
          }

          .lumora-orders-filter-card {
            padding: 20px 16px;
            border-radius: 16px;
          }

          .lumora-orders-page-header h1 {
            font-size: 30px;
          }

          .lumora-orders-total-badge {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}

export default OrderPage;
