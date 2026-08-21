import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

function Settings() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Get admin profile
  useEffect(() => {
    async function getProfile() {
      if (!user) return;

      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Get profile error:", error);
        setError(error.message);
        setLoading(false);
        return;
      }

      setFormData({
        full_name: data?.full_name || "",
        phone: data?.phone || "",
      });

      setRole(data?.role || "");
      setLoading(false);
    }

    getProfile();
  }, [user]);

  // Handle input
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
    setError("");
  }

  // Update profile
  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      setError("Please login first.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Update profile error:", error);
      setError(error.message);
      setSaving(false);
      return;
    }

    setMessage("Profile updated successfully.");
    setSaving(false);
  }

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-pink-500" />
          <p className="text-sm text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Settings
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your admin profile and account information.
          </p>
        </div>

        {/* PROFILE CARD */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Card Header */}
          <div className="border-b border-gray-100 bg-gradient-to-r from-pink-50 to-white px-6 py-5 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-xl text-pink-600">
                👤
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Admin Profile
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your personal information.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* FULL NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Email is managed by Supabase Authentication.
                </p>
              </div>

              {/* ROLE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Role
                </label>

                <input
                  type="text"
                  value={role}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm capitalize text-gray-500"
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm text-red-600">
                  !
                </div>

                <div>
                  <p className="text-sm font-medium text-red-700">
                    Something went wrong
                  </p>

                  <p className="mt-1 text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* SUCCESS */}
            {message && (
              <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm text-green-600">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-medium text-green-700">Success</p>

                  <p className="mt-1 text-sm text-green-600">{message}</p>
                </div>
              </div>
            )}

            {/* BUTTON */}
            <div className="flex justify-end border-t border-gray-100 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>

        {/* ACCOUNT INFORMATION */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-semibold text-gray-800">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Basic information about your admin account.
            </p>
          </div>

          {/* Content */}
          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2">
            {/* USER ID */}
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                User ID
              </p>

              <p className="mt-2 break-all text-sm text-gray-700">
                {user?.id || "-"}
              </p>
            </div>

            {/* CREATED */}
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Account Created
              </p>

              <p className="mt-2 text-sm text-gray-700">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleString()
                  : "-"}
              </p>
            </div>

            {/* EMAIL */}
            <div className="rounded-xl bg-gray-50 p-4 md:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Account Email
              </p>

              <p className="mt-2 break-all text-sm text-gray-700">
                {user?.email || "-"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
