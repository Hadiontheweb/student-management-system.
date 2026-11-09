import { students } from "./students.js";

const $ = (id) => document.getElementById(id);

const tabs = document.querySelectorAll(".tab");
const views = document.querySelectorAll(".view");

const studentTableBody = $("studentTableBody");
const emptyState = $("emptyState");
const resultInfo = $("resultInfo");
const totalCount = $("totalCount");
const headerCount = $("headerCount");
const footerCount = $("footerCount");

const statTotal = $("statTotal");
const statCSE = $("statCSE");
const statAvg = $("statAvg");
const statTop = $("statTop");
const statTopMarks = $("statTopMarks");

const btnViewAll = $("btnViewAll");
const btnCSE = $("btnCSE");

const form = $("studentForm");
const inputName = $("inputName");
const inputAge = $("inputAge");
const inputDept = $("inputDept");
const inputMarks = $("inputMarks");
const formError = $("formError");
const notice = $("notice");

let currentFilter = "all";

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function marksClass(marks) {
  if (marks >= 80) return "high";
  if (marks >= 70) return "mid";
  return "low";
}

function getVisibleStudents() {
  if (currentFilter === "CSE") {
    return students.filter((student) => student.department === "CSE");
  }
  return students;
}

function renderStudents() {
  const list = getVisibleStudents();

  studentTableBody.innerHTML = list
    .map(
      (student) => `
        <tr>
          <td>${student.id}</td>
          <td class="name">${escapeHTML(student.name)}</td>
          <td>${student.age}</td>
          <td><span class="dept">${escapeHTML(student.department)}</span></td>
          <td><span class="marks ${marksClass(student.marks)}">${student.marks}</span></td>
        </tr>`
    )
    .join("");

  emptyState.classList.toggle("hidden", list.length > 0);
  resultInfo.textContent = `Showing ${list.length} of ${students.length} students`;

  btnViewAll.classList.toggle("active", currentFilter === "all");
  btnCSE.classList.toggle("active", currentFilter === "CSE");
}

function updateStats() {
  const total = students.length;
  const cseCount = students.filter((s) => s.department === "CSE").length;
  const average = total
    ? students.reduce((sum, s) => sum + s.marks, 0) / total
    : 0;
  const top = total
    ? students.reduce((best, s) => (s.marks > best.marks ? s : best))
    : null;

  statTotal.textContent = total;
  statCSE.textContent = cseCount;
  statAvg.textContent = average.toFixed(1);
  statTop.textContent = top ? top.name : "-";
  statTopMarks.textContent = top ? `${top.marks} marks` : "-";

  totalCount.textContent = total;
  headerCount.textContent = `${total} Students Registered`;
  footerCount.textContent = `Total: ${total} | CSE: ${cseCount}`;
}

function refresh() {
  updateStats();
  renderStudents();
}

function showView(name) {
  views.forEach((view) => {
    view.classList.toggle("hidden", view.id !== `view-${name}`);
  });
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === name);
  });
}

function setFilter(filter) {
  currentFilter = filter;
  renderStudents();
}

let noticeTimer;
function showNotice(message) {
  notice.textContent = message;
  notice.classList.remove("hidden");
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => notice.classList.add("hidden"), 3000);
}

function showFormError(message) {
  formError.textContent = message;
  formError.classList.remove("hidden");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => showView(tab.dataset.view));
});

$("quickViewAll").addEventListener("click", () => {
  setFilter("all");
  showView("students");
});
$("quickCSE").addEventListener("click", () => {
  setFilter("CSE");
  showView("students");
});
$("quickAdd").addEventListener("click", () => showView("add"));

btnViewAll.addEventListener("click", () => setFilter("all"));
btnCSE.addEventListener("click", () => setFilter("CSE"));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formError.classList.add("hidden");

  const name = inputName.value.trim();
  const age = Number(inputAge.value);
  const department = inputDept.value;
  const marks = Number(inputMarks.value);

  if (!name) return showFormError("Please enter the student's name.");
  if (inputAge.value === "" || !Number.isInteger(age) || age < 10 || age > 100) {
    return showFormError("Please enter a valid age (10 - 100).");
  }
  if (!department) return showFormError("Please select a department.");
  if (inputMarks.value === "" || Number.isNaN(marks) || marks < 0 || marks > 100) {
    return showFormError("Marks must be a number between 0 and 100.");
  }

  const nextId = students.length
    ? Math.max(...students.map((s) => s.id)) + 1
    : 1;

  students.push({ id: nextId, name, age, department, marks });

  form.reset();
  setFilter("all");
  refresh();
  showView("students");
  showNotice(`${name} was added successfully.`);
});

refresh();
showView("dashboard");