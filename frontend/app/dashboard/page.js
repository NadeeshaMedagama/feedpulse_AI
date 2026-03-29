"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const initialFilters = {
  category: "",
  status: "",
  search: "",
  sortBy: "date",
  sortOrder: "desc",
  page: 1,
  limit: 10
};

export default function DashboardPage() {
  const [token, setToken] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "admin@feedpulse.dev", password: "admin123" });
  const [feedback, setFeedback] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [stats, setStats] = useState({ totalFeedback: 0, openItems: 0, averagePriorityScore: 0, mostCommonTag: "-" });
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [message, setMessage] = useState(null);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("feedpulse_admin_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFeedback();
      fetchSummary();
    }
  }, [isAuthenticated, filters.page, filters.category, filters.status, filters.search, filters.sortBy, filters.sortOrder]);

  async function login(event) {
    event.preventDefault();
    setMessage(null);

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm)
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      setMessage({ type: "error", text: result.message || "Login failed." });
      return;
    }

    window.localStorage.setItem("feedpulse_admin_token", result.data.token);
    setToken(result.data.token);
    setMessage({ type: "success", text: "Logged in." });
  }

  async function fetchFeedback() {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });

    const response = await fetch(`${API_URL}/api/feedback?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      setMessage({ type: "error", text: result.message || "Failed to load feedback." });
      return;
    }

    setFeedback(result.data.items || []);
    setPagination(result.data.pagination || { page: 1, totalPages: 1 });
    setStats(result.data.stats || stats);
  }

  async function fetchSummary() {
    const response = await fetch(`${API_URL}/api/feedback/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await response.json();

    if (response.ok && result.success) {
      setSummary(result.data);
    }
  }

  async function updateStatus(id, status) {
    const response = await fetch(`${API_URL}/api/feedback/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      setMessage({ type: "error", text: result.message || "Status update failed." });
      return;
    }

    setMessage({ type: "success", text: "Status updated." });
    fetchFeedback();
  }

  async function reanalyze(id) {
    const response = await fetch(`${API_URL}/api/feedback/${id}/reanalyze`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      setMessage({ type: "error", text: result.message || "Reanalysis failed." });
      return;
    }

    setMessage({ type: "success", text: "AI reanalysis completed." });
    fetchFeedback();
  }

  function logout() {
    window.localStorage.removeItem("feedpulse_admin_token");
    setToken("");
    setFeedback([]);
    setSummary(null);
    setMessage({ type: "success", text: "Logged out." });
  }

  if (!isAuthenticated) {
    return (
      <main>
        <div className="card">
          <h1>Admin Dashboard Login</h1>
          <p>Use hardcoded admin credentials to access feedback management.</p>
          <form onSubmit={login}>
            <div className="grid">
              <div>
                <label>Email</label>
                <input
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <button type="submit">Login</button>
            </div>
          </form>
          {message && <p className={message.type === "success" ? "success" : "error"}>{message.text}</p>}
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1>FeedPulse Admin Dashboard</h1>
            <p>Review all feedback, AI sentiment, priority, and workflow status.</p>
          </div>
          <button className="secondary compact-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="card grid">
        <div><strong>Total Feedback:</strong> {stats.totalFeedback}</div>
        <div><strong>Open Items:</strong> {stats.openItems}</div>
        <div><strong>Avg Priority:</strong> {stats.averagePriorityScore}</div>
        <div><strong>Most Common Tag:</strong> {stats.mostCommonTag || "-"}</div>
      </div>

      <div className="card">
        <h3>Filters</h3>
        <div className="grid">
          <div>
            <label>Category</label>
            <select value={filters.category} onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value, page: 1 }))}>
              <option value="">All</option>
              <option value="Bug">Bug</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Improvement">Improvement</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={filters.status} onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value, page: 1 }))}>
              <option value="">All</option>
              <option value="New">New</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label>Search</label>
            <input value={filters.search} onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))} />
          </div>
          <div>
            <label>Sort By</label>
            <select value={filters.sortBy} onChange={(event) => setFilters((prev) => ({ ...prev, sortBy: event.target.value }))}>
              <option value="date">Date</option>
              <option value="priority">Priority</option>
              <option value="sentiment">Sentiment</option>
            </select>
          </div>
        </div>
      </div>

      {summary && (
        <div className="card">
          <h3>AI Weekly Summary</h3>
          <p>{summary.summaryText}</p>
          <div className="row">
            {(summary.topThemes || []).map((theme) => (
              <span key={theme.theme} className="badge Neutral">{theme.theme}: {theme.count}</span>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Sentiment</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((item) => (
              <tr key={item._id}>
                <td>
                  <strong>{item.title}</strong>
                  <div style={{ fontSize: 12 }}>{item.ai_summary || "No AI summary yet"}</div>
                </td>
                <td>{item.category}</td>
                <td><span className={`badge ${item.ai_sentiment || "Neutral"}`}>{item.ai_sentiment || "Neutral"}</span></td>
                <td>{item.ai_priority || "-"}</td>
                <td>{item.status}</td>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
                <td>
                  <div className="row">
                    <button className="secondary" onClick={() => updateStatus(item._id, "In Review")}>In Review</button>
                    <button className="secondary" onClick={() => updateStatus(item._id, "Resolved")}>Resolve</button>
                    <button onClick={() => reanalyze(item._id)}>Re-run AI</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card row">
        <button className="secondary compact-btn" disabled={pagination.page <= 1} onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}>
          Previous
        </button>
        <button className="compact-btn" disabled>
          Page {pagination.page} of {pagination.totalPages}
        </button>
        <button className="secondary compact-btn" disabled={pagination.page >= pagination.totalPages} onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}>
          Next
        </button>
      </div>

      {message && <p className={message.type === "success" ? "success" : "error"}>{message.text}</p>}
    </main>
  );
}

