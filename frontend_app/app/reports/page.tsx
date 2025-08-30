"use client";
import React from "react";

/**
 * Reports & Insights page
 * - Title and subtext
 * - Line chart for Monthly Cloud Spend (Jan–Aug)
 * - Pie chart for Cost by Service (EC2, S3, RDS, Lambda)
 * - "Total Saved by AI Optimizer" card (shadcn/ui-like card styling)
 * - Subtle framer-motion animations for cards
 *
 * Notes:
 * - Uses lazy require with fallbacks for framer-motion and recharts to avoid build errors if deps aren't installed yet.
 * - Designed to respect dark mode using project CSS variables defined in src/App.css.
 */

// Lazy import of framer-motion (with fallback shim)
let motion: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  motion = require("framer-motion").motion;
} catch {
  // Fallback shim if framer-motion isn't available yet
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

// Lazy import of recharts components (with fallbacks)
let Recharts: any = {};
let ResponsiveContainer: any,
  LineChart: any,
  Line: any,
  XAxis: any,
  YAxis: any,
  CartesianGrid: any,
  Tooltip: any,
  PieChart: any,
  Pie: any,
  Cell: any,
  Legend: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Recharts = require("recharts");
  ResponsiveContainer = Recharts.ResponsiveContainer;
  LineChart = Recharts.LineChart;
  Line = Recharts.Line;
  XAxis = Recharts.XAxis;
  YAxis = Recharts.YAxis;
  CartesianGrid = Recharts.CartesianGrid;
  Tooltip = Recharts.Tooltip;
  PieChart = Recharts.PieChart;
  Pie = Recharts.Pie;
  Cell = Recharts.Cell;
  Legend = Recharts.Legend;
} catch {
  const Fallback = ({ children, ...rest }: any) => <div {...rest}>{children}</div>;
  ResponsiveContainer = Fallback;
  LineChart = Fallback;
  Line = Fallback;
  XAxis = Fallback;
  YAxis = Fallback;
  CartesianGrid = Fallback;
  Tooltip = Fallback;
  PieChart = Fallback;
  Pie = Fallback;
  Cell = ({ ...props }: any) => <div {...props} />;
  Legend = Fallback;
}

// Dummy datasets
const monthlySpend = [
  { name: "Jan", cost: 1200 },
  { name: "Feb", cost: 1450 },
  { name: "Mar", cost: 1380 },
  { name: "Apr", cost: 1600 },
  { name: "May", cost: 1720 },
  { name: "Jun", cost: 1680 },
  { name: "Jul", cost: 1820 },
  { name: "Aug", cost: 1900 },
];

const serviceCost = [
  { name: "EC2", value: 800 },
  { name: "S3", value: 300 },
  { name: "RDS", value: 450 },
  { name: "Lambda", value: 200 },
];

const COLORS = ["#007bff", "#61dafb", "#00c853", "#ff8f00"];

// Basic styles aligned to theme vars in src/App.css
const styles: { [k: string]: React.CSSProperties } = {
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
  container: {
    padding: 20,
    maxWidth: 1200,
    width: "100%",
    margin: "0 auto",
  },
  headerBlock: {
    marginBottom: 16,
  },
  title: {
    margin: 0,
    fontSize: 26,
    fontWeight: 800,
  },
  subtitle: {
    marginTop: 6,
    color: "var(--text-secondary)",
    fontSize: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginTop: 12,
  },
  card: {
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    minWidth: 0,
  },
  chartTitle: {
    margin: 0,
    marginBottom: 10,
    fontWeight: 800,
    fontSize: 16,
  },
  chartWrapTall: {
    height: 320,
    width: "100%",
  },
  savedCard: {
    border: "1px solid var(--border-color)",
    background:
      "linear-gradient(180deg, rgba(0,123,255,0.10), rgba(0,123,255,0.04))",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    display: "grid",
    gap: 8,
  },
  savedTitle: {
    margin: 0,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    color: "var(--text-secondary)",
  },
  savedValue: {
    margin: 0,
    fontSize: 28,
    fontWeight: 900,
  },
  savedHint: {
    margin: 0,
    fontSize: 13,
    color: "var(--text-secondary)",
  },
  footerNote: {
    marginTop: 10,
    fontSize: 12,
    color: "var(--text-secondary)",
  },
};

// PUBLIC_INTERFACE
export default function ReportsPage() {
  /** Reports page entry: shows charts and a savings summary card. */

  return (
    <div style={styles.page} aria-label="reports-page">
      {/* Top Nav */}
      <div style={styles.navbar}>
        <div style={styles.logo} aria-label="navbar-logo">
          <span style={styles.brandDot} />
          <span>KAVIA</span>
        </div>
        <div style={styles.logo}>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Reports
          </span>
        </div>
      </div>

      <main style={styles.container}>
        {/* Header */}
        <div style={styles.headerBlock}>
          <h1 style={styles.title}>Reports & Insights</h1>
          <p style={styles.subtitle}>Track cost, usage, and AI savings over time.</p>
        </div>

        {/* Summary Card */}
        <motion.div
          style={styles.savedCard}
          initial={{ opacity: 0, y: 12, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          aria-label="savings-card"
        >
          <p style={styles.savedTitle}>Total Saved by AI Optimizer</p>
          <p style={styles.savedValue}>₹1,500</p>
          <p style={styles.savedHint}>Based on last 30 days of automated actions</p>
        </motion.div>

        {/* Charts */}
        <div style={styles.grid} className="reports-grid">
          {/* Line Chart: Monthly Cloud Spend */}
          <motion.div
            style={styles.card}
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
          >
            <h3 style={styles.chartTitle}>Monthly Cloud Spend (Jan–Aug)</h3>
            <div style={styles.chartWrapTall}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlySpend}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
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
            <div style={styles.footerNote}>Note: Data shown is sample/dummy.</div>
          </motion.div>

          {/* Pie Chart: Cost by Service */}
          <motion.div
            style={styles.card}
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
          >
            <h3 style={styles.chartTitle}>Cost by Service</h3>
            <div style={styles.chartWrapTall}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceCost}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    innerRadius="45%"
                    paddingAngle={2}
                  >
                    {serviceCost.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.footerNote}>
              EC2, S3, RDS, and Lambda distribution (dummy).
            </div>
          </motion.div>
        </div>
      </main>

      {/* Responsive adjustment */}
      <style>{`
        @media (max-width: 960px) {
          .reports-grid { 
            display: grid; 
            grid-template-columns: 1fr; 
            gap: 16px; 
          }
        }
      `}</style>
    </div>
  );
}
