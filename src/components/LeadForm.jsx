import { useState } from "react";
import "./LeadForm.css";

function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget_range: "",
    message: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };
const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");
  setSuccess("");

  const trimmedName = formData.name.trim();
  const trimmedEmail = formData.email.trim();
  const trimmedMessage = formData.message.trim();

  if (!trimmedName) {
    setError("Name is required.");
    return;
  }

  if (trimmedName.length < 2) {
    setError("Name must contain at least 2 characters.");
    return;
  }

  if (!trimmedEmail) {
    setError("Email is required.");
    return;
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(trimmedEmail)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (!formData.budget_range) {
    setError("Please select a budget range.");
    return;
  }

  if (!trimmedMessage) {
    setError("Project message is required.");
    return;
  }

  if (trimmedMessage.length < 10) {
    setError(
      "Project message must contain at least 10 characters."
    );
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/leads",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          budget_range: formData.budget_range,
          message: trimmedMessage
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
      return;
    }

    setSuccess(
      "Your project details were submitted successfully!"
    );

    setFormData({
      name: "",
      email: "",
      budget_range: "",
      message: ""
    });

  } catch (error) {
    setError(
      "Unable to connect to the server. Please try again."
    );
  }
};
  

   

  <form
  onSubmit={handleSubmit}
  className="lead-form"
></form>

  return (
    
    <form onSubmit={handleSubmit}>

      <h2>Tell us about your project</h2>

      <input
        type="text"
        name="name"
        placeholder="Your name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Your email"
        value={formData.email}
        onChange={handleChange}
      />

      <select
        name="budget_range"
        value={formData.budget_range}
        onChange={handleChange}
      >
        <option value="">
          Select budget range
        </option>

        <option value="Under £5,000">
          Under £5,000
        </option>

        <option value="£5,000 - £10,000">
          £5,000 - £10,000
        </option>

        <option value="£10,000 - £25,000">
          £10,000 - £25,000
        </option>

        <option value="£25,000+">
          £25,000+
        </option>
      </select>

      <textarea
        name="message"
        placeholder="Tell us about your project"
        value={formData.message}
        onChange={handleChange}
      />

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{ color: "green" }}>
          {success}
        </p>
      )}

      <button type="submit">
        Submit Project
      </button>

    </form>
  );
}

export default LeadForm;