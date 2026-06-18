let employees = [
    { name: "Ali Ahmed",  email: "ali@gmail.com",  department: "IT",  designation: "Developer", joiningDate: "2026-01-10" },
    { name: "Sara Khan",  email: "sara@gmail.com", department: "HR",  designation: "Manager",   joiningDate: "2026-02-15" }
];


function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2800);
}

function deptBadge(dept) {
    const cls = ["IT","HR","Marketing"].includes(dept)
        ? `dept-${dept}` : "dept-default";
    return `<span class="dept-badge ${cls}">${dept || "—"}</span>`;
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
}


function updateDashboard() {
    document.getElementById("totalCount").textContent      = employees.length;
    document.getElementById("itCount").textContent         = employees.filter(e => e.department === "IT").length;
    document.getElementById("hrCount").textContent         = employees.filter(e => e.department === "HR").length;
    document.getElementById("marketingCount").textContent  = employees.filter(e => e.department === "Marketing").length;
}


function renderTable() {
    const query   = document.getElementById("searchInput").value.trim().toLowerCase();
    const tbody   = document.getElementById("employeeTableBody");
    const noRes   = document.getElementById("noResults");
    const filtered = employees.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.email.toLowerCase().includes(query) ||
        e.department.toLowerCase().includes(query) ||
        e.designation.toLowerCase().includes(query)
    );

    tbody.innerHTML = "";

    if (filtered.length === 0) {
        noRes.style.display = "block";
        return;
    }
    noRes.style.display = "none";

    filtered.forEach((emp, idx) => {

        const realIdx = employees.indexOf(emp);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${realIdx + 1}</td>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${deptBadge(emp.department)}</td>
            <td>${emp.designation}</td>
            <td>${formatDate(emp.joiningDate)}</td>
            <td>
                <button class="btn-edit"   onclick="editEmployee(${realIdx})">Edit</button>
                <button class="btn-delete" onclick="deleteEmployee(${realIdx})">Delete</button>
            </td>`;
        tbody.appendChild(row);
    });

    updateDashboard();
}


function validateForm() {
    const name  = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const dept  = document.getElementById("department").value;
    const desig = document.getElementById("designation").value.trim();
    const date  = document.getElementById("joiningDate").value;
    const err   = document.getElementById("formError");

    if (!name)  { err.textContent = "Full name is required."; return false; }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { err.textContent = "A valid email is required."; return false; }
    if (!dept)  { err.textContent = "Please select a department."; return false; }
    if (!desig) { err.textContent = "Designation is required."; return false; }
    if (!date)  { err.textContent = "Joining date is required."; return false; }

    
    const editIdx = parseInt(document.getElementById("editIndex").value);
    const duplicate = employees.some((e, i) =>
        e.email.toLowerCase() === email.toLowerCase() && i !== editIdx
    );
    if (duplicate) { err.textContent = "An employee with this email already exists."; return false; }

    err.textContent = "";
    return true;
}

function submitForm() {
    if (!validateForm()) return;

    const editIdx = parseInt(document.getElementById("editIndex").value);
    const emp = {
        name:        document.getElementById("name").value.trim(),
        email:       document.getElementById("email").value.trim(),
        department:  document.getElementById("department").value,
        designation: document.getElementById("designation").value.trim(),
        joiningDate: document.getElementById("joiningDate").value
    };

    if (editIdx >= 0) {
        employees[editIdx] = emp;
        showToast("✅ Employee updated successfully!");
        cancelEdit();
    } else {
        employees.push(emp);
        showToast("✅ Employee registered successfully!");
        clearForm();
    }

    renderTable();
}


function editEmployee(idx) {
    const emp = employees[idx];
    document.getElementById("name").value        = emp.name;
    document.getElementById("email").value       = emp.email;
    document.getElementById("department").value  = emp.department;
    document.getElementById("designation").value = emp.designation;
    document.getElementById("joiningDate").value = emp.joiningDate;
    document.getElementById("editIndex").value   = idx;
    document.getElementById("formTitle").textContent = "Edit Employee";
    document.getElementById("submitBtn").textContent = "Update Employee";
    document.getElementById("cancelBtn").style.display = "inline-block";
    document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
}


function deleteEmployee(idx) {
    if (!confirm(`Remove ${employees[idx].name} from the list?`)) return;
    employees.splice(idx, 1);
    showToast("🗑️ Employee removed.");
    renderTable();
}


function cancelEdit() {
    clearForm();
    document.getElementById("editIndex").value   = -1;
    document.getElementById("formTitle").textContent = "Register New Employee";
    document.getElementById("submitBtn").textContent = "Register Employee";
    document.getElementById("cancelBtn").style.display = "none";
}


function clearForm() {
    ["name","email","designation","joiningDate"].forEach(id =>
        document.getElementById(id).value = ""
    );
    document.getElementById("department").value = "";
    document.getElementById("formError").textContent = "";
}


renderTable();