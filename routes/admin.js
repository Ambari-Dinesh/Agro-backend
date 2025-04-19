const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all orders
router.get("/orders", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        orders.id AS order_id,
        orders.quantity,
        orders.status,
        products.id AS product_id,
        products.name AS product_name,
        products.price,
        products.image_url
      FROM orders
      JOIN products ON orders.product_id = products.id
    `);
    

    res.json(result.rows);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});
;

// Update order status
router.put("/orders/:id", async (req, res) => {
  const { status } = req.body;
  try {
    const result = await db.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new product
router.post("/products", async (req, res) => {
  const { name, price, image_url } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO products (name, price, image_url) VALUES ($1, $2, $3) RETURNING *",
      [name, price, image_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit product
router.put("/products/:id", async (req, res) => {
  const { name, price, photo } = req.body;
  try {
    const result = await db.query(
      "UPDATE products SET name = $1, price = $2, photo = $3 WHERE id = $4 RETURNING *",
      [name, price, photo, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Soft delete product
router.delete("/products/:id", async (req, res) => {
  try {
    await db.query("UPDATE products SET is_deleted = true WHERE id = $1", [req.params.id]);
    res.json({ message: "Product marked as deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get non-deleted products
router.get("/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products WHERE is_deleted = false");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
