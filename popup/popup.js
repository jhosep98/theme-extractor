console.log("popup.js loaded");

const extractButton = document.getElementById("extract");
const resultDiv = document.getElementById("result");

extractButton.addEventListener("click", () => {
  console.log("Extracting theme");
  resultDiv.textContent = JSON.stringify(
    {
      theme: "dark",
      colors: {
        primary: "#000000",
        secondary: "#ffffff",
        tertiary: "#000000",
      },
    },
    null,
    2
  );
});
