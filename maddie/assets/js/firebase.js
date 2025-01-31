import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js";
const firebaseConfig = {
  apiKey: "AIzaSyA05rZGzqQJ2j6zjWXh4FjNF9OmSceD9h0",
  authDomain: "maddie-e9b73.firebaseapp.com",
  projectId: "maddie-e9b73",
  storageBucket: "maddie-e9b73.firebasestorage.app",
  messagingSenderId: "521450096310",
  appId: "1:521450096310:web:c5e9b5b2b27a0800cfc817",
  measurementId: "G-D0QVH5T93R",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);
async function requestPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      return getToken(messaging, { vapidKey: "YOUR_PUBLIC_VAPID_KEY" });
    } else {
      console.error("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error requesting permission:", error);
  }
}
async function sendTokenToServer(token) {
  const jwt = localStorage.getItem("token"); // Get JWT token from storage

  if (!jwt) {
    console.error("User is not authenticated");
    return;
  }

  try {
    const response = await fetch("/api/save-fcm-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ fcmToken: token }),
    });

    if (!response.ok) throw new Error("Failed to save token");
    console.log("FCM Token successfully sent to server.");
  } catch (error) {
    console.error("Error sending token:", error);
  }
}

requestPermission().then((token) => {
  if (token) sendTokenToServer(token);
});
