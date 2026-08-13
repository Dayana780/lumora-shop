import { useOrders } from "../../../context/OrderContext";
import OrderTable from "./OrderTable";

function OrderPage() {
  const { orderList, loading, error } = useOrders();

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

  return <OrderTable orders={orderList} />;
}

export default OrderPage;
