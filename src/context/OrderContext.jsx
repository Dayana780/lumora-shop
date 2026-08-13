import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const OrderContext = createContext();

function OrderProvider({ children }) {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <OrderContext.Provider
      value={{
        orderList,
        loading,
        error,
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
