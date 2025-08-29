"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Validation schema using zod
const settingsSchema = z.object({
  awsApiKey: z.string().min(1, "AWS API key is required."),
  awsSecret: z.string().min(1, "AWS Secret is required."),
  azureApiKey: z.string().min(1, "Azure API key is required."),
  azureSecret: z.string().min(1, "Azure Secret is required."),
  gcpApiKey: z.string().min(1, "GCP API key is required."),
  gcpSecret: z.string().min(1, "GCP Secret is required."),
  notifyEmail: z.boolean().default(false),
  notifySlack: z.boolean().default(false)
});

type SettingsForm = z.infer<typeof settingsSchema>;

// PUBLIC_INTERFACE
export default function SettingsPage() {
  /** Settings page to connect cloud providers and configure notifications.
   * Uses react-hook-form + zod validation and shadcn/Tailwind styles.
   */

  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({
    type: "idle"
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      awsApiKey: "",
      awsSecret: "",
      azureApiKey: "",
      azureSecret: "",
      gcpApiKey: "",
      gcpSecret: "",
      notifyEmail: true,
      notifySlack: false
    }
  });

  const onSubmit = async (data: SettingsForm) => {
    // For now, emulate saving locally
    try {
      setStatus({ type: "idle" });
      await new Promise((r) => setTimeout(r, 600)); // mock network delay
      // You could POST to an API here.
      setStatus({ type: "success", message: "Settings saved successfully." });
    } catch (e) {
      setStatus({ type: "error", message: "Failed to save settings. Please try again." });
    }
  };

  const notifyEmail = watch("notifyEmail");
  const notifySlack = watch("notifySlack");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Connect your cloud providers and configure notification preferences.
        </p>
      </div>

      <form
        className="space-y-8 rounded-lg border bg-card p-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Providers */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold">Cloud Providers</h3>
          <p className="text-sm text-muted-foreground">
            Enter API credentials for AWS, Azure, and GCP.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {/* AWS */}
            <div className="col-span-3 space-y-4 rounded-md border p-4 md:col-span-1">
              <h4 className="font-medium">AWS</h4>
              <div className="space-y-2">
                <Label htmlFor="awsApiKey">API Key</Label>
                <Input
                  id="awsApiKey"
                  placeholder="AWS API Key"
                  {...register("awsApiKey")}
                  aria-invalid={!!errors.awsApiKey}
                />
                {errors.awsApiKey && (
                  <p className="text-sm text-red-600">{errors.awsApiKey.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="awsSecret">Secret</Label>
                <Input
                  id="awsSecret"
                  type="password"
                  placeholder="AWS Secret"
                  {...register("awsSecret")}
                  aria-invalid={!!errors.awsSecret}
                />
                {errors.awsSecret && (
                  <p className="text-sm text-red-600">{errors.awsSecret.message}</p>
                )}
              </div>
            </div>

            {/* Azure */}
            <div className="col-span-3 space-y-4 rounded-md border p-4 md:col-span-1">
              <h4 className="font-medium">Azure</h4>
              <div className="space-y-2">
                <Label htmlFor="azureApiKey">API Key</Label>
                <Input
                  id="azureApiKey"
                  placeholder="Azure API Key"
                  {...register("azureApiKey")}
                  aria-invalid={!!errors.azureApiKey}
                />
                {errors.azureApiKey && (
                  <p className="text-sm text-red-600">{errors.azureApiKey.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="azureSecret">Secret</Label>
                <Input
                  id="azureSecret"
                  type="password"
                  placeholder="Azure Secret"
                  {...register("azureSecret")}
                  aria-invalid={!!errors.azureSecret}
                />
                {errors.azureSecret && (
                  <p className="text-sm text-red-600">{errors.azureSecret.message}</p>
                )}
              </div>
            </div>

            {/* GCP */}
            <div className="col-span-3 space-y-4 rounded-md border p-4 md:col-span-1">
              <h4 className="font-medium">GCP</h4>
              <div className="space-y-2">
                <Label htmlFor="gcpApiKey">API Key</Label>
                <Input
                  id="gcpApiKey"
                  placeholder="GCP API Key"
                  {...register("gcpApiKey")}
                  aria-invalid={!!errors.gcpApiKey}
                />
                {errors.gcpApiKey && (
                  <p className="text-sm text-red-600">{errors.gcpApiKey.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gcpSecret">Secret</Label>
                <Input
                  id="gcpSecret"
                  type="password"
                  placeholder="GCP Secret"
                  {...register("gcpSecret")}
                  aria-invalid={!!errors.gcpSecret}
                />
                {errors.gcpSecret && (
                  <p className="text-sm text-red-600">{errors.gcpSecret.message}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Choose how you want to be notified about events and alerts.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-md border p-4">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Receive important updates via email.
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  {...register("notifyEmail")}
                />
                <div
                  className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all
                    peer-checked:bg-primary peer-checked:after:translate-x-5 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring"
                  aria-hidden="true"
                />
                <span className="sr-only">Toggle email notifications</span>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-md border p-4">
              <div>
                <div className="font-medium">Slack Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Get alerts directly in Slack channels.
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  {...register("notifySlack")}
                />
                <div
                  className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all
                    peer-checked:bg-primary peer-checked:after:translate-x-5 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring"
                  aria-hidden="true"
                />
                <span className="sr-only">Toggle Slack notifications</span>
              </label>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Email: {notifyEmail ? "On" : "Off"} · Slack: {notifySlack ? "On" : "Off"}
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              reset({
                awsApiKey: "",
                awsSecret: "",
                azureApiKey: "",
                azureSecret: "",
                gcpApiKey: "",
                gcpSecret: "",
                notifyEmail: true,
                notifySlack: false
              })
            }
          >
            Reset
          </Button>
          {status.type === "success" && (
            <span className="text-sm text-emerald-600">{status.message}</span>
          )}
          {status.type === "error" && (
            <span className="text-sm text-red-600">{status.message}</span>
          )}
        </div>
      </form>
    </div>
  );
}
