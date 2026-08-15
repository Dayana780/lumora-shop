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
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-semibold">No orders found</p>
        <p className="text-gray-500">There are no orders to display.</p>
      </div>
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
