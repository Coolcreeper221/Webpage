document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.querySelector("input[type='email']");
  const passwordInput = document.querySelector("input[type='password']");
  const submitButton = document.querySelector(".button.primary");

  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!password) {
      alert("Please enter a password.");
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Send login data to backend
    try {
      const response = await fetch(
        "https://api.adan-garcia.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: hashedPassword,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const token = data.token; // Get the token from the response
        localStorage.setItem("token", token); // Store token in localStorage
        // Redirect to a protected page after successful login
        window.location.href = "/maddie/calendar"; // Or the protected route
      } else {
        alert("Login failed.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert(
        "An error occurred while trying to log in. The server may be offline",
        error
      );
    }
  });

  // Validate email using regex
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Hash password using SHA-256
  async function hashPassword(password) {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  }
});
