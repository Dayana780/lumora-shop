import { useState } from "react";
import { useOrders } from "../../../context/OrderContext";
import OrderTable from "./OrderTable";

function OrderPage() {
  const { orderList, loading, error } = useOrders();

  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (orderList.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-semibold">No orders found</p>
        <p className="text-gray-500">There are no orders to display.</p>
      </div>
    );
  }

  const statusFilterOrder = orderList.filter((order) => {
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
    <div>
      <div className="flex gap-3 mb-6">
        <select
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

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="all">All Payments</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <OrderTable orders={paymentFilterOrder} />
    </div>
  );
}

export default OrderPage;
