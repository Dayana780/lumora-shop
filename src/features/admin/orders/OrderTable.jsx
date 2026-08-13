function OrderTable({ orders }) {
  console.log("ORDERS:", orders);
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
            <td>{order.status}</td>
            <td>{order.payment_status}</td>
            <td>{new Date(order.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrderTable;
