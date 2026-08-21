import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrders } from "../../../context/OrderContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function OrderTable({ orders }) {
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [updatingPaymentOrderId, setUpdatingPaymentOrderId] = useState(null);

  const { updateOrderStatus, updateOrderPaymentStatus } = useOrders();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  function handleStatusChange(id, newStatus) {
    setUpdatingOrderId(id);

    mutationStatus.mutate({
      id,
      newStatus,
    });
  }

  function handlePaymentStatusChange(id, newPaymentStatus) {
    setUpdatingPaymentOrderId(id);

    mutationPayment.mutate({
      id,
      newPaymentStatus,
    });
  }

  function handleViewDetails(id) {
    navigate(`/admin/orders/${id}`);
  }

  const mutationStatus = useMutation({
    mutationFn: ({ id, newStatus }) => {
      return updateOrderStatus(id, newStatus);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      toast.success(`Order status changed to ${variables.newStatus}.`);
    },

    onError: (error) => {
      console.error("Failed to update order:", error);

      toast.error(error?.message || "Failed to update order status.");
    },

    onSettled: () => {
      setUpdatingOrderId(null);
    },
  });

  const mutationPayment = useMutation({
    mutationFn: ({ id, newPaymentStatus }) => {
      return updateOrderPaymentStatus(id, newPaymentStatus);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      toast.success(`Payment status changed to ${variables.newPaymentStatus}.`);
    },

    onError: (error) => {
      console.error("Failed to update payment status:", error);

      toast.error(error?.message || "Failed to update payment status.");
    },

    onSettled: () => {
      setUpdatingPaymentOrderId(null);
    },
  });

  return (
    <div className="lumora-admin-orders-table-wrapper">
      <div className="lumora-admin-orders-table-header">
        <div>
          <span className="lumora-admin-orders-eyebrow">ORDER MANAGEMENT</span>

          <h2>Orders</h2>

          <p>Manage customer orders, payment status and delivery progress.</p>
        </div>

        <div className="lumora-admin-orders-count">
          {orders?.length || 0}{" "}
          {(orders?.length || 0) === 1 ? "Order" : "Orders"}
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="lumora-admin-orders-empty">
          <div className="lumora-admin-orders-empty-icon">♡</div>

          <h3>No orders found</h3>

          <p>There are currently no orders to display.</p>
        </div>
      ) : (
        <div className="lumora-admin-orders-scroll">
          <table className="lumora-admin-orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Order Status</th>
                <th>Payment</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const isUpdatingStatus =
                  mutationStatus.isPending && updatingOrderId === order.id;

                const isUpdatingPayment =
                  mutationPayment.isPending &&
                  updatingPaymentOrderId === order.id;

                return (
                  <tr key={order.id}>
                    {/* ORDER ID */}
                    <td>
                      <div className="lumora-order-id-cell">
                        <span className="lumora-order-icon">#</span>

                        <div>
                          <strong>{String(order.id).slice(0, 8)}</strong>

                          <small>{order.id}</small>
                        </div>
                      </div>
                    </td>

                    {/* USER ID */}
                    <td>
                      <div className="lumora-customer-cell">
                        <span className="lumora-customer-avatar">U</span>

                        <div>
                          <span>Customer</span>

                          <small>{order.user_id}</small>
                        </div>
                      </div>
                    </td>

                    {/* TOTAL */}
                    <td>
                      <div className="lumora-order-price">
                        {Number(order.total_price).toLocaleString()}
                        <span> تومان</span>
                      </div>
                    </td>

                    {/* ORDER STATUS */}
                    <td>
                      <div className="lumora-select-wrapper">
                        <select
                          className={`lumora-order-select lumora-status-select-${String(
                            order.status || "pending",
                          ).toLowerCase()}`}
                          disabled={isUpdatingStatus}
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>

                          <option value="processing">Processing</option>

                          <option value="shipped">Shipped</option>

                          <option value="delivered">Delivered</option>

                          <option value="cancelled">Cancelled</option>
                        </select>

                        {isUpdatingStatus && (
                          <span className="lumora-select-loading">
                            <span />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* PAYMENT STATUS */}
                    <td>
                      <div className="lumora-select-wrapper">
                        <select
                          className={`lumora-order-select lumora-payment-select-${String(
                            order.payment_status || "pending",
                          ).toLowerCase()}`}
                          disabled={isUpdatingPayment}
                          value={order.payment_status}
                          onChange={(e) =>
                            handlePaymentStatusChange(order.id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>

                          <option value="paid">Paid</option>

                          <option value="failed">Failed</option>
                        </select>

                        {isUpdatingPayment && (
                          <span className="lumora-select-loading">
                            <span />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* CREATED */}
                    <td>
                      <div className="lumora-created-cell">
                        <strong>
                          {new Date(order.created_at).toLocaleDateString()}
                        </strong>

                        <span>
                          {new Date(order.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>

                    {/* ACTION */}
                    <td>
                      <button
                        type="button"
                        className="lumora-view-order-button"
                        onClick={() => handleViewDetails(order.id)}
                      >
                        View Details
                        <span aria-hidden="true">→</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .lumora-admin-orders-table-wrapper {
          width: 100%;
          background: #FFFFFF;
          border: 1px solid #F0DDE0;
          border-radius: 20px;
          overflow: hidden;
          color: #30272A;
          box-shadow: 0 8px 30px rgba(48, 39, 42, 0.04);
        }

        .lumora-admin-orders-table-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          padding: 26px 28px 24px;
          border-bottom: 1px solid #F0DDE0;
        }

        .lumora-admin-orders-eyebrow {
          display: block;
          margin-bottom: 7px;
          color: #D85C70;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.11em;
        }

        .lumora-admin-orders-table-header h2 {
          margin: 0;
          color: #30272A;
          font-size: 24px;
          line-height: 1.3;
          font-weight: 700;
        }

        .lumora-admin-orders-table-header p {
          margin: 7px 0 0;
          color: #776B6D;
          font-size: 13px;
          line-height: 1.6;
        }

        .lumora-admin-orders-count {
          flex-shrink: 0;
          padding: 9px 14px;
          border: 1px solid #F0DDE0;
          border-radius: 999px;
          background: #FFF9F7;
          color: #D85C70;
          font-size: 13px;
          font-weight: 600;
        }

        .lumora-admin-orders-scroll {
          width: 100%;
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: #F5C6CC transparent;
        }

        .lumora-admin-orders-table {
          width: 100%;
          min-width: 1100px;
          border-collapse: collapse;
          text-align: left;
        }

        .lumora-admin-orders-table thead {
          background: #FFF9F7;
        }

        .lumora-admin-orders-table th {
          padding: 15px 18px;
          border-bottom: 1px solid #F0DDE0;
          color: #776B6D;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .lumora-admin-orders-table td {
          padding: 17px 18px;
          border-bottom: 1px solid #F0DDE0;
          vertical-align: middle;
        }

        .lumora-admin-orders-table tbody tr {
          background: #FFFFFF;
          transition: background 0.18s ease;
        }

        .lumora-admin-orders-table tbody tr:hover {
          background: #FFFBFA;
        }

        .lumora-admin-orders-table tbody tr:last-child td {
          border-bottom: 0;
        }

        /* ORDER ID */

        .lumora-order-id-cell {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 145px;
        }

        .lumora-order-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 10px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 14px;
          font-weight: 700;
        }

        .lumora-order-id-cell div {
          min-width: 0;
        }

        .lumora-order-id-cell strong {
          display: block;
          color: #30272A;
          font-size: 13px;
          font-weight: 700;
        }

        .lumora-order-id-cell small {
          display: block;
          max-width: 115px;
          margin-top: 3px;
          overflow: hidden;
          color: #9A8F91;
          font-size: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* CUSTOMER */

        .lumora-customer-cell {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 150px;
        }

        .lumora-customer-avatar {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: #F5C6CC;
          color: #B83F55;
          font-size: 12px;
          font-weight: 700;
        }

        .lumora-customer-cell div {
          min-width: 0;
        }

        .lumora-customer-cell span {
          display: block;
          color: #30272A;
          font-size: 12px;
          font-weight: 600;
        }

        .lumora-customer-cell small {
          display: block;
          max-width: 120px;
          margin-top: 3px;
          overflow: hidden;
          color: #9A8F91;
          font-size: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* PRICE */

        .lumora-order-price {
          color: #30272A;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }

        .lumora-order-price span {
          color: #776B6D;
          font-size: 11px;
          font-weight: 500;
        }

        /* SELECT */

        .lumora-select-wrapper {
          position: relative;
          width: 130px;
        }

        .lumora-order-select {
          width: 100%;
          height: 38px;
          padding: 0 30px 0 11px;
          border: 1px solid #F0DDE0;
          border-radius: 10px;
          outline: none;
          background: #FFFFFF;
          color: #30272A;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          appearance: auto;
          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            background 0.18s ease;
        }

        .lumora-order-select:hover:not(:disabled) {
          border-color: #F5C6CC;
        }

        .lumora-order-select:focus {
          border-color: #D85C70;
          box-shadow: 0 0 0 3px rgba(216, 92, 112, 0.12);
        }

        .lumora-order-select:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .lumora-status-select-pending,
        .lumora-payment-select-pending {
          background: #FFF9F7;
          color: #776B6D;
        }

        .lumora-status-select-processing {
          background: #FFF8E9;
          color: #A67A25;
        }

        .lumora-status-select-shipped {
          background: #F3F0FF;
          color: #7565A8;
        }

        .lumora-status-select-delivered,
        .lumora-payment-select-paid {
          background: #EEF7F0;
          color: #6FA27C;
        }

        .lumora-status-select-cancelled,
        .lumora-payment-select-failed {
          background: #FFF1F1;
          color: #D85C5C;
        }

        .lumora-select-loading {
          position: absolute;
          top: 50%;
          right: 9px;
          width: 13px;
          height: 13px;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .lumora-select-loading span {
          display: block;
          width: 13px;
          height: 13px;
          border: 2px solid #F5C6CC;
          border-top-color: #D85C70;
          border-radius: 50%;
          animation: lumoraOrderSpin 0.7s linear infinite;
        }

        @keyframes lumoraOrderSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* CREATED */

        .lumora-created-cell strong {
          display: block;
          color: #30272A;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .lumora-created-cell span {
          display: block;
          margin-top: 3px;
          color: #9A8F91;
          font-size: 11px;
        }

        /* ACTION */

        .lumora-view-order-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 37px;
          padding: 0 13px;
          border: 1px solid #F0DDE0;
          border-radius: 10px;
          background: #FFFFFF;
          color: #D85C70;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition:
            background 0.18s ease,
            border-color 0.18s ease,
            color 0.18s ease,
            transform 0.18s ease;
        }

        .lumora-view-order-button span {
          font-size: 16px;
          line-height: 1;
          transition: transform 0.18s ease;
        }

        .lumora-view-order-button:hover {
          border-color: #D85C70;
          background: #D85C70;
          color: #FFFFFF;
          transform: translateY(-1px);
        }

        .lumora-view-order-button:hover span {
          transform: translateX(3px);
        }

        .lumora-view-order-button:focus-visible {
          outline: 3px solid #F5C6CC;
          outline-offset: 2px;
        }

        /* EMPTY */

        .lumora-admin-orders-empty {
          min-height: 360px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          text-align: center;
        }

        .lumora-admin-orders-empty-icon {
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          margin-bottom: 17px;
          border-radius: 50%;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 28px;
        }

        .lumora-admin-orders-empty h3 {
          margin: 0 0 7px;
          color: #30272A;
          font-size: 20px;
          font-weight: 700;
        }

        .lumora-admin-orders-empty p {
          margin: 0;
          color: #776B6D;
          font-size: 13px;
        }

        @media (max-width: 700px) {
          .lumora-admin-orders-table-header {
            align-items: flex-start;
            flex-direction: column;
            padding: 22px 20px;
          }

          .lumora-admin-orders-count {
            align-self: flex-start;
          }

          .lumora-admin-orders-table-wrapper {
            border-radius: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lumora-order-select,
          .lumora-view-order-button,
          .lumora-view-order-button span,
          .lumora-admin-orders-table tbody tr {
            transition: none;
          }

          .lumora-select-loading span {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default OrderTable;
