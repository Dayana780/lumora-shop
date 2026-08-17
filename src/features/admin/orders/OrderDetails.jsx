import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

function OrderDetails() {
  const { id } = useParams();

  // -----------------------------
  // Get order
  // -----------------------------
  async function getOrder(id) {
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

  // -----------------------------
  // Get order items
  // -----------------------------
  async function getOrderItems(id) {
    const { data, error } = await supabase
      .from("order_items")
      .select(
        `
      id,
      order_id,
      product_id,
      quantity,
      price,
      products (
        id,
        title,
        product_images (
          id,
          image_url,
          sort_order
        )
      )
    `,
      )
      .eq("order_id", id);

    if (error) {
      throw error;
    }

    console.log("ORDER ITEMS:", data);

    return data ?? [];
  }
  // -----------------------------
  // Order query
  // -----------------------------
  const {
    data: order,
    isLoading: orderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
  });

  // -----------------------------
  // Order items query
  // -----------------------------
  const {
    data: orderItems = [],
    isLoading: itemsLoading,
    error: itemsError,
  } = useQuery({
    queryKey: ["order-items", id],
    queryFn: () => getOrderItems(id),
  });

  // -----------------------------
  // Loading
  // -----------------------------
  if (orderLoading || itemsLoading) {
    return <p>Loading order...</p>;
  }

  // -----------------------------
  // Error
  // -----------------------------
  if (orderError) {
    return <p>Error loading order: {orderError.message}</p>;
  }

  if (itemsError) {
    return <p>Error loading order items: {itemsError.message}</p>;
  }

  // -----------------------------
  // Order not found
  // -----------------------------
  if (!order) {
    return <p>Order not found.</p>;
  }

  console.log("ORDER:", order);
  console.log("ORDER ITEMS:", orderItems);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      {/* =========================
          Order Information
      ========================= */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Information</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">User ID</th>
              <th className="border p-2">Total Price</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Payment Status</th>
              <th className="border p-2">Created At</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border p-2">{order.id}</td>

              <td className="border p-2">{order.user_id}</td>

              <td className="border p-2">
                {Number(order.total_price).toLocaleString()}
              </td>

              <td className="border p-2">{order.status}</td>

              <td className="border p-2">{order.payment_status}</td>

              <td className="border p-2">
                {new Date(order.created_at).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* =========================
          Order Items
      ========================= */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Order Items</h2>

        {orderItems.length === 0 ? (
          <p>No products found for this order.</p>
        ) : (
          <div className="space-y-4">
            {orderItems.map((item) => {
              const product = item.products;
              const image = product?.product_images?.[0];

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    {image?.image_url ? (
                      <img
                        src={image.image_url}
                        alt={product?.title}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
                        No Image
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold">{product?.title}</h3>

                      <p>Quantity: {item.quantity}</p>

                      <p>Unit Price: ${Number(item.price).toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold">
                      ${(Number(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
