import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const OrderContext = createContext();

function OrderProvider({ children }) {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================================
  // FETCH ORDERS
  // =========================================

  useEffect(() => {
    async function fetchOrderData() {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setOrderList(data ?? []);
      } catch (error) {
        console.error("Fetch orders error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderData();
  }, []);

  // =========================================
  // UPDATE ORDER STATUS
  // =========================================

  async function updateOrderStatus(id, newStatus) {
    setError(null);

    try {
      const { data, error } = await supabase
        .from("orders")
        .update({
          status: newStatus,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setOrderList((prev) =>
        prev.map((order) => (order.id === id ? data : order)),
      );

      return data;
    } catch (error) {
      console.error("Update order status error:", error);
      setError(error.message);

      throw error;
    }
  }

  // =========================================
  // updateOrderPaymentStatus
  // =========================================
  async function updateOrderPaymentStatus(id, newPaymentStatus) {
    setError(null);
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({
          payment_status: newPaymentStatus,
        })
        .eq("id", id)
        .select()
        .single();

      setOrderList((prev) =>
        prev.map((order) => (order.id === id ? data : order)),
      );

      if (error) {
        throw error;
      }
      console.log("data", data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  // =========================================
  // PROVIDER
  // =========================================

  return (
    <OrderContext.Provider
      value={{
        orderList,
        loading,
        error,
        updateOrderStatus,
        updateOrderPaymentStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}

export default OrderProvider;
