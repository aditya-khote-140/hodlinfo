document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/data")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("crypto-container");
      container.innerHTML = data
        .map(
          (crypto) => `
        <div>
          <h2>${crypto.name}</h2>
          <p>Last: ${crypto.last}</p>
          <p>Buy: ${crypto.buy}</p>
          <p>Sell: ${crypto.sell}</p>
          <p>Volume: ${crypto.volume}</p>
          <p>Base Unit: ${crypto.base_unit}</p>
        </div>
      `
        )
        .join("");
    })
    .catch((error) => console.error("Error fetching data:", error));
});
