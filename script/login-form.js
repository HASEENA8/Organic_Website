const users = JSON.parse(localStorage.getItem("users")) || [];

document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();  
  
  const email = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const user = { email, password };

  if (checkUser(user)) {
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 1000);
  }
});

function checkUser(user) {
  const fetchedUserRecord = users.find(item => item.email === user.email);
  if (fetchedUserRecord) {
    if (user.password === fetchedUserRecord.password) {
      localStorage.setItem("activeUser", JSON.stringify(fetchedUserRecord));
      displayMessage("User found! Redirecting to Homepage...");
      return true;
    } else {
      displayMessage("Invalid email or password");
      return false;
    }
  } else {
    displayMessage("User not found");
    return false;
  }
}

function displayMessage(message) {
  const messageContainer = document.querySelector('.message');
  messageContainer.innerText = message;
}
