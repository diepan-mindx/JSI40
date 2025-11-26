// =================================================
// login

// =================================================
// signup
const signupForm = document.getElementById("signup-form");
function validateSignupForm(email, username, password, confirmPassword) {
  // username >= 6 + no space
  if (username.length < 6) {
    alert("Tên người dùng phải có 6 kí tự trở lên.");
    return false;
  }
  if (username.includes(" ")) {
    alert("Tên người dùng không được dùng dấu cách");
    return false;
  }
  // pass >= 6
  if (password < 6) {
    alert("Mật khẩu phải cókhẩuí tự trở lên.");
    return false;
  }
  // pass == confirmpass
  if (password !== confirmPassword) {
    alert("Mật khẩu không trùng khớp với trường nhập lại.");
    return false;
  }
  return true;
}

signupForm.addEventListener("submit", () => {
  // ---------------------------------------
  // validate form
  const username = signupForm.getElementById("signupUsername");
  const email = signupForm.getElementById("signupEmail");
  const password = signupForm.getElementById("signupPassword");
  const confirmPassword = signupForm.getElementById("signupConfirmPassword");
  if (
    validateSignupForm(
      username.value,
      email.value,
      password.value,
      confirmPassword.value
    )
  ) {
    // --------------------------------------
    // kiem tra khong duoc trung email + username cu

    // --------------------------------------
    // create account with firebase
  }
});
