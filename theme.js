const isButtonPressed = localStorage.getItem("buttonPressed") === "1";
const currentPage = window.location.pathname; // Get current path (e.g., /subpage.html or /index.html)
const isHomepage = currentPage === "/"; // Check if it's the homepage

if (!isButtonPressed && !isHomepage) {
  window.location.href = "../"; // Redirect to homepage
}

var count = 0;
var button = document.querySelector(".secret");

button.addEventListener("click", function () {
  count++;

  if (count >= 10) {
    window.location.href = "404/";
    localStorage.setItem("buttonPressed", "1");
  } else {
    localStorage.setItem("buttonPressed", "0");
  }
});
