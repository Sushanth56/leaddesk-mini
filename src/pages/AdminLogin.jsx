import { useState } from "react";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      // Save JWT token
      localStorage.setItem(
        "adminToken",
        data.token
      );

      // Go to admin dashboard
      window.location.href = "/admin/dashboard";

    } catch (error) {
      setError("Unable to connect to the server.");
    }

    setLoading(false);
  };

  return (
    <div>

      <h1>Admin Login</h1>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
        />

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <button type="submit">
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>
  );
}

export default AdminLogin;