import { useMutation } from "@tanstack/react-query";
import { useOrders } from "../../../context/OrderContext";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },

    onError: (error) => {
      console.error("Failed to update order:", error);
    },

    onSettled: () => {
      setUpdatingOrderId(null);
    },
  });

  const mutationPayment = useMutation({
    mutationFn: ({ id, newPaymentStatus }) => {
      return updateOrderPaymentStatus(id, newPaymentStatus);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },

    onError: (error) => {
      console.error("Failed to update payment status:", error);
    },

    onSettled: () => {
      setUpdatingPaymentOrderId(null);
    },
  });

  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th>Order ID</th>
          <th>User ID</th>
          <th>Total Price</th>
          <th>Status</th>
          <th>Payment Status</th>
          <th>Created At</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-t">
            <td>{order.id}</td>

            <td>{order.user_id}</td>

            <td>${order.total_price}</td>

            <td>
              <select
                disabled={
                  mutationStatus.isPending && updatingOrderId === order.id
                }
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>

            <td>
              <select
                disabled={
                  mutationPayment.isPending &&
                  updatingPaymentOrderId === order.id
                }
                value={order.payment_status}
                onChange={(e) =>
                  handlePaymentStatusChange(order.id, e.target.value)
                }
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </td>

            <td>{new Date(order.created_at).toLocaleString()}</td>

            <td>
              <button onClick={() => handleViewDetails(order.id)}>
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrderTable;
