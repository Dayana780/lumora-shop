import { useEffect, useState } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";
import { useCart } from "../../context/CartContext";
import { useAddresses } from "../../context/AddressContext";
import { toast } from "sonner";

// Re-fetch the real, current price for every product in the cart directly
// from the products table.
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
  const [showAddressForm, setShowAddressForm] = useState(
    addresses.length === 0,
  );
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [addressFormError, setAddressFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      const defaultAddress =
        addresses.find((address) => address.is_default) ?? addresses[0];

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

    const requiredFields = [
      "full_name",
      "phone",
      "province",
      "city",
      "postal_code",
      "address",
    ];

    const hasMissingField = requiredFields.some(
      (field) => !String(addressForm[field]).trim(),
    );

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

      setAddressFormError(
        error?.message || "We could not save this address. Please try again.",
      );
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
      <div className="page-shell flex min-h-[420px] items-center justify-center px-4 py-12 sm:px-6">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-rose-200 border-t-rose-500" />

          <p className="mt-4 text-sm text-stone-500">
            Preparing your checkout...
          </p>
        </div>
      </div>
    );
  }

  if (addressesError) {
    return (
      <div className="page-shell px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-red-100 bg-red-50 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-red-700">
            Failed to load addresses
          </h2>

          <p className="mt-2 break-words text-sm text-red-600">
            {addressesError.message}
          </p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="page-shell px-4 py-12 sm:px-6 sm:py-16">
        <div className="card-surface mx-auto max-w-xl p-6 text-center sm:p-10">
          <p className="section-eyebrow">Checkout</p>

          <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">
            Your cart is empty
          </h1>

          <p className="mt-3 text-sm text-stone-500 sm:text-base">
            Add something beautiful before continuing to checkout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell ">
      {/* HEADER */}
      <div className="mb-6 max-w-2xl sm:mb-8">
        <p className="section-eyebrow">Almost yours</p>

        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Checkout</h1>

        <p className="mt-2 text-sm leading-6 text-stone-500">
          Choose where you'd like your Lumora order delivered.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)] lg:items-start">
        {/* LEFT COLUMN */}
        <section className="min-w-0 space-y-5 sm:space-y-6">
          {/* DELIVERY ADDRESS */}
          <div className="card-surface min-w-0 p-4 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <MapPin size={19} className="shrink-0 text-rose-500" />

                  <h2 className="text-lg font-semibold">Delivery address</h2>
                </div>

                <p className="mt-1 text-sm leading-6 text-stone-500">
                  Select a saved address or add one without leaving checkout.
                </p>
              </div>

              {addresses.length > 0 && !showAddressForm && (
                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="btn-secondary w-full px-4 py-2.5 text-xs sm:w-auto"
                >
                  <Plus size={15} />
                  Add new address
                </button>
              )}
            </div>

            {/* SAVED ADDRESSES */}
            {addresses.length > 0 && (
              <div className="mt-5 grid gap-3 sm:mt-6">
                {addresses.map((address) => {
                  const isSelected = selectedAddress === address.id;

                  return (
                    <label
                      key={address.id}
                      className={`block min-w-0 cursor-pointer rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? "border-rose-500 bg-rose-50/60 shadow-[0_8px_24px_rgba(216,92,112,0.08)]"
                          : "border-stone-200 bg-white hover:border-rose-200 hover:bg-blush-50/40"
                      }`}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={isSelected}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="mt-1 h-4 w-4 shrink-0 accent-rose-500"
                        />

                        <div className="min-w-0 flex-1 text-sm">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="break-words font-semibold text-charcoal">
                              {address.full_name}
                            </p>

                            {address.is_default && (
                              <span className="badge shrink-0 bg-emerald-50 text-emerald-600">
                                Default
                              </span>
                            )}

                            {isSelected && (
                              <span className="badge shrink-0 bg-rose-100 text-rose-600">
                                Selected
                              </span>
                            )}
                          </div>

                          <p className="mt-1 break-words text-stone-500">
                            {address.phone}
                          </p>

                          <p className="break-words text-stone-500">
                            {[address.province, address.city]
                              .filter(Boolean)
                              .join(" — ")}
                          </p>

                          <p className="mt-1 break-words leading-6 text-stone-500">
                            {address.address}
                          </p>

                          <p className="mt-1 break-words text-xs text-stone-500">
                            Postal code: {address.postal_code}
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {/* ADD ADDRESS FORM */}
            {showAddressForm && (
              <form
                onSubmit={handleAddAddress}
                className="mt-5 min-w-0 rounded-2xl border border-stone-200 bg-ivory p-4 sm:mt-6 sm:p-6"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold">Add a new address</h3>

                    <p className="mt-1 text-xs leading-5 text-stone-500">
                      Your new address will be available for future orders too.
                    </p>
                  </div>

                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        resetAddressForm();
                      }}
                      className="shrink-0 rounded-full p-2 text-stone-500 hover:bg-white hover:text-charcoal"
                      aria-label="Close address form"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* FORM FIELDS */}
                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label htmlFor="checkout-full-name" className="label-field">
                      Full Name
                    </label>

                    <input
                      id="checkout-full-name"
                      name="full_name"
                      value={addressForm.full_name}
                      onChange={handleAddressChange}
                      className="input-field w-full min-w-0"
                      required
                    />
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="checkout-phone" className="label-field">
                      Phone
                    </label>

                    <input
                      id="checkout-phone"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressChange}
                      className="input-field w-full min-w-0"
                      required
                    />
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="checkout-province" className="label-field">
                      Province
                    </label>

                    <input
                      id="checkout-province"
                      name="province"
                      value={addressForm.province}
                      onChange={handleAddressChange}
                      className="input-field w-full min-w-0"
                      required
                    />
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="checkout-city" className="label-field">
                      City
                    </label>

                    <input
                      id="checkout-city"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      className="input-field w-full min-w-0"
                      required
                    />
                  </div>

                  <div className="min-w-0 sm:col-span-2">
                    <label
                      htmlFor="checkout-postal-code"
                      className="label-field"
                    >
                      Postal Code
                    </label>

                    <input
                      id="checkout-postal-code"
                      name="postal_code"
                      value={addressForm.postal_code}
                      onChange={handleAddressChange}
                      className="input-field w-full min-w-0"
                      required
                    />
                  </div>

                  <div className="min-w-0 sm:col-span-2">
                    <label htmlFor="checkout-address" className="label-field">
                      Address
                    </label>

                    <textarea
                      id="checkout-address"
                      name="address"
                      value={addressForm.address}
                      onChange={handleAddressChange}
                      rows={4}
                      className="input-field w-full min-w-0 resize-none"
                      required
                    />
                  </div>
                </div>

                {/* DEFAULT ADDRESS */}
                {addresses.length > 0 && (
                  <label className="mt-4 flex items-start gap-2 text-sm text-charcoal">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={addressForm.is_default}
                      onChange={handleAddressChange}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-rose-500"
                    />

                    <span>Make this my default address</span>
                  </label>
                )}

                {/* ERROR */}
                {(addressFormError || addAddressError) && (
                  <p
                    className="mt-4 break-words rounded-xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-600"
                    role="alert"
                  >
                    {addressFormError || addAddressError?.message}
                  </p>
                )}

                {/* FORM BUTTONS */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={addingAddress}
                    className="btn-primary w-full sm:w-auto"
                  >
                    {addingAddress
                      ? "Saving address..."
                      : "Save & select address"}
                  </button>

                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        resetAddressForm();
                      }}
                      className="btn-secondary w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ORDER SUMMARY */}
        <aside className="card-surface min-w-0 p-4 sm:p-6 lg:sticky lg:top-28 lg:p-7">
          <p className="section-eyebrow">Your order</p>

          <h2 className="mt-2 text-xl font-semibold">Order summary</h2>

          {/* PRODUCTS */}
          <div className="mt-5 space-y-4 sm:mt-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex min-w-0 items-start justify-between gap-3 border-b border-stone-200 pb-4 last:border-b-0 last:pb-0 sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-medium text-charcoal">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="max-w-[45%] shrink-0 text-right text-xs font-semibold text-charcoal sm:text-sm">
                  {(Number(item.price) * item.quantity).toLocaleString()} $
                </p>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="mt-6 border-t border-stone-200 pt-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-stone-500">Total</span>

              <span className="shrink-0 text-lg font-bold text-charcoal sm:text-xl">
                {displayTotal.toLocaleString()} $
              </span>
            </div>
          </div>

          {/* PLACE ORDER */}
          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || !selectedAddress}
            className="btn-primary mt-6 w-full py-3.5"
          >
            {isSubmitting ? "Creating order..." : "Place order"}
          </button>

          {!selectedAddress && (
            <p className="mt-3 text-center text-xs leading-5 text-stone-500">
              Select or add a delivery address to continue.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
