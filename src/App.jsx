import { useEffect, useState } from "react";
import { students as initialStudents } from "./student.jsx";
import "./App.css";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "students", label: "Students" },
  { id: "add", label: "Add Student" }
];

const departments = ["CSE", "EEE", "BBA", "ME", "CE"];

const emptyForm = { name: "", age: "", department: "", marks: "" };

function marksClass(marks) {
  if (marks >= 80) return "high";
  if (marks >= 70) return "mid";
  return "low";
}

export default function App() {
  const [students, setStudents] = useState(initialStudents);
  const [view, setView] = useState("dashboard");
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  const cseStudents = students.filter((s) => s.department === "CSE");
  const visibleStudents = filter === "CSE" ? cseStudents : students;
  const total = students.length;
  const average = total
    ? students.reduce((sum, s) => sum + s.marks, 0) / total
    : 0;
  const top = total
    ? students.reduce((best, s) => (s.marks > best.marks ? s : best))
    : null;

  function openStudents(nextFilter) {
    setFilter(nextFilter);
    setView("students");
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const age = Number(form.age);
    const marks = Number(form.marks);

    if (!name) return setError("Please enter the student's name.");
    if (form.age === "" || !Number.isInteger(age) || age < 10 || age > 100) {
      return setError("Please enter a valid age (10 - 100).");
    }
    if (!form.department) return setError("Please select a department.");
    if (form.marks === "" || Number.isNaN(marks) || marks < 0 || marks > 100) {
      return setError("Marks must be a number between 0 and 100.");
    }

    const nextId = students.length
      ? Math.max(...students.map((s) => s.id)) + 1
      : 1;

    setStudents([
      ...students,
      { id: nextId, name, age, department: form.department, marks }
    ]);
    setForm(emptyForm);
    setFilter("all");
    setView("students");
    setNotice(`${name} was added successfully.`);
  }

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <div className="logo">SMS</div>
          <div>
            <h1>Student Management System</h1>
            <p>Manage your students efficiently</p>
          </div>
        </div>
        <span className="header-count">{total} Students Registered</span>
      </header>

      <main className="container">
        <nav className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${view === tab.id ? "active" : ""}`}
              onClick={() => setView(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {notice && <div className="notice">{notice}</div>}

        {view === "dashboard" && (
          <section>
            <div className="banner">
              <h2>Student Management System</h2>
              <p>Welcome back! Here's your dashboard overview.</p>
            </div>

            <div className="stats">
              <div className="card">
                <span className="card-label">Total Students</span>
                <strong className="card-value">{total}</strong>
                <span className="card-sub">Registered students</span>
              </div>
              <div className="card">
                <span className="card-label">CSE Students</span>
                <strong className="card-value">{cseStudents.length}</strong>
                <span className="card-sub">In the CSE department</span>
              </div>
              <div className="card">
                <span className="card-label">Average Marks</span>
                <strong className="card-value">{average.toFixed(1)}</strong>
                <span className="card-sub">Across all students</span>
              </div>
              <div className="card">
                <span className="card-label">Top Scorer</span>
                <strong className="card-value">{top ? top.name : "-"}</strong>
                <span className="card-sub">
                  {top ? `${top.marks} marks` : "-"}
                </span>
              </div>
            </div>

            <div className="panel">
              <h2>Quick Actions</h2>
              <p className="muted">Common tasks you might want to perform</p>
              <div className="actions">
                <button className="action" onClick={() => openStudents("all")}>
                  <strong>View All Students</strong>
                  <span>Browse and manage student records</span>
                </button>
                <button className="action" onClick={() => openStudents("CSE")}>
                  <strong>CSE Students</strong>
                  <span>Show only the CSE department</span>
                </button>
                <button className="action" onClick={() => setView("add")}>
                  <strong>Add New Student</strong>
                  <span>Register a new student</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {view === "students" && (
          <section>
            <div className="panel">
              <div className="toolbar">
                <div>
                  <h2>Students</h2>
                  <p className="muted">
                    Showing {visibleStudents.length} of {total} students
                  </p>
                </div>
                <div className="btn-group">
                  <button
                    className={`btn ${filter === "all" ? "active" : ""}`}
                    onClick={() => setFilter("all")}
                  >
                    View All Students
                  </button>
                  <button
                    className={`btn ${filter === "CSE" ? "active" : ""}`}
                    onClick={() => setFilter("CSE")}
                  >
                    CSE Students Only
                  </button>
                </div>
              </div>

              <p className="total">
                Total number of students: <strong>{total}</strong>
              </p>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Department</th>
                      <th>Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleStudents.map((student) => (
                      <tr key={student.id}>
                        <td>{student.id}</td>
                        <td className="name">{student.name}</td>
                        <td>{student.age}</td>
                        <td>
                          <span className="dept">{student.department}</span>
                        </td>
                        <td>
                          <span className={`marks ${marksClass(student.marks)}`}>
                            {student.marks}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {visibleStudents.length === 0 && (
                <p className="empty">No students to show.</p>
              )}
            </div>
          </section>
        )}

        {view === "add" && (
          <section>
            <div className="panel form-panel">
              <h2>Add New Student</h2>
              <p className="muted">Fill in the details to register a student.</p>

              <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Tanvir"
                  value={form.name}
                  onChange={handleChange}
                />

                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="10"
                  max="100"
                  placeholder="e.g. 21"
                  value={form.age}
                  onChange={handleChange}
                />

                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                <label htmlFor="marks">Marks (0 - 100)</label>
                <input
                  id="marks"
                  name="marks"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 80"
                  value={form.marks}
                  onChange={handleChange}
                />

                {error && <p className="error">{error}</p>}

                <button type="submit" className="btn primary">
                  Add Student
                </button>
              </form>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <span>&copy; 2026 Student Management System</span>
        <span>
          Total: {total} | CSE: {cseStudents.length}
        </span>
      </footer>
    </>
  );
}