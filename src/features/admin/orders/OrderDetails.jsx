import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

function OrderDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  // Get order + customer + address

  async function getOrderDetails(id) {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (orderError) {
      throw orderError;
    }

    let profile = null;

    if (order.user_id) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(
          `
          id,
          full_name,
          phone,
          avatar_url,
          role
        `,
        )
        .eq("id", order.user_id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      profile = profileData;
    }

    let address = null;

    if (order.address_id) {
      const { data: addressData, error: addressError } = await supabase
        .from("addresses")
        .select(
          `
          id,
          user_id,
          full_name,
          phone,
          province,
          city,
          postal_code,
          address
        `,
        )
        .eq("id", order.address_id)
        .maybeSingle();

      if (addressError) {
        throw addressError;
      }

      address = addressData;
    }

    return {
      order,
      profile,
      address,
    };
  }

  // Get order items

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
      .eq("order_id", id)
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  // Order details query

  const {
    data: orderDetails,
    isLoading: orderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ["order-details", id],
    queryFn: () => getOrderDetails(id),
    enabled: Boolean(id),
  });

  // Order items query

  const {
    data: orderItems = [],
    isLoading: itemsLoading,
    error: itemsError,
  } = useQuery({
    queryKey: ["order-items", id],
    queryFn: () => getOrderItems(id),
    enabled: Boolean(id),
  });

  // Update order status

  const updateOrderMutation = useMutation({
    mutationFn: async ({ status, payment_status }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({
          status,
          payment_status,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["order-details", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });

  // Handlers

  function handleStatusChange(e) {
    const newStatus = e.target.value;

    updateOrderMutation.mutate({
      status: newStatus,
      payment_status: orderDetails?.order?.payment_status ?? "pending",
    });
  }

  function handlePaymentStatusChange(e) {
    const newPaymentStatus = e.target.value;

    updateOrderMutation.mutate({
      status: orderDetails?.order?.status ?? "pending",
      payment_status: newPaymentStatus,
    });
  }

  // Loading

  if (orderLoading || itemsLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  // Error

  if (orderError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-red-700">
          Failed to load order
        </h2>

        <p className="text-sm text-red-600">{orderError.message}</p>
      </div>
    );
  }

  if (itemsError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-red-700">
          Failed to load order items
        </h2>

        <p className="text-sm text-red-600">{itemsError.message}</p>
      </div>
    );
  }

  // Order not found

  if (!orderDetails?.order) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-gray-500">Order not found.</p>
      </div>
    );
  }

  const { order, profile, address } = orderDetails;

  // Calculate total

  const itemsTotal = orderItems.reduce((total, item) => {
    return total + Number(item.price) * Number(item.quantity);
  }, 0);

  // Status helpers

  function getOrderStatusClass(status) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function getPaymentStatusClass(status) {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "refunded":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  // Render

  return (
    <div className="space-y-8 p-6">
      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage order information.
        </p>
      </div>

      {/* ORDER INFORMATION */}

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Order Information
            </h2>

            <p className="mt-1 break-all text-sm text-gray-500">
              Order ID: {order.id}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getOrderStatusClass(
                order.status,
              )}`}
            >
              {order.status || "Unknown"}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getPaymentStatusClass(
                order.payment_status,
              )}`}
            >
              Payment: {order.payment_status || "Unknown"}
            </span>
          </div>
        </div>

        {/* STATUS CONTROLS */}

        <div className="mb-6 grid gap-4 border-b pb-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Order Status
            </label>

            <select
              value={order.status || "pending"}
              onChange={handleStatusChange}
              disabled={updateOrderMutation.isPending}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
            >
              <option value="pending">Pending</option>

              <option value="processing">Processing</option>

              <option value="shipped">Shipped</option>

              <option value="delivered">Delivered</option>

              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Payment Status
            </label>

            <select
              value={order.payment_status || "pending"}
              onChange={handlePaymentStatusChange}
              disabled={updateOrderMutation.isPending}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
            >
              <option value="pending">Pending</option>

              <option value="paid">Paid</option>

              <option value="failed">Failed</option>

              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* BASIC INFO */}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>

            <p className="mt-1 break-all text-sm font-medium text-gray-900">
              {order.id}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Created At</p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {order.created_at
                ? new Date(order.created_at).toLocaleString()
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Tracking Code</p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {order.tracking_code || "Not assigned"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Total</p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              {Number(order.total_price).toLocaleString()} تومان
            </p>
          </div>
        </div>

        {updateOrderMutation.isPending && (
          <p className="mt-4 text-sm text-gray-500">Updating order...</p>
        )}

        {updateOrderMutation.isError && (
          <p className="mt-4 text-sm text-red-600">
            Failed to update order: {updateOrderMutation.error.message}
          </p>
        )}
      </section>

      {/* CUSTOMER + ADDRESS */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* CUSTOMER */}

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">Customer</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>

              <p className="mt-1 font-medium text-gray-900">
                {profile?.full_name || address?.full_name || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>

              <p className="mt-1 font-medium text-gray-900">
                {profile?.phone || address?.phone || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">User ID</p>

              <p className="mt-1 break-all text-xs text-gray-500">
                {order.user_id}
              </p>
            </div>

            {profile?.role && (
              <div>
                <p className="text-sm text-gray-500">Role</p>

                <p className="mt-1 font-medium text-gray-900">{profile.role}</p>
              </div>
            )}
          </div>
        </section>

        {/* ADDRESS */}

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Shipping Address
          </h2>

          {address ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Recipient</p>

                <p className="mt-1 font-medium text-gray-900">
                  {address.full_name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone</p>

                <p className="mt-1 font-medium text-gray-900">
                  {address.phone}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Location</p>

                <p className="mt-1 font-medium text-gray-900">
                  {[address.province, address.city]
                    .filter(Boolean)
                    .join("، ") || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Address</p>

                <p className="mt-1 leading-6 text-gray-900">
                  {address.address}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Postal Code</p>

                <p className="mt-1 font-medium text-gray-900">
                  {address.postal_code || "-"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No shipping address found for this order.
            </p>
          )}
        </section>
      </div>

      {/* ORDER ITEMS */}

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>

          <p className="mt-1 text-sm text-gray-500">
            {orderItems.length} product
            {orderItems.length !== 1 ? "s" : ""}
          </p>
        </div>

        {orderItems.length === 0 ? (
          <div className="rounded-lg bg-gray-50 p-8 text-center">
            <p className="text-gray-500">No products found for this order.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orderItems.map((item) => {
              const product = item.products;

              const image = product?.product_images?.[0]?.image_url;

              const itemTotal = Number(item.price) * Number(item.quantity);

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    {image ? (
                      <img
                        src={image}
                        alt={product?.title || "Product"}
                        className="h-20 w-20 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                        No Image
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {product?.title || "Unknown Product"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Unit Price: {Number(item.price).toLocaleString()} تومان
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-sm text-gray-500">Item Total</p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {itemTotal.toLocaleString()} تومان
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TOTALS */}

        <div className="mt-8 border-t pt-6">
          <div className="ml-auto max-w-sm space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Items Subtotal</span>

              <span className="font-medium">
                {itemsTotal.toLocaleString()} تومان
              </span>
            </div>

            <div className="flex justify-between border-t pt-3 text-lg font-bold">
              <span>Total</span>

              <span>{Number(order.total_price).toLocaleString()} تومان</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrderDetails;
