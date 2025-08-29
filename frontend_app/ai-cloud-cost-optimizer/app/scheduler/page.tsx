"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { addMinutes, format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

// Types and validation schema
const services = [
  { id: "payments-api", label: "payments-api" },
  { id: "etl-worker", label: "etl-worker" },
  { id: "batch-cron", label: "batch-cron" },
  { id: "preview-env", label: "preview-env" }
];

const ruleSchema = z
  .object({
    service: z.string().min(1, "Please select a service."),
    start: z.string().min(5, "Start time is required."),
    stop: z.string().min(5, "Stop time is required.")
  })
  .refine(
    (val) => {
      // simple HH:mm compare
      return val.start < val.stop;
    },
    {
      message: "Stop time must be later than start time.",
      path: ["stop"]
    }
  );

type RuleForm = z.infer<typeof ruleSchema>;

type Rule = {
  id: string;
  service: string;
  start: string; // HH:mm
  stop: string; // HH:mm
};

// Zustand store for rules
type RuleState = {
  rules: Rule[];
  addRule: (rule: Omit<Rule, "id">) => void;
  removeRule: (id: string) => void;
};

// PUBLIC_INTERFACE
export const useRuleStore = create<RuleState>((set) => ({
  /** This is a public store that manages scheduling rules locally. */
  rules: [
    { id: "r-1", service: "payments-api", start: "08:00", stop: "18:00" },
    { id: "r-2", service: "etl-worker", start: "02:00", stop: "05:00" },
    { id: "r-3", service: "preview-env", start: "09:30", stop: "17:30" }
  ],
  addRule: (rule) =>
    set((state) => ({
      rules: [{ id: `r-${Date.now()}`, ...rule }, ...state.rules]
    })),
  removeRule: (id) =>
    set((state) => ({
      rules: state.rules.filter((r) => r.id !== id)
    }))
}));

// Helpers
function toHHMM(date: Date) {
  return format(date, "HH:mm");
}

function fromHHMM(value: string): Date {
  const [h, m] = value.split(":").map((x) => parseInt(x, 10));
  const d = new Date();
  d.setHours(h);
  d.setMinutes(m);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}

// PUBLIC_INTERFACE
export default function SchedulerPage() {
  /**
   * This page provides a form to schedule start/stop times for services
   * and displays existing rules in a table. Validation uses zod + react-hook-form.
   */

  const addDefaultStop = useMemo(() => {
    const now = new Date();
    return toHHMM(addMinutes(now, 60));
  }, []);

  const { rules, addRule, removeRule } = useRuleStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<RuleForm>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      service: "",
      start: toHHMM(new Date()),
      stop: addDefaultStop
    }
  });

  const onSubmit = (data: RuleForm) => {
    addRule({ service: data.service, start: data.start, stop: data.stop });
    reset({
      service: "",
      start: toHHMM(new Date()),
      stop: addDefaultStop
    });
  };

  // Simple shadcn-like time input picker with increment/decrement
  function TimePicker({
    label,
    value,
    onChange,
    id
  }: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    id: string;
  }) {
    const [local, setLocal] = useState<string>(value);

    useEffect(() => {
      setLocal(value);
    }, [value]);

    const apply = (next: string) => {
      setLocal(next);
      onChange(next);
    };

    const bump = (mins: number) => {
      const d = fromHHMM(local);
      const next = toHHMM(addMinutes(d, mins));
      apply(next);
    };

    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <div className="flex items-center gap-2">
          <Input
            id={id}
            type="time"
            className="w-[160px]"
            value={local}
            onChange={(e) => apply(e.target.value)}
          />
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={`Decrease ${label} by 15 minutes`}
              onClick={() => bump(-15)}
            >
              -15m
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={`Increase ${label} by 15 minutes`}
              onClick={() => bump(15)}
            >
              +15m
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Wire time pickers to react-hook-form via watch/setValue
  const startValue = watch("start");
  const stopValue = watch("stop");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Scheduler</h2>
        <p className="text-sm text-muted-foreground">
          Create start/stop schedules for services. State is local via Zustand.
        </p>
      </div>

      {/* Form */}
      <form
        className="rounded-lg border bg-card p-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="grid gap-6 md:grid-cols-3">
          {/* Service Select (shadcn style wrapper) */}
          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Select
              id="service"
              aria-label="Service"
              {...register("service")}
              defaultValue=""
            >
              <option value="" disabled>
                Select a service...
              </option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </Select>
            {errors.service && (
              <p className="text-sm text-red-600">{errors.service.message}</p>
            )}
          </div>

          {/* Start Time */}
          <div className="space-y-2">
            <TimePicker
              id="start"
              label="Start Time"
              value={startValue}
              onChange={(v) => setValue("start", v, { shouldValidate: true })}
            />
            {errors.start && (
              <p className="text-sm text-red-600">{errors.start.message}</p>
            )}
          </div>

          {/* Stop Time */}
          <div className="space-y-2">
            <TimePicker
              id="stop"
              label="Stop Time"
              value={stopValue}
              onChange={(v) => setValue("stop", v, { shouldValidate: true })}
            />
            {errors.stop && (
              <p className="text-sm text-red-600">{errors.stop.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button type="submit" disabled={isSubmitting}>
            <Plus size={16} />
            Add Rule
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              reset({
                service: "",
                start: toHHMM(new Date()),
                stop: addDefaultStop
              })
            }
          >
            Reset
          </Button>
        </div>
      </form>

      {/* Rules Table */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-4">
          <div>
            <h3 className="text-base font-semibold">Scheduled Rules</h3>
            <p className="text-sm text-muted-foreground">
              Mock data plus newly added entries
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-t">
            <thead className="bg-muted/40 text-sm">
              <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left">
                <th>Service</th>
                <th>Start</th>
                <th>Stop</th>
                <th className="w-[100px]">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rules.map((r) => (
                <tr key={r.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{r.service}</td>
                  <td className="px-4 py-3">{r.start}</td>
                  <td className="px-4 py-3">{r.stop}</td>
                  <td className="px-4 py-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeRule(r.id)}
                      aria-label={`Remove rule for ${r.service}`}
                    >
                      <Trash2 size={14} />
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
              {rules.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-muted-foreground"
                    colSpan={4}
                  >
                    No rules yet. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
