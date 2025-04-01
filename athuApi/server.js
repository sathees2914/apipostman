// npm install express body-parser

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json());

// In-memory data store
let dataStore = [];

// Basic Auth Middleware
const basicAuth = (req, res, next) => {
  const auth = req.headers["authorization"];
  if (auth === "Basic " + Buffer.from("admin:password").toString("base64")) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

// GET Request - Fetch Data
app.get("/api/data", basicAuth, (req, res) => {
  res.json({ message: "GET request successful", data: dataStore });
});

// POST Request - Add Data
app.post("/api/data", basicAuth, (req, res) => {
  const newData = req.body;
  dataStore.push(newData);
  res.json({ message: "POST request successful", received: newData });
});

// PUT Request - Update Data
app.put("/api/data/:id", basicAuth, (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= 0 && id < dataStore.length) {
    dataStore[id] = req.body;
    res.json({ message: "PUT request successful", updated: dataStore[id] });
  } else {
    res.status(404).json({ error: "Data not found" });
  }
});

// DELETE Request - Delete Data
app.delete("/api/data/:id", basicAuth, (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= 0 && id < dataStore.length) {
    dataStore.splice(id, 1);
    res.json({ message: `DELETE request successful for ID: ${id}` });
  } else {
    res.status(404).json({ error: "Data not found" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
