import { useMemo, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ENDPOINTS = {
  login: "/api/auth/login",
  signup: "/api/auth/register",
};

function extractErrorMessage(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return "Something went wrong. Please try again.";
}

export default function App() {
  const [mode, setMode] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  return (
    <main style={styles.page}>
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

        {successMessage && <p style={styles.successText}>{successMessage}</p>}
        {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}

        <p style={styles.note}>
          API Base URL: {API_BASE_URL}
          <br />
          Set <strong>VITE_API_BASE_URL</strong> in your frontend .env file for custom backend URLs.
        </p>
      </section>
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
    fontFamily: "Segoe UI, sans-serif",
    background:
      "radial-gradient(circle at top left, #fef9c3 0%, #fef3c7 30%, #ffedd5 65%, #fed7aa 100%)",
  },
  card: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 20px 45px rgba(120, 53, 15, 0.15)",
    border: "1px solid #fdba74",
  },
  headerArea: {
    marginBottom: "18px",
  },
  heading: {
    margin: "0 0 6px",
    fontSize: "1.6rem",
    color: "#7c2d12",
  },
  subHeading: {
    margin: 0,
    color: "#9a3412",
    fontSize: "0.95rem",
  },
  switchContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    background: "#fff7ed",
    border: "1px solid #fdba74",
    borderRadius: "10px",
    padding: "4px",
    marginBottom: "16px",
    gap: "4px",
  },
  switchButton: {
    border: "none",
    borderRadius: "8px",
    background: "transparent",
    color: "#9a3412",
    fontWeight: 600,
    padding: "10px 12px",
    cursor: "pointer",
  },
  switchButtonActive: {
    background: "#ea580c",
    color: "#ffffff",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  fieldBlock: {
    display: "grid",
    gap: "6px",
    color: "#7c2d12",
    fontWeight: 600,
    fontSize: "0.92rem",
  },
  input: {
    border: "1px solid #fdba74",
    borderRadius: "10px",
    padding: "11px 12px",
    fontSize: "0.95rem",
    outline: "none",
  },
  submitButton: {
    marginTop: "6px",
    border: "none",
    borderRadius: "10px",
    background: "#c2410c",
    color: "#ffffff",
    fontSize: "0.96rem",
    fontWeight: 700,
    padding: "12px",
    cursor: "pointer",
  },
  successText: {
    marginTop: "14px",
    color: "#14532d",
    fontWeight: 600,
  },
  errorText: {
    marginTop: "14px",
    color: "#b91c1c",
    fontWeight: 600,
  },
  note: {
    marginTop: "14px",
    fontSize: "0.84rem",
    color: "#7c2d12",
    lineHeight: 1.4,
  },
};