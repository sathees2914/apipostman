const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key";

app.use(cors());
app.use(bodyParser.json());

// Mock user data
const users = {
  admin: "password123",
};

// Mock database for items
let items = [
  { id: 1, name: "Item 1", description: "First item" },
  { id: 2, name: "Item 2", description: "Second item" },
];

// Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Middleware to Verify Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// CRUD Routes
app.get("/items", authenticateToken, (req, res) => {
  res.json(items);
});

app.post("/items", authenticateToken, (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.put("/items/:id", authenticateToken, (req, res) => {
  const item = items.find((item) => item.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: "Item not found" });

  Object.assign(item, req.body);
  res.json(item);
});

app.delete("/items/:id", authenticateToken, (req, res) => {
  const itemIndex = items.findIndex(
    (item) => item.id === parseInt(req.params.id)
  );
  if (itemIndex === -1)
    return res.status(404).json({ message: "Item not found" });

  items.splice(itemIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
