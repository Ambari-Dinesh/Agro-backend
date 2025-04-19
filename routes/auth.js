const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');

const db = require("../db"); // assuming you're using pg or knex
const jwt = require("jsonwebtoken");

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
    [name, email, hashedPassword, role || "buyer"]
  );

  const user = result.rows[0];
  const token = jwt.sign(user, process.env.JWT_TOKEN);

  res.json({ user, token });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = result.rows[0];

  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign(user, process.env.JWT_TOKEN);

  res.json({ user, token });
});

module.exports = router;
