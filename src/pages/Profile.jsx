import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useAddresses } from "../context/AddressContext";
import { supabase } from "../lib/supabase";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";

function Profile() {
  const { user, loading: authLoading, logout } = useAuth();

  const {
    addresses,
    loading: addressesLoading,
    error: addressesError,
    addAddress,
    addingAddress,
    updateAddress,
    updatingAddress,
    deleteAddress,
    deletingAddress,
    setDefaultAddress,
    settingDefaultAddress,
  } = useAddresses();

  const queryClient = useQueryClient();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [addressForm, setAddressForm] = useState({
    full_name: "",
    phone: "",
    province: "",
    city: "",
    postal_code: "",
    address: "",
    is_default: false,
  });

  // Get profile

  async function getProfile() {
    if (!user?.id) {
      throw new Error("User is not authenticated.");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, phone, avatar_url, role, created_at")
      .eq("id", user.id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: getProfile,
    enabled: Boolean(user?.id),
  });

  // Profile form

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  function handleProfileChange(e) {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Update profile

  async function updateProfile(data) {
    if (!user?.id) {
      throw new Error("User is not authenticated.");
    }

    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        phone: data.phone,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return updatedProfile;
  }

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", user?.id],
      });
    },
  });

  async function handleProfileSubmit(e) {
    e.preventDefault();

    try {
      await updateProfileMutation.mutateAsync(profileForm);

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error.message);
    }
  }

  // Address form

  function handleAddressChange(e) {
    const { name, value, type, checked } = e.target;

    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetAddressForm() {
    setAddressForm({
      full_name: "",
      phone: "",
      province: "",
      city: "",
      postal_code: "",
      address: "",
      is_default: false,
    });

    setEditingAddressId(null);
    setShowAddressForm(false);
  }

  // Edit address

  function handleEditAddress(address) {
    setAddressForm({
      full_name: address.full_name || "",
      phone: address.phone || "",
      province: address.province || "",
      city: address.city || "",
      postal_code: address.postal_code || "",
      address: address.address || "",
      is_default: address.is_default || false,
    });

    setEditingAddressId(address.id);
    setShowAddressForm(true);
  }

  // Submit address

  async function handleAddressSubmit(e) {
    e.preventDefault();

    try {
      if (editingAddressId) {
        await updateAddress({
          id: editingAddressId,
          addressData: addressForm,
        });

        toast.success("Address updated successfully.");
      } else {
        await addAddress(addressForm);

        toast.success("Address added successfully.");
      }

      resetAddressForm();
    } catch (error) {
      console.error("Address error:", error);
      toast.error(error.message);
    }
  }

  // Delete address

  async function handleDeleteAddress(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?",
    );

    if (!confirmed) return;

    try {
      await deleteAddress(id);

      toast.success("Address deleted successfully.");
    } catch (error) {
      console.error("Delete address error:", error);
      toast.error(error.message);
    }
  }

  // Set default address

  async function handleSetDefaultAddress(id) {
    try {
      await setDefaultAddress(id);

      toast("Default address updated.");
    } catch (error) {
      console.error("Set default address error:", error);
      toast.error(error.message);
    }
  }

  // Logout

  async function handleLogout() {
    const confirmed = window.confirm("Are you sure you want to logout?");

    if (!confirmed) return;

    await logout();
  }

  if (authLoading || profileLoading || addressesLoading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-stone-500">Please login first.</p>
      </div>
    );
  }

  if (profileError) {
    return <ErrorMessage message={profileError.message} />;
  }

  if (addressesError) {
    return <ErrorMessage message={addressesError.message} />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <div className="text-center">
        <p className="section-eyebrow">Account</p>
        <h1 className="mt-2 text-3xl font-semibold">My Profile</h1>
        <p className="mt-1 text-stone-500">
          Manage your personal information and addresses.
        </p>
      </div>

      <section className="card-surface p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-charcoal">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Update your account information.
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div>
            <label className="label-field">Email</label>
            <input
              type="email"
              value={user.email || ""}
              disabled
              className="input-field bg-stone-100 text-stone-500"
            />
            <p className="mt-1 text-xs text-stone-500">
              Email is managed by your authentication account.
            </p>
          </div>

          <div>
            <label className="label-field">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={profileForm.full_name}
              onChange={handleProfileChange}
              placeholder="Your full name"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">Phone</label>
            <input
              type="text"
              name="phone"
              value={profileForm.phone}
              onChange={handleProfileChange}
              placeholder="Your phone number"
              className="input-field"
            />
          </div>

          {profile?.role && (
            <div>
              <label className="label-field">Account Role</label>
              <input
                type="text"
                value={profile.role}
                disabled
                className="input-field bg-stone-100 text-stone-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="btn-primary"
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      <section className="card-surface p-6 sm:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-charcoal">
              My Addresses
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Manage your shipping addresses.
            </p>
          </div>

          <button
            onClick={() => {
              resetAddressForm();
              setShowAddressForm(true);
            }}
            className="btn-secondary text-sm"
          >
            Add New Address
          </button>
        </div>

        {showAddressForm && (
          <form
            onSubmit={handleAddressSubmit}
            className="mb-8 space-y-4 rounded-2xl border border-stone-200 bg-blush-50/50 p-5"
          >
            <h3 className="text-lg font-semibold text-charcoal">
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </h3>

            <div>
              <label className="label-field">Full Name</label>
              <input
                name="full_name"
                value={addressForm.full_name}
                onChange={handleAddressChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="label-field">Phone</label>
              <input
                name="phone"
                value={addressForm.phone}
                onChange={handleAddressChange}
                required
                className="input-field"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field">Province</label>
                <input
                  name="province"
                  value={addressForm.province}
                  onChange={handleAddressChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">City</label>
                <input
                  name="city"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="label-field">Postal Code</label>
              <input
                name="postal_code"
                value={addressForm.postal_code}
                onChange={handleAddressChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="label-field">Address</label>
              <textarea
                name="address"
                value={addressForm.address}
                onChange={handleAddressChange}
                rows={4}
                required
                className="input-field resize-none"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input
                type="checkbox"
                name="is_default"
                checked={addressForm.is_default}
                onChange={handleAddressChange}
                className="h-4 w-4 rounded border-stone-200 text-rose-500 focus:ring-rose-300"
              />
              Set as default address
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={addingAddress || updatingAddress}
                className="btn-primary"
              >
                {addingAddress || updatingAddress
                  ? "Saving..."
                  : editingAddressId
                    ? "Update Address"
                    : "Add Address"}
              </button>

              <button
                type="button"
                onClick={resetAddressForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {addresses.length === 0 ? (
          <div className="rounded-2xl bg-blush-50/60 p-8 text-center">
            <p className="text-stone-500">No addresses found.</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="rounded-2xl border border-stone-200 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-charcoal">
                    {address.full_name}
                  </h3>

                  {address.is_default && (
                    <span className="badge bg-emerald-50 text-emerald-600">
                      Default
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-sm text-stone-500">
                  <p>{address.phone}</p>

                  <p>
                    {[address.province, address.city]
                      .filter(Boolean)
                      .join("، ") || "-"}
                  </p>

                  <p>{address.address}</p>

                  <p>Postal Code: {address.postal_code || "-"}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="rounded-full border border-stone-200 px-3 py-1.5 text-sm text-charcoal hover:border-rose-300"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={deletingAddress}
                    className="rounded-full border border-rose-200 px-3 py-1.5 text-sm text-rose-600 disabled:opacity-50"
                  >
                    Delete
                  </button>

                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefaultAddress(address.id)}
                      disabled={settingDefaultAddress}
                      className="rounded-full border border-stone-200 px-3 py-1.5 text-sm text-charcoal disabled:opacity-50"
                    >
                      Set Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card-surface p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-charcoal">My Orders</h2>
        <p className="mt-1 text-sm text-stone-500">
          View your previous orders and track their status.
        </p>
        <Link to="/orders" className="btn-primary mt-5 inline-flex">
          View My Orders
        </Link>
      </section>

      <section className="rounded-2xl border border-rose-200 bg-blush-50 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-charcoal">Account</h2>
        <p className="mt-1 text-sm text-stone-500">
          Sign out from your account.
        </p>
        <button
          onClick={handleLogout}
          className="mt-4 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          Logout
        </button>
      </section>
    </div>
  );
}

export default Profile;
