const express = require('express');
const router = express.Router();
const db = require('./db');

// Insertar producto
router.post('/productos', (req, res) => {
  const { nombre, codigo, id_categoria, id_proveedor, precio, cantidad } = req.body;
  const sql = `INSERT INTO productos (nombre, codigo, id_categoria, id_proveedor, precio, cantidad) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [nombre, codigo, id_categoria, id_proveedor, precio, cantidad], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Producto registrado correctamente', id: result.insertId });
  });
});

// Consultar productos
router.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
