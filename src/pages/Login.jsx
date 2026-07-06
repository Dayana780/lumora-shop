import { useState } from "react";

function Login() {
  const [formData, setFormData] = useState({
    name: "",
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

  function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name) {
      setError("Name is required");
      return;
    }

    if (!formData.email) {
      setError("Email is required");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      console.log(formData);

      setLoading(false);

      setSuccess("Login successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    }, 2000);
  }

  return (
    <div className="bg-amber-700 p-5">
      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleDataChange}
        />

        <br /><br />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleDataChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleDataChange}
        />

        <br /><br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>

      </form>
      <h3>Preview</h3>

<p>Name: {formData.name}</p>

<p>Email: {formData.email}</p>

<p>Password Length: {formData.password.length}</p>
    </div>
  );
}

export default Login;