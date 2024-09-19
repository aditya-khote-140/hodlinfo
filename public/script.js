document.addEventListener("DOMContentLoaded", async () => {
  const cryptoData = document.getElementById("crypto-data");

  try {
    const response = await fetch("/api/data");
    const data = await response.json();

    data.forEach((crypto, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${crypto.name.toUpperCase()}</td>
        <td>₹ ${crypto.last}</td>
        <td>₹ ${crypto.buy} / ₹ ${crypto.sell}</td>
        <td>${(crypto.last - crypto.buy).toFixed(2)}%</td>
        <td>₹ ${crypto.sell - crypto.buy}</td>
      `;

      cryptoData.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    cryptoData.innerHTML = "<tr><td colspan='6'>Error loading data</td></tr>";
  }
});
