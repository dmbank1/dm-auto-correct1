const API_URL = "http://localhost:5000";

const systemEl = document.getElementById("systemBalance");
const userEl = document.getElementById("userBalance");
const form = document.getElementById("loanForm");

// Get balances from backend
async function loadBalances() {
  const res = await fetch(API_URL + "/");
  const data = await res.text();

  console.log(data);

  // demo values until real API
  systemEl.textContent = 5000000000;
  userEl.textContent = 0;
}

loadBalances();

// Request loan
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = Number(document.getElementById("loanAmount").value);

  const res = await fetch(API_URL + "/api/loan/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  });

  const data = await res.json();

  alert(data.message || "Done");

  loadBalances();
});