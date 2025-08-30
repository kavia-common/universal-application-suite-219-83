"use client";
import React from "react";

// Lazy import to avoid hard dependency during initial build if packages aren't installed yet.
let RHF: any = {};
let useForm: any, Controller: any;
let zod: any = {};
let zodResolver: any = undefined;
let motion: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  RHF = require("react-hook-form");
  useForm = RHF.useForm;
  Controller = RHF.Controller;
} catch {
  // Fallback no-op shim to render fields without RHF behavior
  useForm = () => ({
    register: () => ({}),
    control: {},
    handleSubmit:
      (fn: any) =>
      (e: any): void => {
        e?.preventDefault?.();
        // eslint-disable-next-line no-console
        console.log("RHF fallback: no validation; not executing submit handler");
      },
    reset: () => {},
    setValue: () => {},
    watch: () => ({}),
    formState: { errors: {}, isSubmitting: false },
  });
  Controller = ({ render }: any) => render({ field: { value: "", onChange: () => {} } });
}

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  zod = require("zod");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const resolvers = require("@hookform/resolvers/zod");
  zodResolver = resolvers.zodResolver;
} catch {
  zod = {
    object: (shape: any) => shape,
    string: () => ({ min: () => ({}) }),
    enum: () => ({}),
    boolean: () => ({}),
  };
  zodResolver = (_schema: any) => (values: any) => ({ values, errors: {} });
}

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  motion = require("framer-motion").motion;
} catch {
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

// Helpers and types
const SERVICES = ["EC2", "S3", "RDS", "Lambda"] as const;

type ServiceName = (typeof SERVICES)[number];

type RepeatOptions = {
  daily: boolean;
  weekly: boolean;
  weekends: boolean;
};

type ScheduleItem = {
  id: string;
  service: ServiceName;
  startTime: string; // "HH:MM"
  stopTime: string; // "HH:MM"
  repeat: RepeatOptions;
};

// Validation schema using Zod (if available)
const ScheduleSchema =
  zod?.object?.({
    service: zod?.enum ? zod.enum(SERVICES as unknown as [ServiceName, ...ServiceName[]]) : undefined,
    startTime: zod?.string?.().min ? zod.string().min(1, "Start time is required") : undefined,
    stopTime: zod?.string?.().min ? zod.string().min(1, "Stop time is required") : undefined,
    daily: zod?.boolean ? zod.boolean().optional() : undefined,
    weekly: zod?.boolean ? zod.boolean().optional() : undefined,
    weekends: zod?.boolean ? zod.boolean().optional() : undefined,
  }) ?? {};

// Basic styles aligned with project theme variables
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
  headerBlock: {
    marginBottom: 16,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
  },
  subtitle: {
    marginTop: 6,
    color: "var(--text-secondary)",
    fontSize: 14,
  },
  card: {
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    marginBottom: 18,
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  field: {
    display: "grid",
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 0.2,
  },
  select: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid var(--border-color)",
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    outline: "none",
  },
  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid var(--border-color)",
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    outline: "none",
  },
  checkboxRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
  },
  checkboxItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    border: "1px solid var(--border-color)",
    borderRadius: 10,
    background: "var(--bg-secondary)",
  },
  actionsRow: {
    gridColumn: "1 / -1",
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
    marginTop: 4,
  },
  buttonPrimary: {
    padding: "12px 16px",
    borderRadius: 10,
    border: "none",
    background: "var(--button-bg)",
    color: "var(--button-text)",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(0, 123, 255, 0.25)",
  },
  errorText: {
    color: "#e53935",
    fontSize: 12,
  },
  tableWrap: {
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
    borderRadius: 12,
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  } as React.CSSProperties,
  th: {
    textAlign: "left",
    padding: "12px 14px",
    borderBottom: "1px solid var(--border-color)",
    fontSize: 13,
    color: "var(--text-secondary)",
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid var(--border-color)",
    fontSize: 14,
  },
  rowActions: {
    display: "flex",
    gap: 8,
  },
  editBtn: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid var(--border-color)",
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid rgba(229, 57, 53, 0.35)",
    background: "rgba(229, 57, 53, 0.08)",
    color: "#e53935",
    cursor: "pointer",
  },
};

