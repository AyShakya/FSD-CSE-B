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
            <div style={{ ...styles.messageContainer, borderColor: "rgba(134, 239, 172, 0.3)", backgroundColor: "rgba(134, 239, 172, 0.1)" }}>
              <p style={styles.successText}>{successMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div style={{ ...styles.messageContainer, borderColor: "rgba(255, 107, 107, 0.3)", backgroundColor: "rgba(255, 107, 107, 0.1)" }}>
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
          <div style={{ ...styles.messageContainer, borderColor: "rgba(134, 239, 172, 0.3)", backgroundColor: "rgba(134, 239, 172, 0.1)" }}>
            <p style={styles.successText}>{successMessage}</p>
          </div>
        )}
        {errorMessage && (
          <div style={{ ...styles.messageContainer, borderColor: "rgba(255, 107, 107, 0.3)", backgroundColor: "rgba(255, 107, 107, 0.1)" }}>
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
    fontFamily: '"Georgia", "Times New Roman", serif',
    background:
      "radial-gradient(circle at top, rgba(255, 255, 255, 0.16), transparent 35%), linear-gradient(135deg, #111111 0%, #1a1a1a 45%, #0a0a0a 100%)",
    transition: "background 0.5s ease",
    position: "relative",
    overflow: "hidden",
  },
  backdrop: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
    backgroundSize: "28px 28px",
    opacity: 0.24,
    pointerEvents: "none",
  },
  container: {
    width: "100%",
    maxWidth: "430px",
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
    borderRadius: "14px",
    border: "1px solid",
    animation: "slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    transition: "all 0.3s ease",
  },
  card: {
    width: "100%",
    background:
      "linear-gradient(180deg, rgba(249, 244, 233, 0.98) 0%, rgba(236, 229, 215, 0.96) 100%)",
    borderRadius: "22px",
    padding: "32px",
    boxShadow: "0 24px 50px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
    border: "1px solid rgba(0, 0, 0, 0.16)",
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
    fontSize: "2rem",
    color: "#111111",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    transition: "color 0.3s ease",
  },
  subHeading: {
    margin: 0,
    color: "#49413a",
    fontSize: "0.95rem",
    fontWeight: 400,
    transition: "color 0.3s ease",
  },
  countText: {
    marginTop: "10px",
    color: "#5a534d",
    fontSize: "0.84rem",
    letterSpacing: "0.03em",
    textTransform: "uppercase",
  },
  switchContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    background: "rgba(17, 17, 17, 0.08)",
    border: "1px solid rgba(17, 17, 17, 0.14)",
    borderRadius: "12px",
    padding: "5px",
    marginBottom: "20px",
    gap: "5px",
    transition: "all 0.3s ease",
  },
  switchButton: {
    border: "none",
    borderRadius: "10px",
    background: "transparent",
    color: "#55504a",
    fontWeight: 600,
    padding: "11px 14px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "0.95rem",
    letterSpacing: "0.03em",
  },
  switchButtonActive: {
    background: "linear-gradient(135deg, #171717 0%, #3a3a3a 100%)",
    color: "#f8f2e8",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  },
  form: {
    display: "grid",
    gap: "16px",
  },
  fieldBlock: {
    display: "grid",
    gap: "8px",
    color: "#1d1a17",
    fontWeight: 500,
    fontSize: "0.92rem",
    transition: "color 0.3s ease",
  },
  input: {
    border: "1px solid rgba(17, 17, 17, 0.18)",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "0.95rem",
    outline: "none",
    background: "rgba(255, 255, 255, 0.7)",
    color: "#111111",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  submitButton: {
    marginTop: "8px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #161616 0%, #3d3d3d 100%)",
    color: "#f9f4eb",
    fontSize: "0.96rem",
    fontWeight: 700,
    padding: "13px 16px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.18)",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  secondaryButton: {
    border: "1px solid rgba(17, 17, 17, 0.18)",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.45)",
    color: "#111111",
    fontSize: "0.82rem",
    fontWeight: 700,
    padding: "10px 14px",
    cursor: "pointer",
    letterSpacing: "0.04em",
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
    background: "rgba(255, 255, 255, 0.6)",
    border: "1px solid rgba(17, 17, 17, 0.14)",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.5)",
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
    color: "#111111",
    letterSpacing: "0.03em",
    textTransform: "uppercase",
  },
  userEmail: {
    margin: "6px 0 0",
    color: "#4f4740",
    fontSize: "0.92rem",
    wordBreak: "break-word",
  },
  userBadge: {
    flexShrink: 0,
    border: "1px solid rgba(17, 17, 17, 0.18)",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#111111",
    background: "rgba(255, 255, 255, 0.62)",
  },
  userMetaRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    paddingTop: "10px",
    borderTop: "1px dashed rgba(17, 17, 17, 0.14)",
    fontSize: "0.82rem",
  },
  userMetaLabel: {
    color: "#5a534d",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  userMetaValue: {
    color: "#111111",
    fontWeight: 600,
  },
  emptyState: {
    padding: "22px 16px",
    borderRadius: "14px",
    border: "1px dashed rgba(17, 17, 17, 0.2)",
    color: "#5a534d",
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.45)",
  },
  successText: {
    margin: 0,
    color: "#1f1f1f",
    fontWeight: 600,
    fontSize: "0.96rem",
    transition: "color 0.3s ease",
  },
  errorText: {
    margin: 0,
    color: "#1f1f1f",
    fontWeight: 600,
    fontSize: "0.96rem",
    transition: "color 0.3s ease",
  },
  note: {
    marginTop: "18px",
    fontSize: "0.83rem",
    color: "#5a534d",
    lineHeight: 1.5,
    transition: "color 0.3s ease",
  },
};