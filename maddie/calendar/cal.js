// Get current date
const currentDate = new Date();
const displayDate = new Date();
// Set the fixed "grayed out" date: January 23, 2025
const grayOutDate = new Date("2025-01-23");

// Select DOM elements
const monthYearElement = document.getElementById("month-year");
const calendarDaysElement = document.getElementById("calendar-days");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");

// Function to check if two dates are the same day (ignores time)
function isSameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

// Function to display the calendar for the current month
function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Set the current month-year text
  monthYearElement.textContent = `${date.toLocaleString("default", {
    month: "long",
  })} ${year}`;

  // Clear previous days
  calendarDaysElement.innerHTML = "";

  // Get first day of the month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Get the day of the week for the 1st day (0: Sunday, 1: Monday, etc.)
  const firstDayOfWeek = firstDay.getDay();
  const LastDayOfWeek = lastDay.getDay();
  // Create an array to hold the days of the month
  let days = [];

  // Add previous month's days to the first row
  const prevMonthDays = new Date(year, month, 0).getDate();
  const prevMonthDayStart = prevMonthDays - firstDayOfWeek + 1;
  for (let i = prevMonthDayStart; i <= prevMonthDays; i++) {
    days.push({ day: i, isCurrentMonth: false, isNextMonth: false }); // Previous month’s days
  }

  // Add the current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ day: day, isCurrentMonth: true, isNextMonth: false });
  }

  // Add next month's days to complete the last week (6 weeks in total)
  const nextMonthDays = new Date(year, month, 6).getDate();
  const nextMonthDayStart = LastDayOfWeek + 1;
  for (let i = nextMonthDayStart; i <= nextMonthDays; i++) {
    days.push({ day: i, isCurrentMonth: false, isNextMonth: false }); // Previous month’s days
  }

  // Create the calendar rows (weeks)
  let weekRow = [];
  for (let i = 0; i < days.length; i++) {
    weekRow.push(days[i]);
    if (weekRow.length === 7 || i === days.length - 1) {
      const rowElement = document.createElement("tr");
      weekRow.forEach((day) => {
        const cell = document.createElement("td");

        const currentCellDate = new Date(year, month, day.day);

        // Check if the current day is today (compare full date: day, month, and year)
        if (day.isCurrentMonth && isSameDay(currentCellDate, currentDate)) {
          cell.classList.add("today");
        }

        // Gray out days before 1/23/25
        if (currentCellDate < grayOutDate) {
          cell.classList.add("empty");
        }

        // Gray out days after today
        if (currentCellDate > currentDate) {
          cell.classList.add("empty");
        }

        // Add next and previous month days with special styling
        if (!day.isCurrentMonth) {
          cell.classList.add("empty");
        }

        if (day.isCurrentMonth) {
          cell.textContent = day.day;
          if (!cell.classList.contains("empty")) {
            cell.addEventListener("click", () =>
              fetchAndTypeMessage(currentCellDate.toJSON().slice(0, 10))
            );
          }
        }

        rowElement.appendChild(cell);
      });
      calendarDaysElement.appendChild(rowElement);
      weekRow = [];
    }
  }
  fetchAndTypeMessage(currentDate.toJSON().slice(0, 10));
}

// Event listeners for changing months
prevMonthButton.addEventListener("click", () => {
  displayDate.setMonth(displayDate.getMonth() - 1);
  renderCalendar(displayDate);
});

nextMonthButton.addEventListener("click", () => {
  displayDate.setMonth(displayDate.getMonth() + 1);
  renderCalendar(displayDate);
});

// Initial rendering of the calendar
renderCalendar(currentDate);
// Typing effect for the message display

// Call this function when the response from the API is received
async function fetchAndTypeMessage(date) {
  try {
    const response = await fetch(
      `https://api.adan-garcia.com/api/dailymessages/${date}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      typingCancelled = true;
      document.getElementById("messageDisplay").textContent = ""; // Clear previous message
      typeMessage(data.message); // Call the typewriter effect
    } else {
      document.getElementById("messageDisplay").textContent =
        "No message found.";
    }
  } catch (error) {
    console.error("Error fetching message:", error);
  }
}
let typingCancelled = false; // Flag to track if typing should be cancelled

async function typeMessage(message) {
  const messageDisplay = document.getElementById("messageDisplay");
  const typingSpeed = 50; // Speed of typing each character
  const typoChance = 0.025; // Chance of a typo

  // Function to simulate a typo by altering adjacent keys
  function generateTypo(correctChar) {
    const keyMap = {
      a: ["q", "w", "s", "z"],
      b: ["v", "n", "h", "g"],
      c: ["x", "d", "f", "v"],
      d: ["s", "e", "r", "f", "c"],
      e: ["w", "r", "t", "d", "s"],
      f: ["d", "r", "t", "g", "v"],
      g: ["f", "t", "y", "h", "b"],
      h: ["g", "y", "u", "j", "n"],
      i: ["u", "o", "k", "j"],
      j: ["h", "u", "i", "k", "n"],
      k: ["j", "i", "l", "o", "m"],
      l: ["k", "o", "p"],
      m: ["n", "k", "l", "j"],
      n: ["b", "m", "j", "h"],
      o: ["i", "p", "l", "k"],
      p: ["o", "l"],
      q: ["w", "a", "s"],
      r: ["e", "d", "f", "t"],
      s: ["a", "w", "e", "d", "z"],
      t: ["r", "f", "g", "y"],
      u: ["y", "h", "j", "i"],
      v: ["c", "b", "g", "f"],
      w: ["q", "e", "s", "a"],
      x: ["c", "s", "d", "z"],
      y: ["t", "g", "h", "u"],
      z: ["a", "s", "x"],
      // Add the rest of the keymap as per your Godot code
    };

    if (keyMap[correctChar]) {
      const adjacentKeys = keyMap[correctChar];
      return adjacentKeys[Math.floor(Math.random() * adjacentKeys.length)];
    }
    return correctChar; // If no adjacent key found, return the character itself
  }

  // Clear the previous message if a new one is about to start
  messageDisplay.textContent = "";
  await new Promise((resolve) => setTimeout(resolve, 2 * typingSpeed));
  // Cancel typing if needed
  typingCancelled = false;

  for (let i = 0; i < message.length; i++) {
    if (typingCancelled) return; // Stop typing if canceled

    let character = message[i];

    // Simulate typo chance
    if (Math.random() < typoChance) {
      // Generate and display the typo
      const typo = generateTypo(character);
      messageDisplay.textContent += typo; // Add the random typo
      await new Promise((resolve) => setTimeout(resolve, typingSpeed));
      messageDisplay.textContent = messageDisplay.textContent.slice(0, -1); // Erase the typo
    }

    // Add the correct character
    messageDisplay.textContent += character; // Add the correct character
    await new Promise((resolve) => setTimeout(resolve, typingSpeed));
  }
}