// PUBLIC_INTERFACE
export default function SchedulerPage() {
  /**
   * Service Scheduler Page
   * - Title and subtext
   * - Form with react-hook-form + zod:
   *   Service dropdown, start/stop time, repeat checkboxes
   * - On submit: console.log form data and append to in-memory table
   * - Table below uses simple shadcn-like styles and framer-motion row animations
   * - Edit/Delete actions for rows
   */

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver ? zodResolver(ScheduleSchema) : undefined,
    defaultValues: {
      service: "" as ServiceName | "",
      startTime: "",
      stopTime: "",
      daily: false,
      weekly: false,
      weekends: false,
    },
    mode: "onBlur",
  });

  const [items, setItems] = React.useState<ScheduleItem[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const onSubmit = (data: any) => {
    // eslint-disable-next-line no-console
    console.log("Schedule form data", data);
    const payload: ScheduleItem = {
      id: editingId ?? Math.random().toString(36).slice(2),
      service: (data.service || "EC2") as ServiceName,
      startTime: data.startTime,
      stopTime: data.stopTime,
      repeat: {
        daily: !!data.daily,
        weekly: !!data.weekly,
        weekends: !!data.weekends,
      },
    };

    if (editingId) {
      setItems((prev) => prev.map((r) => (r.id === editingId ? payload : r)));
      setEditingId(null);
    } else {
      setItems((prev) => [payload, ...prev]);
    }

    reset({
      service: "" as ServiceName | "",
      startTime: "",
      stopTime: "",
      daily: false,
      weekly: false,
      weekends: false,
    });
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    reset({
      service: item.service,
      startTime: item.startTime,
      stopTime: item.stopTime,
      daily: item.repeat.daily,
      weekly: item.repeat.weekly,
      weekends: item.repeat.weekends,
    });
    // Scroll to top to view the form
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Focus styles for inputs
  const inputFocusProps = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 4px rgba(0,123,255,0.15)";
      (e.currentTarget as HTMLElement).style.border = "1px solid rgba(0,123,255,0.6)";
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      (e.currentTarget as HTMLElement).style.boxShadow = "none";
      (e.currentTarget as HTMLElement).style.border = "1px solid var(--border-color)";
    },
  };

  return (
    <div style={styles.page} aria-label="scheduler-page">
      {/* Top Nav */}
      <div style={styles.navbar}>
        <div style={styles.logo} aria-label="navbar-logo">
          <span style={styles.brandDot} />
          <span>KAVIA</span>
        </div>
        <div style={styles.logo}>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Scheduler</span>
        </div>
      </div>

      <main style={styles.container}>
        {/* Header */}
        <div style={styles.headerBlock}>
          <h1 style={styles.title}>Service Scheduler</h1>
          <p style={styles.subtitle}>
            Configure start/stop times for your cloud services and set repeat options.
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          style={styles.card}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <form style={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Service Name */}
            <div style={styles.field}>
              <label htmlFor="service" style={styles.label}>
                Service Name
              </label>
              <select
                id="service"
                aria-label="service"
                {...register("service")}
                style={styles.select}
                {...inputFocusProps}
              >
                <option value="">Select a service</option>
                {SERVICES.map((svc) => (
                  <option key={svc} value={svc}>
                    {svc}
                  </option>
                ))}
              </select>
              {errors?.service && (
                <span role="alert" style={styles.errorText}>
                  {(errors.service as any)?.message ?? "Please select a service"}
                </span>
              )}
            </div>

            {/* Start Time */}
            <div style={styles.field}>
              <label htmlFor="startTime" style={styles.label}>
                Start Time
              </label>
              <input
                id="startTime"
                type="time"
                aria-label="start time"
                {...register("startTime")}
                style={styles.input}
                {...inputFocusProps}
              />
              {errors?.startTime && (
                <span role="alert" style={styles.errorText}>
                  {(errors.startTime as any)?.message ?? "Start time is required"}
                </span>
              )}
            </div>

            {/* Stop Time */}
            <div style={styles.field}>
              <label htmlFor="stopTime" style={styles.label}>
                Stop Time
              </label>
              <input
                id="stopTime"
                type="time"
                aria-label="stop time"
                {...register("stopTime")}
                style={styles.input}
                {...inputFocusProps}
              />
              {errors?.stopTime && (
                <span role="alert" style={styles.errorText}>
                  {(errors.stopTime as any)?.message ?? "Stop time is required"}
                </span>
              )}
            </div>

            {/* Repeat Options */}
            <div style={styles.field}>
              <label style={styles.label}>Repeat</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxItem}>
                  <input type="checkbox" {...register("daily")} />
                  Daily
                </label>
                <label style={styles.checkboxItem}>
                  <input type="checkbox" {...register("weekly")} />
                  Weekly
                </label>
                <label style={styles.checkboxItem}>
                  <input type="checkbox" {...register("weekends")} />
                  Weekends
                </label>
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actionsRow}>
              <motion.button
                type="submit"
                style={styles.buttonPrimary}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {editingId ? "Update Schedule" : "Add Schedule"}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Table Card */}
        <motion.div
          style={styles.tableWrap}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <table style={styles.table} aria-label="schedules-table">
            <thead>
              <tr>
                <th style={styles.th}>Service</th>
                <th style={styles.th}>Start</th>
                <th style={styles.th}>Stop</th>
                <th style={styles.th}>Repeat</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan={5}>
                    No schedules yet. Add one above.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <td style={styles.td}>{item.service}</td>
                    <td style={styles.td}>{item.startTime}</td>
                    <td style={styles.td}>{item.stopTime}</td>
                    <td style={styles.td}>
                      {[
                        item.repeat.daily ? "Daily" : null,
                        item.repeat.weekly ? "Weekly" : null,
                        item.repeat.weekends ? "Weekends" : null,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.rowActions}>
                        <button
                          type="button"
                          style={styles.editBtn}
                          onClick={() => handleEdit(item)}
                          aria-label={`Edit schedule ${item.id}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(item.id)}
                          aria-label={`Delete schedule ${item.id}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </main>
    </div>
  );
}
