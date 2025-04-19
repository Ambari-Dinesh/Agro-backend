const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("./authenticateToken");

// POST: Place an order
router.post("/", async (req, res) => {
  const { product_id, quantity, buyer_name, contact, address, user_id } = req.body;

  if (!product_id || !quantity || !buyer_name || !contact || !address || !user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await db.query(
      "INSERT INTO orders (product_id, quantity, buyer_name, contact, address, status, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [product_id, quantity, buyer_name, contact, address, "Pending", user_id]
    );
    console.log("Order placed");
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Order Insert Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});



// DELETE: Cancel/Delete order by ID (only by authenticated user)
router.delete("/:id", authenticateToken, async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  try {
    // Optional: make sure the order belongs to the user
    const check = await db.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [orderId, userId]);

    if (check.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized or order not found" });
    }

    await db.query("DELETE FROM orders WHERE id = $1", [orderId]);
    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.error("Order Delete Error:", err.message);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});


// GET: Get order by ID with product details
router.get("/:id", async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT 
        o.*, 
        p.name AS product_name,
        p.price AS product_price
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Order Fetch Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ NEW: Get all orders for the logged-in user
// GET: Get all orders for the logged-in user
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.id; // The userId should be obtained from the JWT payload.
  try {
    const result = await db.query(
      `
      SELECT 
        o.id, o.quantity, o.status, o.buyer_name, o.contact, o.address, 
        p.name AS product_name, p.price AS product_price,p.image_url
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.user_id = $1
      ORDER BY o.id DESC
      `,
      [userId] // Pass the userId from the JWT payload
    );

    res.json(result.rows); // Send the order data back as a JSON response.
  } catch (err) {
    console.error("Order Fetch Error:", err.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});


module.exports = router;
