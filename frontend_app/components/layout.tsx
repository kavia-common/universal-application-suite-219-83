"use client";
import React from "react";

/**
 * Layout component for application pages.
 * Provides:
 * - Top navbar with App name, Dark Mode toggle, and a simple Avatar menu.
 * - Left sidebar with navigation links: Dashboard, Scheduler, Reports, Settings.
 * - Responsive behavior: sidebar collapses into an overlay on mobile.
 *
 * Theme integration:
 * - Uses CSS variables defined in src/App.css via data-theme="light|dark" on documentElement.
 * - Reads initial theme from documentElement or prefers-color-scheme, persists to localStorage.
 */

// Types
type LayoutProps = {
  children: React.ReactNode;
};

// Helper: load and persist theme with graceful fallback
function getInitialTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  try {
    const persisted = localStorage.getItem("kavia-theme");
    if (persisted === "light" || persisted === "dark") return persisted;
  } catch {
    // ignore
  }
  // fallback to system preference
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

// PUBLIC_INTERFACE
export default function Layout({ children }: LayoutProps) {
  /** App-wide layout wrapper with navbar and responsive sidebar. */

  const [theme, setTheme] = React.useState<"light" | "dark">(getInitialTheme);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [avatarOpen, setAvatarOpen] = React.useState(false);

  // apply theme to <html data-theme="...">
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      try {
        localStorage.setItem("kavia-theme", theme);
      } catch {
        // ignore
      }
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const closeOverlays = () => {
    setSidebarOpen(false);
    setAvatarOpen(false);
  };

  // Inline styles aligned with existing theme variables (src/App.css)
  const styles: { [k: string]: React.CSSProperties } = {
    layout: {
      minHeight: "100vh",
      display: "grid",
      gridTemplateRows: "56px 1fr",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
    },
    navbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "0 14px",
      borderBottom: "1px solid var(--border-color)",
      background: "var(--bg-primary)",
      position: "sticky",
      top: 0,
      zIndex: 30,
    },
    left: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    right: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    brand: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontWeight: 800,
      letterSpacing: 0.3,
      userSelect: "none",
    },
    brandDot: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "var(--text-secondary)",
      display: "inline-block",
    },
    iconBtn: {
      padding: "8px 10px",
      borderRadius: 10,
      border: "1px solid var(--border-color)",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
      cursor: "pointer",
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      background:
        "linear-gradient(135deg, rgba(0,123,255,0.8), rgba(97,218,251,0.8))",
      border: "2px solid var(--border-color)",
      cursor: "pointer",
    },
    contentWrap: {
      display: "grid",
      gridTemplateColumns: "240px 1fr",
      minHeight: 0,
    },
    sidebar: {
      borderRight: "1px solid var(--border-color)",
      background: "var(--bg-primary)",
      padding: 14,
      position: "relative",
      zIndex: 20,
    },
    navList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "grid",
      gap: 8,
    } as React.CSSProperties,
    navLink: {
      display: "block",
      padding: "10px 12px",
      borderRadius: 10,
      color: "var(--text-primary)",
      textDecoration: "none",
      border: "1px solid var(--border-color)",
      background: "var(--bg-secondary)",
      fontWeight: 600,
    },
    main: {
      minWidth: 0,
      overflow: "hidden",
    },
    // Mobile drawer
    drawerBackdrop: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.35)",
      zIndex: 25,
      display: sidebarOpen ? "block" : "none",
    },
    drawer: {
      position: "fixed",
      top: 56,
      bottom: 0,
      left: 0,
      width: 260,
      background: "var(--bg-primary)",
      borderRight: "1px solid var(--border-color)",
      padding: 14,
      transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
      transition: "transform 0.25s ease",
      zIndex: 30,
    },
    // Avatar dropdown
    dropdown: {
      position: "absolute",
      top: 50,
      right: 10,
      background: "var(--bg-primary)",
      border: "1px solid var(--border-color)",
      borderRadius: 10,
      padding: 8,
      boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
      zIndex: 35,
      display: avatarOpen ? "grid" : "none",
      gap: 4,
      minWidth: 180,
    },
    dropdownItem: {
      padding: "8px 10px",
      borderRadius: 8,
      cursor: "pointer",
      color: "var(--text-primary)",
      textDecoration: "none",
      border: "1px solid transparent",
    },
    divider: {
      height: 1,
      background: "var(--border-color)",
      margin: "6px 0",
    },
    // Utility
    hideOnDesktop: {
      display: "none",
    },
    onlyDesktopGrid: {
      display: "grid",
    },
  };

  return (
    <div style={styles.layout} onClick={closeOverlays}>
      {/* Navbar */}
      <nav style={styles.navbar} aria-label="top-navbar" onClick={(e) => e.stopPropagation()}>
        <div style={styles.left}>
          {/* Mobile sidebar toggle */}
          <button
            type="button"
            style={{ ...styles.iconBtn, ...styles.hideOnDesktop }}
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen((s) => !s)}
          >
            ☰
          </button>

          <a href="/" style={styles.brand} aria-label="app-brand">
            <span style={styles.brandDot} />
            <span>App Suite</span>
          </a>
        </div>

        <div style={{ ...styles.right, position: "relative" }}>
          <button
            type="button"
            style={styles.iconBtn}
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme();
            }}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title="Toggle theme"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>

          <div
            style={styles.avatar}
            aria-label="user-avatar"
            onClick={(e) => {
              e.stopPropagation();
              setAvatarOpen((v) => !v);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setAvatarOpen((v) => !v);
              }
            }}
          />

          {/* Avatar dropdown */}
          <div style={styles.dropdown} role="menu" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "6px 8px", fontWeight: 700 }}>Kishore</div>
            <div style={styles.divider} />
            <a href="/app/profile" style={styles.dropdownItem}>
              Profile
            </a>
            <a href="/app/settings" style={styles.dropdownItem}>
              Settings
            </a>
            <a href="/app/reports" style={styles.dropdownItem}>
              Reports
            </a>
            <div style={styles.divider} />
            <a href="/logout" style={{ ...styles.dropdownItem, color: "#e53935" }}>
              Logout
            </a>
          </div>
        </div>
      </nav>

      {/* Desktop layout: Sidebar + Main */}
      <div
        style={{
          ...styles.contentWrap,
          ...styles.onlyDesktopGrid,
        }}
        className="layout-grid-desktop"
      >
        {/* Sidebar (hidden on small screens via CSS below) */}
        <aside style={styles.sidebar} aria-label="sidebar">
          <ul style={styles.navList}>
            <li>
              <a href="/app/dashboard" style={styles.navLink}>
                Dashboard
              </a>
            </li>
            <li>
              <a href="/app/scheduler" style={styles.navLink}>
                Scheduler
              </a>
            </li>
            <li>
              <a href="/app/reports" style={styles.navLink}>
                Reports
              </a>
            </li>
            <li>
              <a href="/app/profile" style={styles.navLink}>
                Profile
              </a>
            </li>
            <li>
              <a href="/app/settings" style={styles.navLink}>
                Settings
              </a>
            </li>
          </ul>
        </aside>

        {/* Main content area */}
        <main style={styles.main} aria-label="main-content">
          {children}
        </main>
      </div>

      {/* Mobile drawer and backdrop */}
      <div
        style={styles.drawerBackdrop}
        aria-hidden={!sidebarOpen}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        style={styles.drawer}
        aria-label="mobile-sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        <ul style={styles.navList}>
          <li>
            <a href="/app/dashboard" style={styles.navLink} onClick={() => setSidebarOpen(false)}>
              Dashboard
            </a>
          </li>
          <li>
            <a href="/app/scheduler" style={styles.navLink} onClick={() => setSidebarOpen(false)}>
              Scheduler
            </a>
          </li>
          <li>
            <a href="/app/reports" style={styles.navLink} onClick={() => setSidebarOpen(false)}>
              Reports
            </a>
          </li>
          <li>
            <a href="/app/profile" style={styles.navLink} onClick={() => setSidebarOpen(false)}>
              Profile
            </a>
          </li>
          <li>
            <a href="/app/settings" style={styles.navLink} onClick={() => setSidebarOpen(false)}>
              Settings
            </a>
          </li>
        </ul>
      </aside>

      {/* Responsive CSS helpers */}
      <style>
        {`
        /* Hide desktop sidebar grid and show hamburger under 900px */
        @media (max-width: 900px) {
          .layout-grid-desktop {
            display: block !important;
          }
          /* Hide the permanent sidebar on small screens by forcing 1col layout */
          .layout-grid-desktop > aside[aria-label="sidebar"] {
            display: none !important;
          }
        }
        @media (max-width: 900px) {
          /* reveal hamburger button */
          [aria-label="top-navbar"] button[aria-label="Toggle sidebar"] {
            display: inline-block !important;
          }
        }
      `}
      </style>
    </div>
  );
}
