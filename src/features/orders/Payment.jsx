import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { useCart } from "../../context/CartContext";
import { toast } from "sonner";
async function getOrder(orderId) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Please login first.");
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function processPayment(orderId) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Please login first.");
  }

  // بررسی اینکه سفارش متعلق به کاربر فعلی باشد
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, user_id, payment_status, status")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderError) {
    throw orderError;
  }

  if (order.payment_status === "paid") {
    throw new Error("This order has already been paid.");
  }

  // Mock payment
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const { data, error } = await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      status: "processing",
    })
    .eq("id", orderId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { clearCart } = useCart();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payment-order", id],
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
  });

  const paymentMutation = useMutation({
    mutationFn: () => processPayment(id),

    onSuccess: async () => {
      clearCart();

      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["order-details", id],
      });

      toast.success("Payment successful!");

      navigate("/orders");
    },

    onError: (error) => {
      console.error("PAYMENT ERROR:", error);

      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">Loading payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-red-700">
          Failed to load order
        </h2>

        <p className="text-sm text-red-600">{error.message}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-gray-500">Order not found.</p>
      </div>
    );
  }

  if (order.payment_status === "paid") {
    return (
      <div className="mx-auto max-w-lg rounded-xl border bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-green-600">
          Payment Already Completed
        </h1>

        <p className="mt-3 text-gray-600">This order has already been paid.</p>

        <button
          onClick={() => navigate("/orders")}
          className="mt-6 rounded-lg bg-black px-5 py-3 text-white"
        >
          View My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment</h1>

        <p className="mt-1 text-sm text-gray-500">
          Complete your order payment.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

        <div className="mt-5 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID</span>

            <span className="max-w-[220px] break-all text-sm font-medium">
              {order.id}
            </span>
          </div>

          <div className="flex justify-between border-t pt-3">
            <span className="text-gray-500">Total</span>

            <span className="text-lg font-bold">
              {Number(order.total_price).toLocaleString()} تومان
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Payment Status</span>

            <span className="font-medium text-yellow-600">
              {order.payment_status}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Payment Method</h2>

        <div className="mt-4 rounded-lg border bg-gray-50 p-4">
          <p className="font-medium">Online Payment</p>

          <p className="mt-1 text-sm text-gray-500">
            This is a demo payment for this project.
          </p>
        </div>

        <button
          onClick={() => paymentMutation.mutate()}
          disabled={paymentMutation.isPending}
          className="mt-6 w-full rounded-lg bg-black px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {paymentMutation.isPending
            ? "Processing Payment..."
            : `Pay ${Number(order.total_price).toLocaleString()} تومان`}
        </button>
      </div>
    </div>
  );
}

export default Payment;
