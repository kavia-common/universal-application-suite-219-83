"use client";
import React from "react";

/**
 * Profile Page
 * - Displays user avatar, name, email
 * - Editable fields for profile info (name, email, role, bio)
 * - Mock data persisted in localStorage for demo purposes
 * - Responsive layout (single column on mobile, two columns on desktop)
 * - Light, modern styling using theme variables; adheres to provided palette:
 *   primary #1976d2, accent #f50057, secondary #424242
 */

// PUBLIC_INTERFACE
export default function ProfilePage() {
  /** Entry point for the Profile page. Renders profile view and edit form. */

  type Profile = {
    name: string;
    email: string;
    role: string;
    bio: string;
    avatarUrl?: string | null;
  };

  const defaultProfile: Profile = {
    name: "Kishore Kumar",
    email: "kishore@example.com",
    role: "Cloud Engineer",
    bio: "Passionate about building scalable systems and optimizing cloud costs.",
    avatarUrl: null,
  };

  const [profile, setProfile] = React.useState<Profile>(defaultProfile);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  // Load from localStorage (mock persistence)
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("demo-profile");
      if (raw) {
        const parsed = JSON.parse(raw);
        setProfile((p) => ({ ...p, ...parsed }));
      }
    } catch {
      // ignore
    }
  }, []);

  // Handle avatar preview
  React.useEffect(() => {
    if (!avatarFile) {
      setPreviewUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(avatarFile);
  }, [avatarFile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Profile = {
      ...profile,
      avatarUrl: previewUrl ?? profile.avatarUrl ?? null,
    };
    setProfile(payload);
    try {
      localStorage.setItem("demo-profile", JSON.stringify(payload));
    } catch {
      // ignore
    }
    // eslint-disable-next-line no-alert
    alert("Profile saved (mock)!");
  };

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
      maxWidth: 1000,
      width: "100%",
      margin: "0 auto",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 16,
      flexWrap: "wrap",
    },
    title: {
      margin: 0,
      fontSize: 26,
      fontWeight: 800,
    },
    subtitle: {
      margin: 0,
      color: "var(--text-secondary)",
      fontSize: 14,
    },
    grid: {
      display: "grid",
      gap: 16,
      gridTemplateColumns: "320px 1fr",
    } as React.CSSProperties,
    card: {
      border: "1px solid var(--border-color)",
      background: "var(--bg-primary)",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
      minWidth: 0,
    },
    profileTop: {
      display: "grid",
      gap: 12,
      justifyItems: "center",
      textAlign: "center",
    },
    avatarWrap: {
      width: 120,
      height: 120,
      borderRadius: "50%",
      border: "3px solid var(--border-color)",
      background:
        "linear-gradient(135deg, rgba(25,118,210,0.8), rgba(245,0,87,0.6))",
      display: "grid",
      placeItems: "center",
      overflow: "hidden",
    },
    avatarImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    } as React.CSSProperties,
    name: {
      margin: 0,
      fontSize: 20,
      fontWeight: 800,
    },
    email: {
      margin: 0,
      fontSize: 14,
      color: "var(--text-secondary)",
    },
    role: {
      marginTop: 8,
      fontSize: 13,
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid var(--border-color)",
      background: "var(--bg-secondary)",
      display: "inline-block",
    },
    divider: {
      height: 1,
      background: "var(--border-color)",
      margin: "12px 0",
    },
    infoList: {
      display: "grid",
      gap: 8,
      fontSize: 14,
    },
    label: {
      fontSize: 13,
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
    textarea: {
      padding: "12px 14px",
      borderRadius: 10,
      border: "1px solid var(--border-color)",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
      outline: "none",
      minHeight: 120,
      resize: "vertical",
    } as React.CSSProperties,
    fileInput: {
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid var(--border-color)",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
      outline: "none",
      width: "100%",
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: 12,
      gap: 10,
    },
    buttonPrimary: {
      padding: "12px 16px",
      borderRadius: 10,
      border: "none",
      background: "#1976d2", // primary
      color: "#fff",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 6px 16px rgba(25,118,210,0.25)",
    },
    buttonAccent: {
      padding: "12px 16px",
      borderRadius: 10,
      border: "1px solid rgba(245,0,87,0.35)",
      background: "rgba(245,0,87,0.08)",
      color: "#f50057", // accent
      fontWeight: 700,
      cursor: "pointer",
    },
    sectionTitle: {
      margin: 0,
      fontSize: 16,
      fontWeight: 800,
      marginBottom: 12,
    },
    formGrid: {
      display: "grid",
      gap: 14,
      gridTemplateColumns: "1fr 1fr",
    } as React.CSSProperties,
    field: {
      display: "grid",
      gap: 6,
    },
    hint: {
      fontSize: 12,
      color: "var(--text-secondary)",
    },
  };

  // Focus styling for inputs
  const focusProps = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      (e.currentTarget as HTMLElement).style.boxShadow =
        "0 0 0 4px rgba(25,118,210,0.15)";
      (e.currentTarget as HTMLElement).style.border =
        "1px solid rgba(25,118,210,0.6)";
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      (e.currentTarget as HTMLElement).style.boxShadow = "none";
      (e.currentTarget as HTMLElement).style.border =
        "1px solid var(--border-color)";
    },
  };

  return (
    <div style={styles.page} aria-label="profile-page">
      {/* Top Nav */}
      <div style={styles.navbar}>
        <div style={styles.logo} aria-label="navbar-logo">
          <span style={styles.brandDot} />
          <span>KAVIA</span>
        </div>
        <div style={styles.logo}>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Profile
          </span>
        </div>
      </div>

      <main style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Your Profile</h1>
            <p style={styles.subtitle}>
              View and update your personal information.
            </p>
          </div>
          <div className="profile-actions">
            <button
              type="button"
              style={styles.buttonAccent}
              onClick={() => {
                setProfile(defaultProfile);
                setAvatarFile(null);
                setPreviewUrl(null);
                try {
                  localStorage.removeItem("demo-profile");
                } catch {
                  // ignore
                }
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div style={styles.grid} className="profile-grid">
          {/* Left: Profile summary */}
          <section style={styles.card} aria-label="profile-summary">
            <div style={styles.profileTop}>
              <div style={styles.avatarWrap}>
                {previewUrl || profile.avatarUrl ? (
                  <img
                    src={(previewUrl || profile.avatarUrl) as string}
                    alt="avatar"
                    style={styles.avatarImg}
                  />
                ) : (
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: 28 }}>
                    {profile.name
                      .split(" ")
                      .map((s) => s[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                )}
              </div>
              <h2 style={styles.name}>{profile.name}</h2>
              <p style={styles.email}>{profile.email}</p>
              <span style={styles.role}>{profile.role}</span>
            </div>

            <div style={styles.divider} />
            <div style={styles.infoList}>
              <div>
                <span style={styles.label}>About</span>
                <div style={{ marginTop: 6 }}>{profile.bio}</div>
              </div>
            </div>
          </section>

          {/* Right: Edit form */}
          <section style={styles.card} aria-label="profile-edit-form">
            <h3 style={styles.sectionTitle}>Edit Details</h3>
            <form onSubmit={handleSave} noValidate>
              <div style={styles.formGrid} className="form-grid-2">
                <div style={styles.field}>
                  <label htmlFor="name" style={styles.label}>
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, name: e.target.value }))
                    }
                    style={styles.input}
                    {...focusProps}
                    placeholder="Jane Doe"
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="email" style={styles.label}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, email: e.target.value }))
                    }
                    style={styles.input}
                    {...focusProps}
                    placeholder="jane@example.com"
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="role" style={styles.label}>
                    Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    value={profile.role}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, role: e.target.value }))
                    }
                    style={styles.input}
                    {...focusProps}
                    placeholder="Cloud Engineer"
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="avatar" style={styles.label}>
                    Avatar
                  </label>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setAvatarFile(file);
                    }}
                    style={styles.fileInput}
                  />
                  <span style={styles.hint}>
                    Upload a square image for best results.
                  </span>
                </div>

                <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                  <label htmlFor="bio" style={styles.label}>
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, bio: e.target.value }))
                    }
                    style={styles.textarea}
                    {...focusProps}
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>
              </div>

              <div style={styles.actions}>
                <button type="submit" style={styles.buttonPrimary}>
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>

      {/* Responsive helpers for grid collapse */}
      <style>{`
        @media (max-width: 900px) {
          .profile-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .form-grid-2 {
            display: grid;
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
