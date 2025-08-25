let formData = {};

function displayToast(message, status){
  const toastBar = document.querySelector('.toast-bar');
  const toastConatiner = document.createElement('div');
  toastConatiner.classList.add('toast');
  toastConatiner.classList.add(status);
  toastConatiner.innerText = message;
  toastBar.append(toastConatiner);
  setTimeout(()=>{
    toastConatiner.style.display = 'none';
  },1000);
}

const users = JSON.parse(localStorage.getItem("users"))|| [];

document.getElementById('registrationForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.querySelector("#name");
  const email = document.querySelector("#email");
  const phone = document.querySelector("#tel"); 
  const password = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirmPassword");

  formData = {
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    password: password.value,
    confirmPassword: confirmPassword.value
  };

  const validated = validFormData(formData);
  if (validated) {
    const { name, email, phone, password } = formData;
    const jsonFormData ={
      name: name,
      email: email,
      password: password,
      phone: phone,
      cart : []
    };
    users.push(jsonFormData);
    localStorage.setItem("users", JSON.stringify(users));
    displayToast("Login successful, redirect to Login Page", "success")
    setTimeout(() =>{
      window.location.href = "login-form.html";
    }, 1500);
  } else {
    displayToast("Not able to submit the form", "error")
  }
});

function validFormData({ name, email, phone, password, confirmPassword }) {
  let failure = false;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{5,}$/;
  const phonePattern = /^[0-9]{7,10}$/;

  const nameError = document.querySelector('.name-error');
  const nameSuccess = document.querySelector('.name-success');
  const emailError = document.querySelector('.email-error');
  const emailSuccess = document.querySelector('.email-success');
  const phoneError = document.querySelector('.phone-error');
  const phoneSuccess = document.querySelector('.phone-success');
  const passwordError = document.querySelector('.password-error');
  const passwordSuccess = document.querySelector('.password-success');
  const confirmError = document.querySelector('.confirm-error');
  const confirmSuccess = document.querySelector('.confirm-success');

  if (name !== "" && name.length > 2) {
    nameSuccess.innerText = "Valid name";
    nameError.innerText = "";
  } else {
    nameError.innerText = "Name should be greater than 2 characters";
    nameSuccess.innerText = "";
    failure = true;
  }

  if (email !== "" && emailPattern.test(email)) {
    emailSuccess.innerText = "Valid email";
    emailError.innerText = "";
  } else {
    emailError.innerText = "Invalid email";
    emailSuccess.innerText = "";
    failure = true;
  }

  if (phone !== "" && phonePattern.test(phone)) {
    phoneSuccess.innerText = "Valid phone";
    phoneError.innerText = "";
  } else {
    phoneError.innerText = "Invalid phone number"; 
    phoneSuccess.innerText = "";
    failure = true;
  }

  if (passwordPattern.test(password)) {
    passwordSuccess.innerText = "Valid password";
    passwordError.innerText = "";
  } else {
    passwordError.innerText = "Password must be 8+ chars, include upper, lower, digit & special char";
    passwordSuccess.innerText = "";
    failure = true;
  }

  if (password === confirmPassword && confirmPassword !== "") {
    confirmSuccess.innerText = "Passwords match";
    confirmError.innerText = "";
  } else {
    confirmError.innerText = "Passwords do not match";
    confirmSuccess.innerText = "";
    failure = true;
  }

  return !failure;
}
