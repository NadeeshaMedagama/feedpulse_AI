"use client";

import { useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const initialForm = {
  title: "",
  description: "",
  category: "Feature Request",
  submitterName: "",
  submitterEmail: ""
};

export default function HomePage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const descriptionCount = useMemo(() => form.description.length, [form.description]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setMessage({ type: "error", text: "Title is required." });
      return;
    }

    if (form.description.trim().length < 20) {
      setMessage({ type: "error", text: "Description must be at least 20 characters." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage({ type: "error", text: result.message || "Submission failed." });
      } else {
        setMessage({ type: "success", text: "Feedback submitted successfully." });
        setForm(initialForm);
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Network error." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <div className="card">
        <h1>FeedPulse</h1>
        <p>Submit feedback for the product team. No sign-in required.</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="grid">
          <div>
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              value={form.title}
              maxLength={120}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            >
              <option>Bug</option>
              <option>Feature Request</option>
              <option>Improvement</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <small>{descriptionCount} characters (minimum 20)</small>
        </div>

        <div className="grid" style={{ marginTop: 12 }}>
          <div>
            <label htmlFor="submitterName">Name (optional)</label>
            <input
              id="submitterName"
              value={form.submitterName}
              onChange={(event) => setForm((prev) => ({ ...prev, submitterName: event.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="submitterEmail">Email (optional)</label>
            <input
              id="submitterEmail"
              type="email"
              value={form.submitterEmail}
              onChange={(event) => setForm((prev) => ({ ...prev, submitterEmail: event.target.value }))}
            />
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit Feedback"}</button>
        </div>

        {message && (
          <p className={message.type === "success" ? "success" : "error"} style={{ marginTop: 12 }}>
            {message.text}
          </p>
        )}
      </form>
    </main>
  );
}

