const express = require('express');
const router = express.Router();
const db = require('./db');

// Crear producto
router.post('/productos', (req, res) => {
  const { nombre, codigo, id_categoria, id_proveedor, precio, cantidad } = req.body;
  const sql = `INSERT INTO productos (nombre, codigo, id_categoria, id_proveedor, precio, cantidad)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [nombre, codigo, id_categoria, id_proveedor, precio, cantidad], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Producto registrado correctamente', id: result.insertId });
  });
});

// Obtener todos los productos
router.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Actualizar producto por ID
router.put('/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, codigo, id_categoria, id_proveedor, precio, cantidad } = req.body;
  const sql = `UPDATE productos SET nombre=?, codigo=?, id_categoria=?, id_proveedor=?, precio=?, cantidad=?
               WHERE id_producto=?`;
  db.query(sql, [nombre, codigo, id_categoria, id_proveedor, precio, cantidad, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Producto actualizado correctamente' });
  });
});

// Eliminar producto por ID
router.delete('/productos/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM productos WHERE id_producto=?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Producto eliminado correctamente' });
  });
});

module.exports = router;
