document.addEventListener("DOMContentLoaded", async () => {
  const resultDiv = document.getElementById("result");
  const copyButton = document.getElementById("copy");
  const notificationContainer = document.getElementById("notification");
  const notificationText = notificationContainer
    ? notificationContainer.querySelector(".popup__notification__text")
    : null;

  if (
    !resultDiv ||
    !copyButton ||
    !notificationContainer ||
    !notificationText
  ) {
    console.error(
      "ThemeExtractor: Required DOM elements not found in popup.html"
    );
    return;
  }

  const showNotification = (message, isSuccess = true) => {
    notificationText.textContent = message;
    notificationContainer.classList.remove("success", "error"); // Clear previous states
    notificationContainer.classList.add(isSuccess ? "success" : "error"); // Add new state
    notificationContainer.style.display = "block"; // Make visible

    setTimeout(() => {
      notificationContainer.style.display = "none";
    }, 3000);
  };

  const copyToClipboard = async () => {
    const textToCopy = resultDiv.textContent.trim();
    if (
      !textToCopy ||
      textToCopy === "Extraction failed." ||
      textToCopy === "Extracting theme..."
    ) {
      showNotification("Nothing to copy!", false);
      return;
    }
    try {
      await navigator.clipboard.writeText(textToCopy);
      showNotification("Copied to clipboard!");
    } catch (err) {
      console.error("ThemeExtractor: Could not copy text:", err);
      showNotification("Could not copy text :(", false);
    }
  };

  copyButton.addEventListener("click", copyToClipboard);

  resultDiv.textContent = "Extracting theme...";

  showNotification("Extracting...", true);

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.id) {
    showNotification("Could not get active tab.", false);
    resultDiv.textContent = "Extraction failed.";
    return;
  }

  try {
    // Ensure the content script is executed in the target tab.
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["scripts/content.js"],
    });

    // Send message to the content script and await its response
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: "extractTheme",
    });

    if (response && response.themeData) {
      resultDiv.textContent = JSON.stringify(response.themeData, null, 2);
      showNotification("Theme extracted successfully!", true);
    } else {
      showNotification(
        "No theme data received or unexpected response from page.",
        false
      );
      resultDiv.textContent = "Extraction failed.";
    }
  } catch (error) {
    console.error("ThemeExtractor: Error during extraction:", error);
    showNotification(
      `Error: ${error.message || "Unknown error during extraction."}`,
      false
    );
    resultDiv.textContent = "Extraction failed.";
  }
});
