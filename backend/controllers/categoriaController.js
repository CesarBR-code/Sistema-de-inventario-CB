const pool = require('../db');
const { registrarAuditoria } = require('../helpers/auditHelper');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categorias');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error.message);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

exports.create = async (req, res) => {
  const { nombre_categoria } = req.body;
  const idUsuario = req.userId || 1;
  try {
    const [result] = await pool.query('INSERT INTO categorias (nombre_categoria) VALUES (?)', [nombre_categoria]);
    await registrarAuditoria(idUsuario, 'Creó categoría', 'categorias', result.insertId);
    res.status(201).json({ id_categoria: result.insertId, mensaje: 'Categoría creada correctamente' });
  } catch (error) {
    console.error('Error al crear categoría:', error.message);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombre_categoria } = req.body;
  const idUsuario = req.userId || 1;
  try {
    const [existing] = await pool.query('SELECT id_categoria FROM categorias WHERE id_categoria = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    await pool.query('UPDATE categorias SET nombre_categoria = ? WHERE id_categoria = ?', [nombre_categoria, id]);
    await registrarAuditoria(idUsuario, 'Actualizó categoría', 'categorias', id);
    res.json({ mensaje: 'Categoría actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar categoría:', error.message);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const idUsuario = req.userId || 1;
  try {
    const [existing] = await pool.query('SELECT id_categoria FROM categorias WHERE id_categoria = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    await pool.query('DELETE FROM categorias WHERE id_categoria = ?', [id]);
    await registrarAuditoria(idUsuario, 'Eliminó categoría', 'categorias', id);
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error.message);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};