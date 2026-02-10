const API_URL = "http://localhost:3000";
const userId = localStorage.getItem("userId");

if (!userId) {
  alert("Login first");
  window.location.href = "index.html";
}

window.onload = () => {
  loadBalance();
  loadTransactions();
  checkAccess();
};

async function loadBalance() {
  const res = await fetch(`${API_URL}/user/${userId}`);
  const data = await res.json();
  document.getElementById("balance").innerText = `$${data.balance}`;
}

async function deposit() {
  const amount = Number(document.getElementById("depositAmount").value);
  if (!amount || amount <= 0) return alert("Enter valid amount");

  await fetch(`${API_URL}/user/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, amount })
  });

  loadBalance();
  loadTransactions();
  alert("Deposit successful");
}

async function withdraw() {
  const amount = Number(document.getElementById("withdrawAmount").value);
  if (!amount || amount <= 0) return alert("Enter valid amount");

  const res = await fetch(`${API_URL}/user/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, amount })
  });

  const data = await res.json();
  if (res.ok) alert("Withdraw successful");
  else alert(data.error);
  loadBalance();
  loadTransactions();
}

async function requestLoan() {
  const amount = Number(document.getElementById("loanAmount").value);
  if (!amount || amount <= 0) return alert("Enter valid loan amount");

  const res = await fetch(`${API_URL}/user/loan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, amount })
  });

  const data = await res.json();
  alert(data.message || "Loan requested");
  loadBalance();
  loadTransactions();
}

async function loadTransactions() {
  const res = await fetch(`${API_URL}/user/transactions/${userId}`);
  const data = await res.json();
  const container = document.getElementById("transactions");
  container.innerHTML = "";

  data.forEach(tx => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<strong>${tx.type.toUpperCase()}</strong> - $${tx.amount}<br><small>${new Date(tx.createdAt).toLocaleString()}</small>`;
    container.appendChild(div);
  });
}

async function payAccess(method) {
  const msg = document.getElementById("accessMsg");
  try {
    const res = await fetch(`${API_URL}/user/pay-access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, method })
    });

    const data = await res.json();
    if (!res.ok) {
      msg.className = "error";
      msg.innerText = data.error;
    } else {
      msg.className = "success";
      msg.innerText = `${data.message}. Expires on ${new Date(data.expires).toDateString()}`;
      checkAccess();
      loadBalance();
    }
  } catch (err) {
    msg.className = "error";
    msg.innerText = "Payment failed";
  }
}

async function checkAccess() {
  const res = await fetch(`${API_URL}/user/${userId}`);
  const user = await res.json();
  const status = document.getElementById("accessMsg");

  if (user.hasAccess && new Date(user.accessExpires) > new Date()) {
    status.innerHTML = `<span class="success">Access active until ${new Date(user.accessExpires).toDateString()}</span>`;
  } else {
    status.innerHTML = `<span class="error">No active access</span>`;
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}