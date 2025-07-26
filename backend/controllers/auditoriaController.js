const pool = require('../db');

/**
 * Devuelve todas las entradas de la auditoría con información del usuario.
 */
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT a.*, u.nombre AS nombre_usuario
                                     FROM auditoria a
                                     JOIN usuarios u ON a.id_usuario = u.id_usuario
                                     ORDER BY a.fecha DESC`);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener auditoría:', error.message);
    res.status(500).json({ error: 'Error al obtener auditoría' });
  }
};