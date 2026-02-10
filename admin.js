const API_URL = "http://localhost:3000";
const adminId = localStorage.getItem("adminId"); // assumes admin login stored

if (!adminId) {
  alert("Please login as admin first");
  window.location.href = "index.html";
}

// =====================
// LOAD ON PAGE
// =====================
window.onload = () => {
  loadReserve();
  loadUsers();
  loadPendingLoans();
};

// =====================
// LOAD SYSTEM RESERVE
// =====================
async function loadReserve() {
  try {
    const res = await fetch(`${API_URL}/admin/reserve`);
    const data = await res.json();
    document.getElementById("reserve").innerText = `$${data.reserve.toLocaleString()}`;
  } catch (err) {
    console.error(err);
  }
}

// =====================
// LOAD ALL USERS
// =====================
async function loadUsers() {
  try {
    const res = await fetch(`${API_URL}/admin/users`);
    const users = await res.json();

    const container = document.getElementById("usersList");
    container.innerHTML = "";

    users.forEach(u => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <strong>${u.name} (${u.email})</strong><br>
        Role: ${u.role} | Balance: $${u.balance} | Access: ${u.hasAccess ? 'Yes' : 'No'} ${u.isSpecial ? '(VIP)' : ''}<br>
        Loan: $${u.loan.amount} | Status: ${u.loan.status || 'None'}
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

// =====================
// LOAD PENDING LOANS
// =====================
async function loadPendingLoans() {
  try {
    const res = await fetch(`${API_URL}/admin/loans/pending`);
    const loans = await res.json();

    const container = document.getElementById("pendingLoans");
    container.innerHTML = "";

    loans.forEach(u => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <strong>${u.name} (${u.email})</strong> - $${u.loan.amount} - ${u.loan.status}
        <br>
        <button onclick="approveLoan('${u._id}')">Approve</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

// =====================
// APPROVE LOAN
// =====================
async function approveLoan(userId) {
  try {
    const res = await fetch(`${API_URL}/admin/loan/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });

    const data = await res.json();
    if (res.ok) {
      alert(`Loan approved. New balance: $${data.balance}`);
    } else {
      alert(`Error: ${data.error}`);
    }

    loadUsers();
    loadPendingLoans();
  } catch (err) {
    console.error(err);
    alert("Failed to approve loan");
  }
}

// =====================
// LOGOUT
// =====================
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}