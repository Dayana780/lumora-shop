import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  function handleDataChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.email) {
      setError("Email is required");
      return;
    }
    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
        throw error;
      }
      setSuccess("Logged in successfully.");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-blush-50/40 px-4 py-12">
      <div className="card-surface w-full max-w-md p-8">
        <div className="text-center">
          <p className="font-display text-2xl font-semibold">Lumora</p>
          <h1 className="mt-2 text-xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-stone-500">Sign in to continue to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="label-field" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleDataChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleDataChange}
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-rose-600 hover:text-rose-700">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
