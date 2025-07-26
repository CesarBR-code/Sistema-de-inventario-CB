const pool = require('../db');
const { registrarAuditoria } = require('../helpers/auditHelper');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM roles');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener roles:', error.message);
    res.status(500).json({ error: 'Error al obtener roles' });
  }
};

exports.create = async (req, res) => {
  const { nombre_rol } = req.body;
  const idUsuario = req.userId || 1;
  try {
    const [result] = await pool.query('INSERT INTO roles (nombre_rol) VALUES (?)', [nombre_rol]);
    await registrarAuditoria(idUsuario, 'Creó rol', 'roles', result.insertId);
    res.status(201).json({ id_rol: result.insertId, mensaje: 'Rol creado correctamente' });
  } catch (error) {
    console.error('Error al crear rol:', error.message);
    res.status(500).json({ error: 'Error al crear rol' });
  }
};