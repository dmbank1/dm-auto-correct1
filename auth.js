const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

const API_URL = isLocalhost 
  ? "http://localhost:3000"  // Niba uri kuri computer
  : "http://192.168.1.100:3000";  // HINDURA iyi IP kuri iya computer yawe!

// LOGIN FUNCTION
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const msgElement = document.getElementById("loginMsg");

  if (!email || !password) {
    showMessage(msgElement, "Please fill all fields", "error");
    return;
  }

  try {
    console.log("Trying to connect to:", API_URL); // Debug message
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(msgElement, data.error || "Login failed", "error");
    } else {
      showMessage(msgElement, "Login successful!", "success");
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      
      setTimeout(() => {
        if (data.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "dashboard.html";
        }
      }, 1000);
    }
  } catch (error) {
    console.error("Login error:", error);
    showMessage(msgElement, `Cannot connect to server at ${API_URL}. Make sure server is running!`, "error");
  }
}

// REGISTER FUNCTION
async function register() {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const nationalId = document.getElementById("regNationalId").value.trim();
  const mobileMoney = document.getElementById("regMobileMoney").value.trim();
  const msgElement = document.getElementById("registerMsg");

  if (!name || !email || !password || !nationalId || !mobileMoney) {
    showMessage(msgElement, "Please fill all fields", "error");
    return;
  }

  if (password.length < 6) {
    showMessage(msgElement, "Password must be at least 6 characters", "error");
    return;
  }

  try {
    console.log("Trying to connect to:", API_URL); // Debug message
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, nationalId, mobileMoney })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(msgElement, data.error || "Registration failed", "error");
    } else {
      showMessage(msgElement, "Registration successful! Please check your email.", "success");
      
      // Clear form
      document.getElementById("regName").value = "";
      document.getElementById("regEmail").value = "";
      document.getElementById("regPassword").value = "";
      document.getElementById("regNationalId").value = "";
      document.getElementById("regMobileMoney").value = "";
    }
  } catch (error) {
    console.error("Registration error:", error);
    showMessage(msgElement, `Cannot connect to server at ${API_URL}. Make sure server is running!`, "error");
  }
}

// HELPER FUNCTION
function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `message ${type}`;
  element.style.display = "block";
}