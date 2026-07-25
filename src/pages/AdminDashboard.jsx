import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter states
  const [selectedLead, setSelectedLead] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        "http://localhost:5000/api/leads",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setLeads(data);
      setLoading(false);

    } catch (error) {
      setError("Unable to load leads.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Search and filter leads
  const filteredLeads = leads.filter((lead) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      lead.name.toLowerCase().includes(searchText) ||
      lead.email.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      lead.status === statusFilter;


    return matchesSearch && matchesStatus;
  });
 const totalLeads = leads.length;

const newLeads = leads.filter(
  (lead) => lead.status === "New"
).length;

const contactedLeads = leads.filter(
  (lead) => lead.status === "Contacted"
).length;

const closedLeads = leads.filter(
  (lead) => lead.status === "Closed"
).length;

  if (loading) {
  return (
    <div className="state-container">
      <div className="spinner"></div>
      <h2>Loading leads...</h2>
      <p>Please wait while we load your leads.</p>
    </div>
  );
}

  if (error) {
  return (
    <div className="state-container">

      <h2>Something went wrong</h2>

      <p>{error}</p>

      <button
        onClick={() => {
          setError("");
          setLoading(true);
          fetchLeads();
        }}
      >
        Try Again
      </button>

    </div>
  );
}
  const updateStatus = async (leadId, newStatus) => {
  try {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/leads/${leadId}/status`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
          status: newStatus
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    // Update the dashboard immediately
    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status: newStatus
            }
          : lead
      )
    );

  } catch (error) {
    alert("Unable to update status.");
  }
};
  return (
    <div className="dashboardd-page">
 <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
    <p>Manage and track your leads</p>
  </div>
  <div className="stats-grid">

  <div className="stat-card">
    <h3>Total Leads</h3>
    <p>{totalLeads}</p>
  </div>

  <div className="stat-card">
    <h3>New Leads</h3>
    <p>{newLeads}</p>
  </div>

  <div className="stat-card">
    <h3>Contacted Leads</h3>
    <p>{contactedLeads}</p>
  </div>

  <div className="stat-card">
    <h3>Closed Leads</h3>
    <p>{closedLeads}</p>
  </div>

</div>

  <button
    onClick={() => {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin";
    }}
  >
    Logout
  </button>

      <p>
        Total Leads: {filteredLeads.length}
      </p>

      {/* SEARCH AND FILTER SECTION */}
      <div>

        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >

          <option value="All">
            All Statuses
          </option>

          <option value="New">
            New
          </option>

          <option value="Contacted">
            Contacted
          </option>

          <option value="Closed">
            Closed
          </option>

        </select>

      </div>

      <br />

      {/* LEADS TABLE */}
      <table border="1">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Budget</th>
            <th>Message</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>

      <tbody>

  {filteredLeads.length === 0 ? (

    <tr>

      <td
        colSpan="6"
        className="empty-state"
      >

        <h3>No leads found</h3>

        <p>
          Try changing your search or filter.
        </p>

      </td>

    </tr>

  ) : (

    filteredLeads.map((lead) => (

      <tr key={lead.id}>

       <td>
  <button
    className="lead-name-button"
    onClick={() => setSelectedLead(lead)}
  >
    {lead.name}
  </button>
</td>

        <td>
          {lead.email}
        </td>

        <td>
          {lead.budget_range}
        </td>

        <td>
          {lead.message}
        </td>

        <td>

          <select
            value={lead.status}
            onChange={(event) =>
              updateStatus(
                lead.id,
                event.target.value
              )
            }
          >

            <option value="New">
              New
            </option>

            <option value="Contacted">
              Contacted
            </option>

            <option value="Closed">
              Closed
            </option>

          </select>

        </td>

        <td>
          {new Date(
            lead.created_at
          ).toLocaleString()}
        </td>

      </tr>

    ))

  )}

</tbody>

      </table>
{selectedLead && (

  <div
    className="modal-overlay"
    onClick={() => setSelectedLead(null)}
  >

    <div
      className="modal-card"
      onClick={(event) =>
        event.stopPropagation()
      }
    >

      <div className="modal-header">

        <h2>Lead Details</h2>

        <button
          className="close-button"
          onClick={() =>
            setSelectedLead(null)
          }
        >
          ×
        </button>

      </div>

      <div className="lead-details">

        <div>
          <strong>Name</strong>
          <p>{selectedLead.name}</p>
        </div>

        <div>
          <strong>Email</strong>
          <p>{selectedLead.email}</p>
        </div>

        <div>
          <strong>Budget Range</strong>
          <p>{selectedLead.budget_range}</p>
        </div>

        <div>
          <strong>Status</strong>
          <p>{selectedLead.status}</p>
        </div>

        <div>
          <strong>Project Message</strong>
          <p>{selectedLead.message}</p>
        </div>

        <div>
          <strong>Submitted On</strong>
          <p>
            {new Date(
              selectedLead.created_at
            ).toLocaleString()}
          </p>
        </div>

      </div>

    </div>

  </div>

)}
     

    </div>
  );
}

export default AdminDashboard;