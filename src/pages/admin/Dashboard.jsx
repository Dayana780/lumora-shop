import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingCart, Users, Wallet } from "lucide-react";
import { supabase } from "../../lib/supabase";
import Loading from "../../components/ui/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage";

async function getDashboardData() {
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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  if (profile?.role !== "admin") {
    throw new Error("You are not authorized to access the dashboard.");
  }

  const { count: productsCount, error: productsError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  if (productsError) {
    throw productsError;
  }

  const { count: ordersCount, error: ordersError } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  if (ordersError) {
    throw ordersError;
  }

  const { count: usersCount, error: usersError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if (usersError) {
    throw usersError;
  }

  const { data: paidOrders, error: revenueError } = await supabase
    .from("orders")
    .select("total_price")
    .eq("payment_status", "paid");

  if (revenueError) {
    throw revenueError;
  }

  const revenue =
    paidOrders?.reduce(
      (total, order) => total + Number(order.total_price),
      0,
    ) ?? 0;

  const { data: recentOrders, error: recentOrdersError } = await supabase
    .from("orders")
    .select(
      `
      id,
      total_price,
      status,
      payment_status,
      created_at
    `,
    )
    .order("created_at", { ascending: false })
    .limit(5);

  if (recentOrdersError) {
    throw recentOrdersError;
  }

  return {
    productsCount: productsCount ?? 0,
    ordersCount: ordersCount ?? 0,
    usersCount: usersCount ?? 0,
    revenue,
    recentOrders: recentOrders ?? [],
  };
}

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  processing: "bg-sky-50 text-sky-700 border-sky-100",
  shipped: "bg-violet-50 text-violet-700 border-violet-100",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

const statusLabels = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getDashboardData,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  const stats = [
    {
      label: "Products",
      value: data.productsCount,
      icon: Package,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
    },
    {
      label: "Orders",
      value: data.ordersCount,
      icon: ShoppingCart,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-500",
    },
    {
      label: "Users",
      value: data.usersCount,
      icon: Users,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-500",
    },
    {
      label: "Revenue",
      value: `${data.revenue.toLocaleString()} تومان`,
      icon: Wallet,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Dashboard</h1>

        <p className="mt-1 text-sm text-stone-500">
          Overview of your store's performance.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <Icon size={21} className={stat.iconColor} />
                </div>

                <span className="text-xs font-medium text-stone-400">
                  Overview
                </span>
              </div>

              <p className="mt-5 text-sm text-stone-500">{stat.label}</p>

              <p className="mt-1 text-2xl font-bold text-stone-800">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* RECENT ORDERS */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        {/* SECTION HEADER */}
        <div className="border-b border-stone-200 px-5 py-5 sm:px-6">
          <h2 className="text-lg font-semibold text-stone-800">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-stone-500">Latest customer orders</p>
        </div>

        {/* ORDERS */}
        {data.recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <ShoppingCart size={38} className="mx-auto text-stone-300" />

            <p className="mt-3 text-sm font-medium text-stone-600">
              No orders yet.
            </p>

            <p className="mt-1 text-xs text-stone-400">
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {data.recentOrders.map((order) => {
              const status = order.status?.toLowerCase();

              return (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 px-5 py-5 transition hover:bg-stone-50 sm:px-6 md:flex-row md:items-center md:justify-between"
                >
                  {/* ORDER INFO */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100">
                        <ShoppingCart size={17} className="text-stone-500" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-stone-800">
                          Order #{order.id.slice(0, 8)}
                        </p>

                        <p className="mt-1 text-xs text-stone-400">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ORDER PRICE + STATUS */}
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-stone-800">
                        {Number(order.total_price).toLocaleString()} تومان
                      </p>

                      <p className="mt-1 text-xs text-stone-400">
                        Payment: {order.payment_status || "Unknown"}
                      </p>
                    </div>

                    <span
                      className={`inline-flex min-w-[90px] items-center justify-center rounded-full border px-3 py-1.5 text-xs font-medium ${
                        statusStyles[status] ||
                        "border-stone-200 bg-stone-50 text-stone-500"
                      }`}
                    >
                      {statusLabels[status] || status || "Unknown"}
                    </span>
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

export default Dashboard;
