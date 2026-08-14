import { useOrders } from "../../../context/OrderContext";

function OrderTable({ orders }) {
  const { updateOrderStatus, updateOrderPaymentStatus } = useOrders();

  async function handleStatusChange(id, newStatus) {
    try {
      const data = await updateOrderStatus(id, newStatus);

      console.log("Updated order:", data);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  }
  async function handlePaymentStatusChange(id, newPaymentStatus) {
    try {
      const data = await updateOrderPaymentStatus(id, newPaymentStatus);
      console.log("Updated payorder:", data);
    } catch (error) {
      console.error("Failed to update payorder status:", error);
    }
  }
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
                value={order.payment_status}
                onChange={(e) =>
                  handlePaymentStatusChange(order.id, e.target.value)
                }
              >
                <option value="pending">Pending</option>
                <option value="paid">paid</option>
                <option value="failed">failed</option>
              </select>
            </td>

            <td>{new Date(order.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrderTable;
