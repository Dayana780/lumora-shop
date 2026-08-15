import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

function OrderDetails() {
  const { id } = useParams();

  async function getOrderDetails(id) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderDetails(id),
  });

  if (isLoading) {
    return <p>Loading order...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!data) {
    return <p>Order not found.</p>;
  }

  return (
    <div>
      <h1>Order Details</h1>

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
          <tr className="border-t">
            <td>{data.id}</td>
            <td>{data.user_id}</td>
            <td>${data.total_price}</td>
            <td>{data.status}</td>
            <td>{data.payment_status}</td>
            <td>{new Date(data.created_at).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default OrderDetails;
