import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import LeadForm from "./components/LeadForm";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function Home() {
  return (
    <div className="home-page">

      <header className="navbar">

        <h2>LeadDesk</h2>

        <a href="/admin">
          Admin Login
        </a>

      </header>

      <main className="hero-section">

        <section className="hero-content">

          <p className="eyebrow">
            BUILD YOUR NEXT BIG IDEA
          </p>

          <h1>
            Turn your idea into a digital product.
          </h1>

          <p className="hero-description">
            Tell us about your project and our team
            will help you bring your vision to life.
          </p>

        </section>

        <section className="form-card">

          <LeadForm />

        </section>

      </main>

      

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
           element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;