import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.name === "") {
      setError("Please fill in your name");
      return;
    }

    if (formData.email === "") {
      setError("Please fill in your email");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }
      if (data.user) {
        const { error } = await supabase.from("profiles").insert({
          full_name: formData.name,
          id: data.user.id,
          role: "customer",
        });
      }
      if (error) {
        throw error;
      }

      setSuccess("Account created successfully.");
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-blush-50/40 px-4 py-12">
      <div className="card-surface w-full max-w-md p-8">
        <div className="text-center">
          <p className="font-display text-2xl font-semibold">Lumora</p>
          <h1 className="mt-2 text-xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-stone-500">Join us for a better beauty routine.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="label-field" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              onChange={handleChange}
              name="name"
              value={formData.name}
              placeholder="Your full name"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="text"
              onChange={handleChange}
              name="email"
              value={formData.email}
              placeholder="you@example.com"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              onChange={handleChange}
              name="password"
              value={formData.password}
              placeholder="At least 8 characters"
              className="input-field"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>
          )}

          {success && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600">{success}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-rose-600 hover:text-rose-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
