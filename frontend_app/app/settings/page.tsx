"use client";
import React from "react";

/**
 * Settings Page
 * - Title: "Settings"
 * - 3 sections with subtle framer-motion animations:
 *   1) Profile Settings: Name, Email, Avatar upload
 *   2) Cloud Provider Settings: Provider dropdown (AWS, Azure, GCP), API Key, Secret Key
 *   3) Notifications: Switches (Email Alerts, SMS Alerts, In-App Alerts)
 * - Uses shadcn/ui-like Switch, Input, and Button styles (no hard dependency).
 * - On Save: console.log formData to the console.
 *
 * Notes:
 * - We lazy-require framer-motion and provide a no-op fallback if it's not installed yet,
 *   so the page can still render within this template.
 */

// Lazy import to keep compatibility if dependencies aren't installed yet.
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

// Simple "shadcn-like" primitive components using inline styles that align with theme vars.
// In a real shadcn/ui setup, you would import Switch, Input, Button, etc. directly.

// PUBLIC_INTERFACE
export default function SettingsPage() {
  /** Entry for Settings page with form state and animated sections. */

  // Local form state
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);

  const [provider, setProvider] = React.useState<"AWS" | "Azure" | "GCP" | "">("");
  const [apiKey, setApiKey] = React.useState("");
  const [secretKey, setSecretKey] = React.useState("");

  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [smsAlerts, setSmsAlerts] = React.useState(false);
  const [inAppAlerts, setInAppAlerts] = React.useState(true);

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
      maxWidth: 960,
      width: "100%",
      margin: "0 auto",
    },
    title: {
      margin: 0,
      fontSize: 26,
      fontWeight: 800,
      marginBottom: 16,
    },
    section: {
      border: "1px solid var(--border-color)",
      background: "var(--bg-primary)",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
      marginBottom: 16,
    },
    sectionTitle: {
      margin: 0,
      fontSize: 16,
      fontWeight: 800,
      marginBottom: 12,
    },
    grid2: {
      display: "grid",
      gap: 14,
      gridTemplateColumns: "1fr 1fr",
    } as React.CSSProperties,
    field: {
      display: "grid",
      gap: 6,
    },
    label: {
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: 0.2,
    },
    input: {
      padding: "12px 14px",
      borderRadius: 10,
      border: "1px solid var(--border-color)",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
      outline: "none",
    },
    select: {
      padding: "12px 14px",
      borderRadius: 10,
      border: "1px solid var(--border-color)",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
      outline: "none",
    },
    fileInputWrap: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
    },
    fileName: {
      fontSize: 13,
      color: "var(--text-secondary)",
    },
    switches: {
      display: "grid",
      gap: 10,
    },
    switchRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 12px",
      border: "1px solid var(--border-color)",
      borderRadius: 10,
      background: "var(--bg-secondary)",
    },
    switchLabel: {
      display: "grid",
      gap: 4,
    },
    hint: {
      fontSize: 12,
      color: "var(--text-secondary)",
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: 12,
    },
    button: {
      padding: "12px 16px",
      borderRadius: 10,
      border: "none",
      background: "var(--button-bg)",
      color: "var(--button-text)",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 6px 16px rgba(0, 123, 255, 0.25)",
    },
    switch: {
      // Visual approximation of shadcn Switch
      width: 44,
      height: 26,
      borderRadius: 999,
      background: "rgba(255,255,255,0.2)",
      border: "1px solid var(--border-color)",
      position: "relative",
      transition: "all 0.2s ease",
      flex: "0 0 auto",
    } as React.CSSProperties,
    switchKnob: {
      position: "absolute",
      top: 2,
      left: 2,
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: "#fff",
      transition: "transform 0.2s ease",
      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    },
  };

  // Focus outline helper for inputs/selects
  const focusProps = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      (e.currentTarget as HTMLElement).style.boxShadow =
        "0 0 0 4px rgba(0,123,255,0.15)";
      (e.currentTarget as HTMLElement).style.border =
        "1px solid rgba(0,123,255,0.6)";
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      (e.currentTarget as HTMLElement).style.boxShadow = "none";
      (e.currentTarget as HTMLElement).style.border =
        "1px solid var(--border-color)";
    },
  };

  // Tiny Switch component to emulate shadcn/ui behavior
  const Switch = ({
    checked,
    onCheckedChange,
    "aria-label": ariaLabel,
  }: {
    checked: boolean;
    onCheckedChange: (val: boolean) => void;
    "aria-label"?: string;
  }) => (
    <div
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCheckedChange(!checked);
        }
      }}
      onClick={() => onCheckedChange(!checked)}
      style={{
        ...styles.switch,
        background: checked ? "rgba(0,123,255,0.5)" : "rgba(255,255,255,0.12)",
        border: checked
          ? "1px solid rgba(0,123,255,0.6)"
          : "1px solid var(--border-color)",
      }}
    >
      <span
        style={{
          ...styles.switchKnob,
          transform: checked ? "translateX(18px)" : "translateX(0)",
        }}
      />
    </div>
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      profile: {
        name,
        email,
        avatarName: avatarFile?.name ?? null,
      },
      cloudProvider: {
        provider,
        apiKey,
        secretKey,
      },
      notifications: {
        emailAlerts,
        smsAlerts,
        inAppAlerts,
      },
    };
    // eslint-disable-next-line no-console
    console.log("Settings formData", formData);
  };

  return (
    <div style={styles.page} aria-label="settings-page">
      {/* Top Nav */}
      <div style={styles.navbar}>
        <div style={styles.logo} aria-label="navbar-logo">
          <span style={styles.brandDot} />
          <span>KAVIA</span>
        </div>
        <div style={styles.logo}>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Settings
          </span>
        </div>
      </div>

      <main style={styles.container}>
        <h1 style={styles.title}>Settings</h1>

        <form onSubmit={handleSave}>
          {/* Profile Settings */}
          <motion.div
            style={styles.section}
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <h3 style={styles.sectionTitle}>Profile Settings</h3>
            <div style={styles.grid2}>
              <div style={styles.field}>
                <label htmlFor="name" style={styles.label}>
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                  {...focusProps}
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="email" style={styles.label}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  {...focusProps}
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="avatar" style={styles.label}>
                  Avatar
                </label>
                <div style={styles.fileInputWrap}>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setAvatarFile(file);
                    }}
                    style={styles.input}
                  />
                  <span style={styles.fileName}>
                    {avatarFile ? avatarFile.name : "No file chosen"}
                  </span>
                </div>
                <span style={styles.hint}>Upload a square image for best results.</span>
              </div>
            </div>
          </motion.div>

          {/* Cloud Provider Settings */}
          <motion.div
            style={styles.section}
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
          >
            <h3 style={styles.sectionTitle}>Cloud Provider Settings</h3>
            <div style={styles.grid2}>
              <div style={styles.field}>
                <label htmlFor="provider" style={styles.label}>
                  Provider
                </label>
                <select
                  id="provider"
                  value={provider}
                  onChange={(e) =>
                    setProvider(e.target.value as "AWS" | "Azure" | "GCP" | "")
                  }
                  style={styles.select}
                  {...focusProps}
                >
                  <option value="">Select provider</option>
                  <option value="AWS">AWS</option>
                  <option value="Azure">Azure</option>
                  <option value="GCP">GCP</option>
                </select>
              </div>

              <div style={styles.field}>
                <label htmlFor="apiKey" style={styles.label}>
                  API Key
                </label>
                <input
                  id="apiKey"
                  type="text"
                  placeholder="Enter API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={styles.input}
                  {...focusProps}
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="secretKey" style={styles.label}>
                  Secret Key
                </label>
                <input
                  id="secretKey"
                  type="password"
                  placeholder="Enter Secret Key"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  style={styles.input}
                  {...focusProps}
                />
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            style={styles.section}
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
          >
            <h3 style={styles.sectionTitle}>Notifications</h3>
            <div style={styles.switches}>
              <div style={styles.switchRow}>
                <div style={styles.switchLabel}>
                  <span>Email Alerts</span>
                  <span style={styles.hint}>Receive notifications via email.</span>
                </div>
                <Switch
                  aria-label="Email Alerts"
                  checked={emailAlerts}
                  onCheckedChange={setEmailAlerts}
                />
              </div>

              <div style={styles.switchRow}>
                <div style={styles.switchLabel}>
                  <span>SMS Alerts</span>
                  <span style={styles.hint}>Get critical alerts to your phone.</span>
                </div>
                <Switch
                  aria-label="SMS Alerts"
                  checked={smsAlerts}
                  onCheckedChange={setSmsAlerts}
                />
              </div>

              <div style={styles.switchRow}>
                <div style={styles.switchLabel}>
                  <span>In-App Alerts</span>
                  <span style={styles.hint}>Show notifications inside the app.</span>
                </div>
                <Switch
                  aria-label="In-App Alerts"
                  checked={inAppAlerts}
                  onCheckedChange={setInAppAlerts}
                />
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div style={styles.actions}>
            <motion.button
              type="submit"
              style={styles.button}
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
            >
              Save Changes
            </motion.button>
          </div>
        </form>
      </main>

      {/* Responsive tweak for 2-column grid */}
      <style>{`
        @media (max-width: 860px) {
          .grid2, [style*="grid-template-columns: 1fr 1fr"] {
            display: grid;
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }
      `}</style>
    </div>
  );
}
