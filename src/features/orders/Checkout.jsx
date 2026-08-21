import { useEffect, useState } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";
import { useCart } from "../../context/CartContext";
import { useAddresses } from "../../context/AddressContext";
import { toast } from "sonner";
// Re-fetch the real, current price for every product in the cart directly
// from the "products" table. The cart in CartContext only lives in the
// browser's memory, so a user could otherwise edit that state (or the
// network request) and submit whatever price they want. We never trust
// a price that came from the client — we only trust what the database
// says right now.
async function getTrustedPrices(productIds) {
  const { data, error } = await supabase
    .from("products")
    .select("id, price")
    .in("id", productIds);

  if (error) {
    throw error;
  }

  return new Map(data.map((product) => [product.id, Number(product.price)]));
}

const emptyAddressForm = {
  full_name: "",
  phone: "",
  province: "",
  city: "",
  postal_code: "",
  address: "",
  is_default: false,
};

function Checkout() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const {
    addresses,
    loading: addressesLoading,
    error: addressesError,
    addAddress,
    addingAddress,
    addAddressError,
  } = useAddresses();

  const [selectedAddress, setSelectedAddress] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(addresses.length === 0);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [addressFormError, setAddressFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      const defaultAddress = addresses.find((address) => address.is_default) ?? addresses[0];
      setSelectedAddress(defaultAddress.id);
    }
  }, [addresses, selectedAddress]);

  useEffect(() => {
    if (addresses.length === 0) {
      setShowAddressForm(true);
      setSelectedAddress("");
    }
  }, [addresses.length]);

  function handleAddressChange(e) {
    const { name, value, type, checked } = e.target;
    setAddressForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
    setAddressFormError("");
  }

  function resetAddressForm() {
    setAddressForm(emptyAddressForm);
    setAddressFormError("");
  }

  async function handleAddAddress(e) {
    e.preventDefault();
    setAddressFormError("");

    const requiredFields = ["full_name", "phone", "province", "city", "postal_code", "address"];
    const hasMissingField = requiredFields.some((field) => !String(addressForm[field]).trim());

    if (hasMissingField) {
      setAddressFormError("Please complete all address fields.");
      return;
    }

    try {
      const createdAddress = await addAddress({
        ...addressForm,
        is_default: addresses.length === 0 ? true : addressForm.is_default,
      });

      setSelectedAddress(createdAddress.id);
      setShowAddressForm(false);
      resetAddressForm();
    } catch (error) {
      console.error("Checkout address error:", error);
      setAddressFormError(error?.message || "We could not save this address. Please try again.");
    }
  }

  async function handlePlaceOrder() {
    if (isSubmitting) return;

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select an address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        toast.error("Please login first.");
        return;
      }

      const productIds = cart.map((item) => item.id);
      const trustedPrices = await getTrustedPrices(productIds);

      const orderItems = cart.map((item) => {
        const trustedPrice = trustedPrices.get(item.id);

        if (trustedPrice === undefined) {
          throw new Error(`Product "${item.title}" is no longer available.`);
        }

        return {
          product_id: item.id,
          quantity: item.quantity,
          price: trustedPrice,
        };
      });

      const trustedTotal = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          address_id: selectedAddress,
          total_price: trustedTotal,
          status: "pending",
          payment_status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: itemsError } = await supabase.from("order_items").insert(
        orderItems.map((item) => ({
          ...item,
          order_id: order.id,
        })),
      );

      if (itemsError) throw itemsError;

      navigate(`/payment/${order.id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const displayTotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  if (addressesLoading) {
    return (
      <div className="page-shell flex min-h-[420px] items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-rose-200 border-t-rose-500" />
          <p className="mt-4 text-sm text-stone-500">Preparing your checkout...</p>
        </div>
      </div>
    );
  }

  if (addressesError) {
    return (
      <div className="page-shell py-12">
        <div className="rounded-3xl border border-red-100 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-700">Failed to load addresses</h2>
          <p className="mt-2 text-sm text-red-600">{addressesError.message}</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="page-shell py-16">
        <div className="card-surface mx-auto max-w-xl p-10 text-center">
          <p className="section-eyebrow">Checkout</p>
          <h1 className="mt-3 text-3xl font-semibold">Your cart is empty</h1>
          <p className="mt-3 text-stone-500">Add something beautiful before continuing to checkout.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell py-10 sm:py-14">
      <div className="mb-8 max-w-2xl">
        <p className="section-eyebrow">Almost yours</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-sm text-stone-500">Choose where you'd like your Lumora order delivered.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:items-start">
        <section className="space-y-6">
          <div className="card-surface p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin size={19} className="text-rose-500" />
                  <h2 className="text-lg font-semibold">Delivery address</h2>
                </div>
                <p className="mt-1 text-sm text-stone-500">
                  Select a saved address or add one without leaving checkout.
                </p>
              </div>

              {addresses.length > 0 && !showAddressForm && (
                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="btn-secondary px-4 py-2.5 text-xs"
                >
                  <Plus size={15} /> Add new address
                </button>
              )}
            </div>

            {addresses.length > 0 && (
              <div className="mt-6 grid gap-3">
                {addresses.map((address) => {
                  const isSelected = selectedAddress === address.id;

                  return (
                    <label
                      key={address.id}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? "border-rose-500 bg-rose-50/60 shadow-[0_8px_24px_rgba(216,92,112,0.08)]"
                          : "border-stone-200 bg-white hover:border-rose-200 hover:bg-blush-50/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={isSelected}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="mt-1 h-4 w-4 accent-rose-500"
                        />
                        <div className="min-w-0 text-sm">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-charcoal">{address.full_name}</p>
                            {address.is_default && (
                              <span className="badge bg-emerald-50 text-emerald-600">Default</span>
                            )}
                            {isSelected && (
                              <span className="badge bg-rose-100 text-rose-600">Selected</span>
                            )}
                          </div>
                          <p className="mt-1 text-stone-500">{address.phone}</p>
                          <p className="text-stone-500">
                            {[address.province, address.city].filter(Boolean).join(" — ")}
                          </p>
                          <p className="mt-1 leading-6 text-stone-500">{address.address}</p>
                          <p className="mt-1 text-xs text-stone-500">Postal code: {address.postal_code}</p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="mt-6 rounded-2xl border border-stone-200 bg-ivory p-5 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">Add a new address</h3>
                    <p className="mt-1 text-xs text-stone-500">Your new address will be available for future orders too.</p>
                  </div>
                  {addresses.length > 0 && (
                    <button type="button" onClick={() => { setShowAddressForm(false); resetAddressForm(); }} className="rounded-full p-2 text-stone-500 hover:bg-white hover:text-charcoal" aria-label="Close address form">
                      <X size={18} />
                    </button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="checkout-full-name" className="label-field">Full Name</label>
                    <input id="checkout-full-name" name="full_name" value={addressForm.full_name} onChange={handleAddressChange} className="input-field" required />
                  </div>
                  <div>
                    <label htmlFor="checkout-phone" className="label-field">Phone</label>
                    <input id="checkout-phone" name="phone" value={addressForm.phone} onChange={handleAddressChange} className="input-field" required />
                  </div>
                  <div>
                    <label htmlFor="checkout-province" className="label-field">Province</label>
                    <input id="checkout-province" name="province" value={addressForm.province} onChange={handleAddressChange} className="input-field" required />
                  </div>
                  <div>
                    <label htmlFor="checkout-city" className="label-field">City</label>
                    <input id="checkout-city" name="city" value={addressForm.city} onChange={handleAddressChange} className="input-field" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-postal-code" className="label-field">Postal Code</label>
                    <input id="checkout-postal-code" name="postal_code" value={addressForm.postal_code} onChange={handleAddressChange} className="input-field" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-address" className="label-field">Address</label>
                    <textarea id="checkout-address" name="address" value={addressForm.address} onChange={handleAddressChange} rows={4} className="input-field resize-none" required />
                  </div>
                </div>

                {addresses.length > 0 && (
                  <label className="mt-4 flex items-center gap-2 text-sm text-charcoal">
                    <input type="checkbox" name="is_default" checked={addressForm.is_default} onChange={handleAddressChange} className="h-4 w-4 accent-rose-500" />
                    Make this my default address
                  </label>
                )}

                {(addressFormError || addAddressError) && (
                  <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                    {addressFormError || addAddressError?.message}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="submit" disabled={addingAddress} className="btn-primary">
                    {addingAddress ? "Saving address..." : "Save & select address"}
                  </button>
                  {addresses.length > 0 && (
                    <button type="button" onClick={() => { setShowAddressForm(false); resetAddressForm(); }} className="btn-secondary">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </section>

        <aside className="card-surface p-5 sm:p-7 lg:sticky lg:top-28">
          <p className="section-eyebrow">Your order</p>
          <h2 className="mt-2 text-xl font-semibold">Order summary</h2>

          <div className="mt-6 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 border-b border-stone-200 pb-4 last:border-b-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-charcoal">{item.title}</p>
                  <p className="mt-1 text-xs text-stone-500">Quantity: {item.quantity}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-charcoal">
                  {(Number(item.price) * item.quantity).toLocaleString()} تومان
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-stone-200 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">Total</span>
              <span className="text-xl font-bold text-charcoal">{displayTotal.toLocaleString()} تومان</span>
            </div>
          </div>

          <button onClick={handlePlaceOrder} disabled={isSubmitting || !selectedAddress} className="btn-primary mt-6 w-full py-3.5">
            {isSubmitting ? "Creating order..." : "Place order"}
          </button>

          {!selectedAddress && (
            <p className="mt-3 text-center text-xs text-stone-500">Select or add a delivery address to continue.</p>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
