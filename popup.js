document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let activeTab = tabs[0];
    let url = new URL(activeTab.url);

    // Fetch cookies for the current tab's URL
    chrome.cookies.getAll({ url: url.origin }, function (cookies) {
      let cookiesDisplay = document.getElementById("cookies");

      if (cookies.length > 0) {
        cookies.forEach((cookie) => {
          let cookieRow = document.createElement("div");
          cookieRow.className = "cookie-row";

          let cookieName = document.createElement("div");
          cookieName.className = "cookie-name";
          cookieName.textContent = cookie.name;

          let cookieValue = document.createElement("div");
          cookieValue.className = "cookie-value";
          cookieValue.textContent = cookie.value;

          cookieRow.appendChild(cookieName);
          cookieRow.appendChild(cookieValue);
          cookiesDisplay.appendChild(cookieRow);
        });

        // Handle the export functionality
        document
          .getElementById("export-button")
          .addEventListener("click", function () {
            exportCookies(cookies);
          });
      } else {
        cookiesDisplay.textContent = "No cookies found for this site.";
      }
    });
  });

  // Function to export cookies to a text file
  function exportCookies(cookies) {
    let cookieData = cookies
      .map((cookie) => `${cookie.name} = ${cookie.value}`)
      .join("\n");
    let blob = new Blob([cookieData], { type: "text/plain" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "cookies.txt";
    a.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  }
});
