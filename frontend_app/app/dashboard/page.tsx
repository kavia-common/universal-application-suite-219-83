"use client";
import React from "react";

// Lazy import to keep compatibility if dependencies aren't installed yet.
// This avoids immediate build-time errors until npm install runs.
let motion: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  motion = require("framer-motion").motion;
} catch {
  // Fallback shim to render without animation if framer-motion isn't present yet.
  motion = new Proxy(
    {},
    {
      get:
        () =>
        ({ children, ...rest }: any) =>
          <div {...rest}>{children}</div>,
    }
  );
}

let Recharts: any = {};
let LineChart: any,
  Line: any,
  XAxis: any,
  YAxis: any,
  CartesianGrid: any,
  Tooltip: any,
  ResponsiveContainer: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Recharts = require("recharts");
  LineChart = Recharts.LineChart;
  Line = Recharts.Line;
  XAxis = Recharts.XAxis;
  YAxis = Recharts.YAxis;
  CartesianGrid = Recharts.CartesianGrid;
  Tooltip = Recharts.Tooltip;
  ResponsiveContainer = Recharts.ResponsiveContainer;
} catch {
  // No-op fallbacks render simple boxes so the page still loads.
  const Fallback = ({ children, ...rest }: any) => <div {...rest}>{children}</div>;
  LineChart = Fallback;
  Line = Fallback;
  XAxis = Fallback;
  YAxis = Fallback;
  CartesianGrid = Fallback;
  Tooltip = Fallback;
  ResponsiveContainer = Fallback;
}

// PUBLIC_INTERFACE
export default function DashboardPage() {
  /**
   * Dashboard home page:
   * - Top navbar with logo and user avatar
   * - Sidebar with navigation links (Dashboard, Optimizer, Reports, Settings)
   * - Main content with welcome message, three animated info cards
   * - Sample cost trend line chart using Recharts
   */

  const data = [
    { name: "Jan", cost: 3200 },
    { name: "Feb", cost: 4500 },
    { name: "Mar", cost: 4100 },
    { name: "Apr", cost: 4800 },
    { name: "May", cost: 5200 },
    { name: "Jun", cost: 5000 },
  ];

  const styles: { [key: string]: React.CSSProperties } = {
    page: {
      minHeight: "100vh",
      display: "grid",
      gridTemplateRows: "64px 1fr",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
    },
    navbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      borderBottom: "1px solid var(--border-color)",
      background: "var(--bg-primary)",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontWeight: 800,
      letterSpacing: 0.2,
    },
    brandDot: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "var(--text-secondary)",
      display: "inline-block",
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      background:
        "linear-gradient(135deg, rgba(0,123,255,0.8), rgba(97,218,251,0.8))",
      border: "2px solid var(--border-color)",
    },
    contentWrap: {
      display: "grid",
      gridTemplateColumns: "240px 1fr",
      minHeight: 0,
    },
    sidebar: {
      borderRight: "1px solid var(--border-color)",
      background: "var(--bg-primary)",
      padding: 16,
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
      padding: 20,
      minWidth: 0,
    },
    headingRow: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12,
      flexWrap: "wrap",
      marginBottom: 16,
    },
    title: {
      margin: 0,
      fontSize: 24,
      fontWeight: 800,
    },
    subtitle: {
      margin: 0,
      color: "var(--text-secondary)",
      fontSize: 14,
    },
    cardsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0,1fr))",
      gap: 16,
      marginTop: 12,
      marginBottom: 20,
    },
    card: {
      border: "1px solid var(--border-color)",
      background: "var(--bg-primary)",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    },
    cardTitle: {
      margin: 0,
      fontSize: 14,
      color: "var(--text-secondary)",
      fontWeight: 700,
      letterSpacing: 0.3,
      textTransform: "uppercase",
    },
    cardValue: {
      marginTop: 8,
      marginBottom: 4,
      fontSize: 24,
      fontWeight: 800,
    },
    cardDetail: {
      color: "var(--text-secondary)",
      fontSize: 14,
    },
    chartCard: {
      border: "1px solid var(--border-color)",
      background: "var(--bg-primary)",
      borderRadius: 12,
      padding: 16,
      height: 360,
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
    },
    chartTitle: {
      margin: 0,
      marginBottom: 10,
      fontWeight: 800,
      fontSize: 16,
    },
    chartWrap: {
      flex: 1,
      minHeight: 0,
      width: "100%",
    },
    mobileNote: {
      marginTop: 10,
      fontSize: 12,
      color: "var(--text-secondary)",
    },
    footerSpace: {
      height: 10,
    },
    // Responsive
    "@media": {},
  };

  return (
    <div style={styles.page} aria-label="dashboard-page">
      {/* Top Nav */}
      <div style={styles.navbar}>
        <div style={styles.logo} aria-label="navbar-logo">
          <span style={styles.brandDot} />
          <span>KAVIA</span>
        </div>
        <div style={styles.logo}>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Kishore
          </span>
          <div style={styles.avatar} aria-label="user-avatar" />
        </div>
      </div>

      {/* Body with Sidebar + Main */}
      <div style={styles.contentWrap}>
        {/* Sidebar */}
        <aside style={styles.sidebar} aria-label="sidebar">
          <ul style={styles.navList}>
            <li>
              <a href="/app/dashboard" style={styles.navLink}>
                Dashboard
              </a>
            </li>
            <li>
              <a href="/app/optimizer" style={styles.navLink}>
                Optimizer
              </a>
            </li>
            <li>
              <a href="/app/reports" style={styles.navLink}>
                Reports
              </a>
            </li>
            <li>
              <a href="/app/settings" style={styles.navLink}>
                Settings
              </a>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main style={styles.main}>
          <div style={styles.headingRow}>
            <h1 style={styles.title}>Hi Kishore 👋</h1>
            <p style={styles.subtitle}>Welcome back to your cloud overview</p>
          </div>

          {/* Info Cards */}
          <div style={styles.cardsGrid}>
            <motion.div
              style={styles.card}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
            >
              <p style={styles.cardTitle}>Current Monthly Cost</p>
              <p style={styles.cardValue}>₹5,000</p>
              <p style={styles.cardDetail}>Projected end-of-month spend</p>
            </motion.div>

            <motion.div
              style={styles.card}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.12 }}
            >
              <p style={styles.cardTitle}>Active Services</p>
              <p style={styles.cardValue}>EC2: 2 • S3: 5</p>
              <p style={styles.cardDetail}>Across 2 regions</p>
            </motion.div>

            <motion.div
              style={styles.card}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.18 }}
            >
              <p style={styles.cardTitle}>AI Recommendations</p>
              <p style={styles.cardValue}>"Stop EC2 after 7PM"</p>
              <p style={styles.cardDetail}>Save up to 14% monthly</p>
            </motion.div>
          </div>

          {/* Chart */}
          <motion.div
            style={styles.chartCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.22 }}
          >
            <h3 style={styles.chartTitle}>Cost Trend (Last 6 months)</h3>
            <div style={styles.chartWrap}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="#007bff"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.mobileNote}>Note: Data shown is sample/dummy.</div>
          </motion.div>

          <div style={styles.footerSpace} />
        </main>
      </div>

      {/* Simple CSS for responsive grid columns */}
      <style>{`
        @media (max-width: 1024px) {
          .cardsGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 720px) {
          .cardsGrid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
