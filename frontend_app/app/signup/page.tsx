import React from "react";

// Since this project uses a lightweight CRA template, we build a self-contained,
// modern, animated signup form component that can be mounted by a router or used
// standalone if imported. It uses react-hook-form with Zod for validation and
// framer-motion for subtle motion effects. If these dependencies are not yet
// installed, please add: react-hook-form, zod, @hookform/resolvers, framer-motion.

// PUBLIC_INTERFACE
export default function SignupPage() {
  /** 
   * This component renders a "Create an Account" form with Name, Email, Password,
   * and Confirm Password fields. It validates via Zod and logs the submitted data.
   * It includes subtle motion effects and a link to the Login page.
   */

  // Lazy-require to avoid immediate import errors if dependencies are not installed yet.
  const { useForm } = require("react-hook-form");
  const { z } = require("zod");
  const { zodResolver } = require("@hookform/resolvers/zod");
  const { motion } = require("framer-motion");

  // Validation schema
  const SignupSchema = z
    .object({
      name: z
        .string({ required_error: "Name is required" })
        .min(1, "Name is required"),
      email: z
        .string({ required_error: "Email is required" })
        .email("Please enter a valid email"),
      password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be at least 8 characters"),
      confirmPassword: z
        .string({ required_error: "Confirm your password" })
        .min(8, "Confirm Password must be at least 8 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  type SignupFormData = z.infer<typeof SignupSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: SignupFormData) => {
    // Submit handler as requested
    // eslint-disable-next-line no-console
    console.log("Signup data", data);
  };

  // Basic styles aligned with the project's App.css theme variables
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
      padding: "24px",
    } as React.CSSProperties,
    card: {
      width: "100%",
      maxWidth: 440,
      background: "var(--bg-primary)",
      border: "1px solid var(--border-color)",
      borderRadius: 12,
      padding: "28px 24px",
      boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    } as React.CSSProperties,
    title: {
      margin: 0,
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: 0.2,
      textAlign: "center",
    } as React.CSSProperties,
    subtitle: {
      marginTop: 8,
      marginBottom: 24,
      textAlign: "center",
      color: "var(--text-secondary)",
      fontSize: 14,
    } as React.CSSProperties,
    form: {
      display: "grid",
      gap: 14,
    } as React.CSSProperties,
    field: {
      display: "grid",
      gap: 6,
    } as React.CSSProperties,
    label: {
      fontSize: 14,
      fontWeight: 600,
    } as React.CSSProperties,
    input: {
      padding: "12px 14px",
      borderRadius: 10,
      border: "1px solid var(--border-color)",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
      outline: "none",
      transition: "border 0.2s ease, box-shadow 0.2s ease",
    } as React.CSSProperties,
    errorText: {
      color: "#e53935",
      fontSize: 12,
    } as React.CSSProperties,
    button: {
      marginTop: 4,
      padding: "12px 16px",
      borderRadius: 10,
      border: "none",
      background: "var(--button-bg)",
      color: "var(--button-text)",
      fontWeight: 700,
      cursor: "pointer",
      transition: "transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease",
      boxShadow: "0 6px 16px rgba(0, 123, 255, 0.25)",
    } as React.CSSProperties,
    linkRow: {
      marginTop: 14,
      textAlign: "center",
      fontSize: 14,
    } as React.CSSProperties,
    link: {
      color: "var(--text-secondary)",
      textDecoration: "none",
      fontWeight: 600,
    } as React.CSSProperties,
  };

  const inputFocusProps = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.boxShadow = "0 0 0 4px rgba(0,123,255,0.15)";
      e.currentTarget.style.border = "1px solid rgba(0,123,255,0.6)";
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.border = "1px solid var(--border-color)";
    },
  };

  return (
    <div style={styles.page} aria-label="signup-page">
      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <motion.h1
          style={styles.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
        >
          Create an Account
        </motion.h1>
        <motion.p
          style={styles.subtitle}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.35 }}
        >
          Join us to access your dashboard and more.
        </motion.p>

        <motion.form
          style={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.35 }}
          noValidate
        >
          <div style={styles.field}>
            <label htmlFor="name" style={styles.label}>
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Jane Doe"
              aria-invalid={!!errors.name}
              {...register("name")}
              style={styles.input}
              {...inputFocusProps}
            />
            {errors.name && (
              <span role="alert" style={styles.errorText}>
                {errors.name.message as string}
              </span>
            )}
          </div>

          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="jane@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
              style={styles.input}
              {...inputFocusProps}
            />
            {errors.email && (
              <span role="alert" style={styles.errorText}>
                {errors.email.message as string}
              </span>
            )}
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              {...register("password")}
              style={styles.input}
              {...inputFocusProps}
            />
            {errors.password && (
              <span role="alert" style={styles.errorText}>
                {errors.password.message as string}
              </span>
            )}
          </div>

          <div style={styles.field}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
              style={styles.input}
              {...inputFocusProps}
            />
            {errors.confirmPassword && (
              <span role="alert" style={styles.errorText}>
                {errors.confirmPassword.message as string}
              </span>
            )}
          </div>

          <motion.button
            type="submit"
            style={styles.button}
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </motion.button>
        </motion.form>

        <motion.div
          style={styles.linkRow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.35 }}
        >
          <a href="/login" style={styles.link}>
            Already have an account? Login
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
