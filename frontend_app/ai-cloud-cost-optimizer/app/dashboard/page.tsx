"use client";

import { motion } from "framer-motion";
import { TrendingDown, Bell, Server, Hourglass } from "lucide-react";
import { useMemo } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
  CartesianGrid
} from "recharts";

import { Button } from "@/components/ui/button";

// PUBLIC_INTERFACE
export default function DashboardPage() {
  /** Dashboard page showing animated metric cards and a data table with tiny inline charts. */

  const metrics = [
    { label: "Active Services", value: 42, icon: Server, accent: "text-blue-600 dark:text-blue-400" },
    { label: "Idle Instances", value: 7, icon: Hourglass, accent: "text-amber-600 dark:text-amber-400" },
    { label: "Monthly Savings", value: "$1,240", icon: TrendingDown, accent: "text-emerald-600 dark:text-emerald-400" },
    { label: "Alerts", value: 3, icon: Bell, accent: "text-red-600 dark:text-red-400" }
  ];

  const tableData = useMemo(
    () => [
      {
        name: "payments-api",
        status: "running",
        costHr: 1.73,
        lastActive: "5m ago",
        spark: [1.2, 1.3, 1.1, 1.4, 1.6, 1.55, 1.73]
      },
      {
        name: "batch-cron",
        status: "idle",
        costHr: 0.0,
        lastActive: "3h ago",
        spark: [0.2, 0.2, 0.15, 0.1, 0.0, 0.0, 0.0]
      },
      {
        name: "etl-worker",
        status: "running",
        costHr: 2.85,
        lastActive: "2m ago",
        spark: [2.2, 2.4, 2.35, 2.6, 2.75, 2.8, 2.85]
      },
      {
        name: "preview-env",
        status: "stopped",
        costHr: 0.0,
        lastActive: "1d ago",
        spark: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
      }
    ],
    []
  );

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 24 } }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Service activity, costs, and alerts overview</p>
      </div>

      {/* Metric cards */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {metrics.map((m) => (
          <motion.div
            key={m.label}
            variants={cardVariants}
            className="rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <div className="flex items-center gap-3 p-4">
              <span className={`rounded-md border p-2 ${m.accent}`}>
                <m.icon size={18} />
              </span>
              <div className="flex flex-1 items-end justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{m.label}</div>
                  <div className="text-xl font-semibold">{m.value}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Data table */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-4">
          <div>
            <h3 className="text-base font-semibold">Services</h3>
            <p className="text-sm text-muted-foreground">Current status and cost per hour</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Export</Button>
            <Button size="sm">Optimize</Button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-t">
            <thead className="bg-muted/40 text-sm">
              <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left">
                <th>Service Name</th>
                <th>Status</th>
                <th>Cost/hr</th>
                <th>Last Active</th>
                <th className="min-w-[160px]">Trend</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {tableData.map((row) => (
                <tr key={row.name} className="border-t hover:bg-muted/30">
                  <td className="[&>div]:py-3 px-4">
                    <div className="font-medium">{row.name}</div>
                    <div className="text-xs text-muted-foreground">prod-us-central</div>
                  </td>
                  <td className="px-4">
                    <span
                      className={[
                        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs",
                        row.status === "running"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : row.status === "idle"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-gray-500/30 bg-gray-500/10 text-muted-foreground"
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "h-1.5 w-1.5 rounded-full",
                          row.status === "running"
                            ? "bg-emerald-500"
                            : row.status === "idle"
                            ? "bg-amber-500"
                            : "bg-gray-400"
                        ].join(" ")}
                      />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 font-medium">${row.costHr.toFixed(2)}</td>
                  <td className="px-4 text-muted-foreground">{row.lastActive}</td>
                  <td className="px-4">
                    <TinySparkline data={row.spark} color={row.status === "running" ? "#10b981" : "#9ca3af"} />
                  </td>
                  <td className="px-4">
                    <div className="flex gap-2 py-2">
                      <Button size="sm" variant="outline">Details</Button>
                      <Button size="sm" variant={row.status === "running" ? "secondary" : "default"}>
                        {row.status === "running" ? "Scale Down" : "Start"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TinySparkline({ data, color = "#6366f1" }: { data: number[]; color?: string }) {
  // Minimal, responsive sparkline with grid and tooltip for quick glance trends
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-16 w-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.25} />
          <XAxis dataKey="i" hide />
          <YAxis domain={["dataMin - 0.1", "dataMax + 0.1"]} hide />
          <Tooltip
            cursor={{ stroke: color, strokeWidth: 1, opacity: 0.2 }}
            contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }}
            labelFormatter={() => ""}
            formatter={(value) => [`$${Number(value).toFixed(2)}/hr`, "Cost"]}
          />
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
