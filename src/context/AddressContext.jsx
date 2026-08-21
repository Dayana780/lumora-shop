import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

const AddressContext = createContext();

function AddressProvider({ children }) {
  const queryClient = useQueryClient();

  // Get current user

  async function getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    if (!user) {
      throw new Error("User is not authenticated.");
    }

    return user;
  }

  // Fetch addresses

  async function fetchAddresses() {
    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data ?? [];
  }

  const {
    data: addresses = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
  });

  // Add address

  async function addAddress(addressData) {
    const user = await getCurrentUser();

    // اگر این آدرس Default باشد
    // Default قبلی را بردار
    if (addressData.is_default) {
      const { error: resetError } = await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);

      if (resetError) throw resetError;
    }

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        full_name: addressData.full_name,
        phone: addressData.phone,
        province: addressData.province,
        city: addressData.city,
        postal_code: addressData.postal_code,
        address: addressData.address,
        is_default: addressData.is_default ?? false,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  const addAddressMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });

  // Update address

  async function updateAddress({ id, addressData }) {
    const user = await getCurrentUser();

    if (addressData.is_default) {
      const { error: resetError } = await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);

      if (resetError) throw resetError;
    }

    const { data, error } = await supabase
      .from("addresses")
      .update({
        full_name: addressData.full_name,
        phone: addressData.phone,
        province: addressData.province,
        city: addressData.city,
        postal_code: addressData.postal_code,
        address: addressData.address,
        is_default: addressData.is_default ?? false,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  const updateAddressMutation = useMutation({
    mutationFn: updateAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });

  // Delete address

  async function deleteAddress(id) {
    const user = await getCurrentUser();

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
  }

  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });

  // Set default address

  async function setDefaultAddress(id) {
    const user = await getCurrentUser();

    // اول همه را false می‌کنیم
    const { error: resetError } = await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);

    if (resetError) throw resetError;

    // بعد آدرس انتخاب‌شده را true می‌کنیم
    const { data, error } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  const setDefaultAddressMutation = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });

  // Provider

  return (
    <AddressContext.Provider
      value={{
        addresses,
        loading,
        error,

        addAddress: addAddressMutation.mutateAsync,
        addingAddress: addAddressMutation.isPending,
        addAddressError: addAddressMutation.error,

        updateAddress: updateAddressMutation.mutateAsync,
        updatingAddress: updateAddressMutation.isPending,
        updateAddressError: updateAddressMutation.error,

        deleteAddress: deleteAddressMutation.mutateAsync,
        deletingAddress: deleteAddressMutation.isPending,
        deleteAddressError: deleteAddressMutation.error,

        setDefaultAddress: setDefaultAddressMutation.mutateAsync,
        settingDefaultAddress: setDefaultAddressMutation.isPending,
        setDefaultAddressError: setDefaultAddressMutation.error,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  return useContext(AddressContext);
}

export default AddressProvider;
