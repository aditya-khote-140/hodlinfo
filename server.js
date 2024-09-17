const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const path = require("path");
const app = express();
const port = 3000;

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/hodlinfo", {
    useNewUrlParser: true, // These options are no longer needed in Mongoose 6+, so they can be removed safely
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Define the schema
const cryptoSchema = new mongoose.Schema({
  name: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String,
});

// Create the model
const Crypto = mongoose.model("Crypto", cryptoSchema);

// Fetch and store data function
const fetchData = async () => {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers");

    // The API response is a flat object with keys as ticker names, so get the top 10 tickers
    const tickers = response.data;
    const top10 = Object.keys(tickers).slice(0, 10); // Get top 10 keys

    // Clear the existing collection
    await Crypto.deleteMany({});

    // Loop through top 10 tickers and save to MongoDB
    for (let key of top10) {
      const { last, buy, sell, volume, base_unit } = tickers[key];
      const crypto = new Crypto({
        name: key,
        last,
        buy,
        sell,
        volume,
        base_unit,
      });
      await crypto.save(); // Save each document in MongoDB
    }
    console.log("Top 10 results stored successfully.");
  } catch (error) {
    console.error("Error fetching or storing data:", error);
  }
};

// Fetch data when the server starts
fetchData();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Define API route to retrieve data from MongoDB
app.get("/api/data", async (req, res) => {
  try {
    const data = await Crypto.find({}); // Fetch all stored records
    res.json(data); // Send data as JSON response
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
