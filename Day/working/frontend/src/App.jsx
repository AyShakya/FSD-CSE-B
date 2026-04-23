import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ENDPOINTS = {
  login: "/api/auth/login",
  signup: "/api/auth/register",
  users: "/api/users",
};

function formatDate(value) {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function extractErrorMessage(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return "Something went wrong. Please try again.";
}

export default function App() {
  const [mode, setMode] = useState("login");
  const [view, setView] = useState("auth");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isLogin = mode === "login";

  const heading = useMemo(() => {
    return isLogin ? "Login to Your Account" : "Create Your Account";
  }, [isLogin]);

  const subHeading = useMemo(() => {
    return isLogin
      ? "Use your email and password to continue"
      : "Fill the form to register a new account";
  }, [isLogin]);

  const userCountLabel = useMemo(() => {
    return users.length === 1 ? "1 registered user" : `${users.length} registered users`;
  }, [users.length]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetMessages();
    setFormData((prev) => ({
      ...prev,
      password: "",
      confirmPassword: "",
    }));
  };

  const loadUsers = async () => {
    setIsLoadingUsers(true);

    try {
      const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.users}`, {
        withCredentials: true,
      });

      setUsers(response?.data?.users ?? []);
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessages();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setErrorMessage("Password and confirm password must match.");
      return;
    }

    setIsSubmitting(true);

    const url = `${API_BASE_URL}${isLogin ? ENDPOINTS.login : ENDPOINTS.signup}`;
    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const message =
        response?.data?.message ||
        (isLogin ? "Login successful." : "Sign up successful.");
      setSuccessMessage(message);

      if (isLogin) {
        setActiveUser(response?.data?.user ?? null);
        setView("users");
        await loadUsers();
      }

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setView("auth");
    setActiveUser(null);
    setUsers([]);
    resetMessages();
    setMode("login");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  useEffect(() => {
    if (view === "users" && users.length === 0 && !isLoadingUsers) {
      loadUsers();
    }
  }, [view]);

  if (view === "users") {
    return (
      <main style={styles.page}>
        <div style={styles.backdrop} />
        <div style={styles.container}>
          {successMessage && (
            <div style={{ ...styles.messageContainer, borderColor: "rgba(0, 255, 224, 0.5)", backgroundColor: "rgba(0, 255, 224, 0.12)" }}>
              <p style={styles.successText}>{successMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div style={{ ...styles.messageContainer, borderColor: "rgba(255, 45, 149, 0.5)", backgroundColor: "rgba(255, 45, 149, 0.12)" }}>
              <p style={styles.errorText}>{errorMessage}</p>
            </div>
          )}

          <section style={{ ...styles.card, ...styles.listCard }}>
            <div style={styles.headerArea}>
              <div style={styles.listHeaderRow}>
                <div>
                  <h1 style={styles.heading}>Registered Users</h1>
                  <p style={styles.subHeading}>
                    {activeUser?.email ? `Logged in as ${activeUser.email}` : "A scrollable view of all registered accounts"}
                  </p>
                </div>
                <button type="button" onClick={handleLogout} style={styles.secondaryButton}>
                  Logout
                </button>
              </div>
              <p style={styles.countText}>{isLoadingUsers ? "Loading users..." : userCountLabel}</p>
            </div>

            <div style={styles.userList}>
              {isLoadingUsers ? (
                <div style={styles.emptyState}>Fetching user records...</div>
              ) : users.length > 0 ? (
                users.map((user, index) => (
                  <article key={user._id || user.email || index} style={styles.userCard}>
                    <div style={styles.userCardTop}>
                      <div>
                        <h2 style={styles.userName}>{user.name || "Unnamed User"}</h2>
                        <p style={styles.userEmail}>{user.email}</p>
                      </div>
                      <span style={styles.userBadge}>#{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div style={styles.userMetaRow}>
                      <span style={styles.userMetaLabel}>Joined</span>
                      <span style={styles.userMetaValue}>{formatDate(user.createdAt)}</span>
                    </div>
                  </article>
                ))
              ) : (
                <div style={styles.emptyState}>No registered users found.</div>
              )}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.backdrop} />
      <div style={styles.container}>
        {successMessage && (
          <div style={{ ...styles.messageContainer, borderColor: "rgba(0, 255, 224, 0.5)", backgroundColor: "rgba(0, 255, 224, 0.12)" }}>
            <p style={styles.successText}>{successMessage}</p>
          </div>
        )}
        {errorMessage && (
          <div style={{ ...styles.messageContainer, borderColor: "rgba(255, 45, 149, 0.5)", backgroundColor: "rgba(255, 45, 149, 0.12)" }}>
            <p style={styles.errorText}>{errorMessage}</p>
          </div>
        )}

        <section style={styles.card}>
          <div style={styles.headerArea}>
            <h1 style={styles.heading}>{heading}</h1>
            <p style={styles.subHeading}>{subHeading}</p>
          </div>

          <div style={styles.switchContainer}>
            <button
              type="button"
              onClick={() => switchMode("login")}
              style={{
                ...styles.switchButton,
                ...(isLogin ? styles.switchButtonActive : {}),
              }}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              style={{
                ...styles.switchButton,
                ...(!isLogin ? styles.switchButtonActive : {}),
              }}
            >
              Sign Up
            </button>
          </div>

          <form style={styles.form} onSubmit={handleSubmit}>
            {!isLogin && (
              <label style={styles.fieldBlock}>
                Full Name
                <input
                  style={styles.input}
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>
            )}

            <label style={styles.fieldBlock}>
              Email
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label style={styles.fieldBlock}>
              Password
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </label>

            {!isLogin && (
              <label style={styles.fieldBlock}>
                Confirm Password
                <input
                  style={styles.input}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </label>
            )}

            <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <p style={styles.note}>
            API Base URL: {API_BASE_URL}
            <br />
            Set <strong>VITE_API_BASE_URL</strong> in your frontend .env file for custom backend URLs.
          </p>
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: '"Rajdhani", "Segoe UI", sans-serif',
    background: "#05070f",
    transition: "background 0.5s ease",
    position: "relative",
    overflow: "hidden",
  },
  backdrop: {
    position: "absolute",
    inset: 0,
    background: "rgba(0, 255, 224, 0.06)",
    backgroundSize: "28px 28px",
    opacity: 0.36,
    pointerEvents: "none",
  },
  container: {
    width: "100%",
    maxWidth: "480px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    position: "relative",
    zIndex: 1,
  },
  listCard: {
    maxHeight: "82vh",
    display: "flex",
    flexDirection: "column",
  },
  messageContainer: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid",
    animation: "slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    transition: "all 0.3s ease",
    boxShadow: "0 0 16px rgba(0, 255, 224, 0.14)",
    backdropFilter: "blur(2px)",
  },
  card: {
    width: "100%",
    background: "rgba(7, 11, 30, 0.95)",
    borderRadius: "18px",
    padding: "32px",
    boxShadow:
      "0 22px 48px rgba(0, 0, 0, 0.65), inset 0 0 0 1px rgba(0, 255, 224, 0.12), 0 0 28px rgba(255, 45, 149, 0.12)",
    border: "1px solid rgba(0, 255, 224, 0.35)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  headerArea: {
    marginBottom: "28px",
    transition: "all 0.4s ease",
  },
  listHeaderRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
  },
  heading: {
    margin: "0 0 8px",
    fontSize: "2.1rem",
    color: "#f5f7ff",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    transition: "color 0.3s ease",
    fontFamily: '"Orbitron", "Rajdhani", sans-serif',
    textShadow: "0 0 12px rgba(0, 255, 224, 0.28)",
  },
  subHeading: {
    margin: 0,
    color: "#99a4d6",
    fontSize: "1rem",
    fontWeight: 500,
    transition: "color 0.3s ease",
    letterSpacing: "0.04em",
  },
  countText: {
    marginTop: "10px",
    color: "#66ffe9",
    fontSize: "0.84rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  switchContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    background: "rgba(2, 5, 20, 0.8)",
    border: "1px solid rgba(0, 255, 224, 0.25)",
    borderRadius: "12px",
    padding: "5px",
    marginBottom: "20px",
    gap: "5px",
    transition: "all 0.3s ease",
  },
  switchButton: {
    border: "1px solid transparent",
    borderRadius: "10px",
    background: "transparent",
    color: "#9ea9d9",
    fontWeight: 700,
    padding: "11px 14px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "0.95rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  switchButtonActive: {
    background: "rgba(0, 255, 224, 0.16)",
    color: "#f7fbff",
    boxShadow: "0 0 18px rgba(0, 255, 224, 0.24)",
    borderColor: "rgba(0, 255, 224, 0.6)",
  },
  form: {
    display: "grid",
    gap: "16px",
  },
  fieldBlock: {
    display: "grid",
    gap: "8px",
    color: "#d9e0ff",
    fontWeight: 600,
    fontSize: "0.92rem",
    transition: "color 0.3s ease",
    letterSpacing: "0.03em",
    textTransform: "uppercase",
  },
  input: {
    border: "1px solid rgba(0, 255, 224, 0.36)",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "0.95rem",
    outline: "none",
    background: "rgba(4, 10, 33, 0.86)",
    color: "#e8eeff",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: '"Rajdhani", "Segoe UI", sans-serif',
  },
  submitButton: {
    marginTop: "8px",
    border: "none",
    borderRadius: "12px",
    background: "#00f3ff",
    color: "#070b1a",
    fontSize: "0.96rem",
    fontWeight: 700,
    padding: "13px 16px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 0 24px rgba(0, 243, 255, 0.35)",
    letterSpacing: "0.09em",
    textTransform: "uppercase",
  },
  secondaryButton: {
    border: "1px solid rgba(255, 45, 149, 0.55)",
    borderRadius: "999px",
    background: "rgba(255, 45, 149, 0.12)",
    color: "#ffd2ec",
    fontSize: "0.82rem",
    fontWeight: 700,
    padding: "10px 14px",
    cursor: "pointer",
    letterSpacing: "0.09em",
    textTransform: "uppercase",
  },
  userList: {
    display: "grid",
    gap: "12px",
    overflowY: "auto",
    paddingRight: "6px",
    maxHeight: "56vh",
  },
  userCard: {
    background: "rgba(9, 16, 44, 0.9)",
    border: "1px solid rgba(0, 255, 224, 0.24)",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "inset 0 1px 0 rgba(0, 255, 224, 0.08)",
  },
  userCardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  userName: {
    margin: 0,
    fontSize: "1.05rem",
    color: "#e8eeff",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    fontFamily: '"Orbitron", "Rajdhani", sans-serif',
  },
  userEmail: {
    margin: "6px 0 0",
    color: "#8edaf4",
    fontSize: "0.92rem",
    wordBreak: "break-word",
  },
  userBadge: {
    flexShrink: 0,
    border: "1px solid rgba(255, 45, 149, 0.55)",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#ffd2ec",
    background: "rgba(255, 45, 149, 0.14)",
  },
  userMetaRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    paddingTop: "10px",
    borderTop: "1px dashed rgba(0, 255, 224, 0.28)",
    fontSize: "0.82rem",
  },
  userMetaLabel: {
    color: "#6cd8f9",
    textTransform: "uppercase",
    letterSpacing: "0.09em",
  },
  userMetaValue: {
    color: "#f4f7ff",
    fontWeight: 600,
  },
  emptyState: {
    padding: "22px 16px",
    borderRadius: "14px",
    border: "1px dashed rgba(0, 255, 224, 0.3)",
    color: "#8ad9f6",
    textAlign: "center",
    background: "rgba(2, 11, 29, 0.7)",
  },
  successText: {
    margin: 0,
    color: "#b7fff4",
    fontWeight: 600,
    fontSize: "0.96rem",
    transition: "color 0.3s ease",
  },
  errorText: {
    margin: 0,
    color: "#ffc3e4",
    fontWeight: 600,
    fontSize: "0.96rem",
    transition: "color 0.3s ease",
  },
  note: {
    marginTop: "18px",
    fontSize: "0.83rem",
    color: "#89cde9",
    lineHeight: 1.5,
    transition: "color 0.3s ease",
    letterSpacing: "0.03em",
  },
};