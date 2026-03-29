"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "feedpulse_theme";

export default function TopBar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    const initialTheme = savedTheme || "light";
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  }

  function onToggleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTheme();
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand">FeedPulse</Link>
        <div className="topbar-actions">
          <Link href="/dashboard" className="topbar-link" aria-label="Go to Admin dashboard login">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="admin-icon-svg">
              <path d="M12 2 3 6v6c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V6l-9-4Zm0 3.2L18 7.8V12c0 3.7-2.7 7.4-6 8.5-3.3-1.1-6-4.8-6-8.5V7.8l6-2.6Zm0 2.3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5.2 9.7a6.2 6.2 0 0 1 10.4 0c-1.2 1.5-3 2.7-5.2 3.4-2.2-.7-4-1.9-5.2-3.4Z" />
            </svg>
            <span>Admin</span>
          </Link>
          <span
            className="theme-icon-toggle"
            role="button"
            tabIndex={0}
            onClick={toggleTheme}
            onKeyDown={onToggleKeyDown}
            aria-label={theme === "light" ? "Enable dark theme" : "Enable light theme"}
            title={theme === "light" ? "Dark theme" : "Light theme"}
          >
            {theme === "light" ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="theme-icon-svg">
                <path d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 15a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Zm9-7a1 1 0 0 1 0 2h-1a1 1 0 1 1 0-2h1ZM5 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm12.36-6.78a1 1 0 0 1 1.41 1.42l-.7.7a1 1 0 1 1-1.41-1.42l.7-.7Zm-10.43 10.43a1 1 0 0 1 1.41 1.42l-.7.7a1 1 0 1 1-1.41-1.42l.7-.7Zm11.14 2.12a1 1 0 0 1-1.41 0l-.7-.7a1 1 0 1 1 1.41-1.42l.7.7a1 1 0 0 1 0 1.42ZM8.34 7.27a1 1 0 1 1-1.41-1.42l.7-.7a1 1 0 1 1 1.41 1.42l-.7.7ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="theme-icon-svg">
                <path d="M20.74 14.16a1 1 0 0 0-1.06-.24 8 8 0 0 1-10.1-10.1A1 1 0 0 0 8.28 2.6 10 10 0 1 0 22 15.72a1 1 0 0 0-1.26-1.56Z" />
              </svg>
            )}
          </span>
        </div>
      </div>
    </header>
  );
}

