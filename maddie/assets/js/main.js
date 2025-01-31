/*
	Stellar by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {
  var $window = $(window),
    $body = $("body"),
    $main = $("#main");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["361px", "480px"],
    xxsmall: [null, "360px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Nav.
  var $nav = $("#nav");

  if ($nav.length > 0) {
    // Shrink effect.
    $main.scrollex({
      mode: "top",
      enter: function () {
        $nav.addClass("alt");
      },
      leave: function () {
        $nav.removeClass("alt");
      },
    });

    // Links.
    var $nav_a = $nav.find("a");

    $nav_a
      .scrolly({
        speed: 1000,
        offset: function () {
          return $nav.height();
        },
      })
      .on("click", function () {
        var $this = $(this);

        // External link? Bail.
        if ($this.attr("href").charAt(0) != "#") return;

        // Deactivate all links.
        $nav_a.removeClass("active").removeClass("active-locked");

        // Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
        $this.addClass("active").addClass("active-locked");
      })
      .each(function () {
        var $this = $(this),
          id = $this.attr("href"),
          $section = $(id);

        // No section for this link? Bail.
        if ($section.length < 1) return;

        // Scrollex.
        $section.scrollex({
          mode: "middle",
          initialize: function () {
            // Deactivate section.
            if (browser.canUse("transition")) $section.addClass("inactive");
          },
          enter: function () {
            // Activate section.
            $section.removeClass("inactive");

            // No locked links? Deactivate all links and activate this section's one.
            if ($nav_a.filter(".active-locked").length == 0) {
              $nav_a.removeClass("active");
              $this.addClass("active");
            }

            // Otherwise, if this section's link is the one that's locked, unlock it.
            else if ($this.hasClass("active-locked"))
              $this.removeClass("active-locked");
          },
        });
      });
  }

  // Scrolly.
  $(".scrolly").scrolly({
    speed: 1000,
  });
})(jQuery);

if (!window.location.href.includes("/maddie/login/")) {
  console.log("href:", window.location.href);
  const pageList = document.getElementById("pageList");
  document
    .getElementById("pageListButton")
    .addEventListener("click", togglebutton);

  // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
    const button = document.getElementById("pageListButton");

    if (!pageList.contains(event.target) && event.target !== button) {
      hideButton();
    }
  });

  function togglebutton() {
    if (pageList.style.display == "block") {
      hideButton();
    } else {
      showButton();
    }
  }
  // Example: Hide the button and disable focus
  function hideButton() {
    pageList.setAttribute("inert", "true");
    pageList.style.display = "none"; // Also hides it visually
  }

  // Example: Show the button and enable focus
  function showButton() {
    pageList.removeAttribute("inert");
    pageList.style.display = "block"; // Makes it visible again
  }
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        if (registration.active && registration.scope !== "/maddie/") {
          registration.unregister().then(() => {
            console.log("Unregistered old SW:", registration.scope);
          });
        }
      });
    });
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (!registration) {
        navigator.serviceWorker
          .register("/maddie/service-worker.js")
          .then(() => console.log("Service Worker registered."))
          .catch((err) => console.error("SW Registration Failed:", err));
      }
    });
  }
}
