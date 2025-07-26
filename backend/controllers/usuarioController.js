const pool = require('../db');
const { registrarAuditoria } = require('../helpers/auditHelper');
// En una aplicación real se recomienda utilizar bcrypt para cifrar contraseñas.

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT u.id_usuario, u.nombre, u.correo, u.id_rol, u.estado, r.nombre_rol
                                      FROM usuarios u
                                      JOIN roles r ON u.id_rol = r.id_rol`);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error.message);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`SELECT u.id_usuario, u.nombre, u.correo, u.id_rol, u.estado, r.nombre_rol
                                     FROM usuarios u
                                     JOIN roles r ON u.id_rol = r.id_rol
                                     WHERE u.id_usuario = ?`, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error.message);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

exports.create = async (req, res) => {
  const { nombre, correo, contraseña, id_rol, estado } = req.body;
  const idUsuario = req.userId || 1;
  try {
    // Verificar correo único
    const [existing] = await pool.query('SELECT id_usuario FROM usuarios WHERE correo = ?', [correo]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Ya existe un usuario con ese correo' });
    }
    const [result] = await pool.query('INSERT INTO usuarios (nombre, correo, contraseña, id_rol, estado) VALUES (?, ?, ?, ?, ?)', [nombre, correo, contraseña, id_rol, estado ?? 1]);
    await registrarAuditoria(idUsuario, 'Creó usuario', 'usuarios', result.insertId);
    res.status(201).json({ id_usuario: result.insertId, mensaje: 'Usuario creado correctamente' });
  } catch (error) {
    console.error('Error al crear usuario:', error.message);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, contraseña, id_rol, estado } = req.body;
  const idUsuario = req.userId || 1;
  try {
    const [existing] = await pool.query('SELECT id_usuario FROM usuarios WHERE id_usuario = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    await pool.query('UPDATE usuarios SET nombre = ?, correo = ?, contraseña = ?, id_rol = ?, estado = ? WHERE id_usuario = ?', [nombre, correo, contraseña, id_rol, estado, id]);
    await registrarAuditoria(idUsuario, 'Actualizó usuario', 'usuarios', id);
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error.message);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const idUsuario = req.userId || 1;
  try {
    const [existing] = await pool.query('SELECT id_usuario FROM usuarios WHERE id_usuario = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
    await registrarAuditoria(idUsuario, 'Eliminó usuario', 'usuarios', id);
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error.message);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};