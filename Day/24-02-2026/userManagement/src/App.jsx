import { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email) return;

    if (editingId) {
      setUsers(users.map(u =>
        u.id === editingId ? { ...u, ...form } : u
      ));
      setEditingId(null);
    } else {
      setUsers([
        ...users,
        { id: Date.now(), name: form.name, email: form.email }
      ]);
    }

    setForm({ name: "", email: "" });
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email });
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const visibleUsers = searchId
    ? users.filter(u => u.id.toString() === searchId)
    : users;

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>User Management</h1>

      <input
        placeholder="Search by User ID"
        value={searchId}
        onChange={e => setSearchId(e.target.value)}
        style={styles.search}
      />

      <form onSubmit={handleSubmit} style={styles.formCard}>
        <h3>{editingId ? "Edit User" : "Add New User"}</h3>

        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={styles.input}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={styles.input}
        />

        <button style={styles.primaryBtn}>
          {editingId ? "Update User" : "Add User"}
        </button>
      </form>

      <div style={styles.grid}>
        {visibleUsers.map(user => (
          <div key={user.id} style={styles.card}>
            <div style={styles.avatar}>
              {user.name[0].toUpperCase()}
            </div>

            <h4>{user.name}</h4>
            <p>{user.email}</p>
            <small>ID: {user.id}</small>

            <div style={styles.actions}>
              <button
                style={styles.editBtn}
                onClick={() => handleEdit(user)}
              >
                Edit
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    padding: 30,
    color: "#fff",
    fontFamily: "Inter, sans-serif"
  },
  title: {
    textAlign: "center",
    marginBottom: 20
  },
  search: {
    display: "block",
    margin: "0 auto 30px",
    padding: 12,
    width: 280,
    borderRadius: 25,
    border: "none",
    outline: "none"
  },
  formCard: {
    maxWidth: 360,
    margin: "0 auto 40px",
    padding: 20,
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  input: {
    padding: 10,
    borderRadius: 10,
    border: "none",
    outline: "none"
  },
  primaryBtn: {
    padding: 12,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "#00d2ff",
    fontWeight: "bold"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 20
  },
  card: {
    background: "rgba(255,255,255,0.12)",
    padding: 20,
    borderRadius: 18,
    textAlign: "center",
    backdropFilter: "blur(8px)"
  },
  avatar: {
    width: 50,
    height: 50,
    margin: "0 auto 10px",
    borderRadius: "50%",
    background: "#00d2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#000"
  },
  actions: {
    marginTop: 12,
    display: "flex",
    justifyContent: "space-between"
  },
  editBtn: {
    flex: 1,
    marginRight: 5,
    border: "none",
    padding: 8,
    borderRadius: 8,
    cursor: "pointer"
  },
  deleteBtn: {
    flex: 1,
    marginLeft: 5,
    border: "none",
    padding: 8,
    borderRadius: 8,
    cursor: "pointer",
    background: "#ff4d4d",
    color: "#fff"
  }
};