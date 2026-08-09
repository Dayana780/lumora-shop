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
      setError("plese full fild ");
      return;
    }

    if (formData.email === "") {
      setError("its empity please full this");
      return;
    }
    if (formData.password.length < 8) {
      setError("it most more 8 int");
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
      console.log("rigester date", data);
      setSuccess("horaaaaa");
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.log("error", error);
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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={handleChange}
        name="name"
        value={formData.name}
        placeholder="Name"
      />
      <input
        type="text"
        onChange={handleChange}
        name="email"
        value={formData.email}
        placeholder="Email"
      />
      <input
        type="password"
        onChange={handleChange}
        name="password"
        value={formData.password}
        placeholder="Password"
      />
      <p>{error}</p>
      <p>{success}</p>
      <button type="submit" disabled={loading}>
        {loading ? "looading...." : "send"}
      </button>
    </form>
  );
}

export default Register;
