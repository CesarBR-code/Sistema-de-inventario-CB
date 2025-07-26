const pool = require('../db');
const { registrarAuditoria } = require('../helpers/auditHelper');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM proveedores');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener proveedores:', error.message);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM proveedores WHERE id_proveedor = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener proveedor:', error.message);
    res.status(500).json({ error: 'Error al obtener proveedor' });
  }
};

exports.create = async (req, res) => {
  const { nombre, telefono, correo, direccion } = req.body;
  const idUsuario = req.userId || 1;
  try {
    const [result] = await pool.query('INSERT INTO proveedores (nombre, telefono, correo, direccion) VALUES (?, ?, ?, ?)', [nombre, telefono, correo, direccion]);
    await registrarAuditoria(idUsuario, 'Creó proveedor', 'proveedores', result.insertId);
    res.status(201).json({ id_proveedor: result.insertId, mensaje: 'Proveedor creado correctamente' });
  } catch (error) {
    console.error('Error al crear proveedor:', error.message);
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, correo, direccion } = req.body;
  const idUsuario = req.userId || 1;
  try {
    const [existing] = await pool.query('SELECT id_proveedor FROM proveedores WHERE id_proveedor = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Proveedor no encontrado' });
    await pool.query('UPDATE proveedores SET nombre = ?, telefono = ?, correo = ?, direccion = ? WHERE id_proveedor = ?', [nombre, telefono, correo, direccion, id]);
    await registrarAuditoria(idUsuario, 'Actualizó proveedor', 'proveedores', id);
    res.json({ mensaje: 'Proveedor actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error.message);
    res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const idUsuario = req.userId || 1;
  try {
    const [existing] = await pool.query('SELECT id_proveedor FROM proveedores WHERE id_proveedor = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Proveedor no encontrado' });
    await pool.query('DELETE FROM proveedores WHERE id_proveedor = ?', [id]);
    await registrarAuditoria(idUsuario, 'Eliminó proveedor', 'proveedores', id);
    res.json({ mensaje: 'Proveedor eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error.message);
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
};