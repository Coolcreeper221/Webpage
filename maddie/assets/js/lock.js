document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/maddie/login";
    return;
  }

  await verifyToken(token);

  setInterval(() => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      verifyToken(currentToken);
    }
  }, 30 * 1000); // Check every 30 seconds
});

async function verifyToken(token) {
  try {
    const response = await fetch(
      "https://api.adan-garcia.com/api/auth/verify",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Token verification failed");
    }

    const extendResponse = await fetch(
      "https://api.adan-garcia.com/api/auth/extend-token",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (extendResponse.ok) {
      const data = await extendResponse.json();
      if (data.token) {
        localStorage.setItem("token", data.token); // Update token
      }
    } else {
      throw new Error("Failed to extend token");
    }
  } catch (error) {
    console.error(error.message);
    window.location.href = "/maddie/login"; // Redirect if verification or extension fails
  }
}

// Detect token removal or modification in localStorage
window.addEventListener("storage", (event) => {
  if (event.key === "token" && !event.newValue) {
    console.log("User logged out, redirecting to login.");
    window.location.href = "/maddie/login";
  }
});
