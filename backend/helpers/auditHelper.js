const pool = require('../db');

/**
 * Registra una entrada en la tabla de auditoría.
 *
 * Esta función centraliza la lógica para insertar eventos de
 * auditoría en la base de datos. Se debe llamar después de
 * ejecutar la operación principal (INSERT, UPDATE o DELETE).
 *
 * @param {number} idUsuario El identificador del usuario que realizó la acción
 * @param {string} accion Descripción de la acción realizada
 * @param {string} tablaAfectada Nombre de la tabla modificada
 * @param {number|null} idRegistroAfectado ID del registro afectado, cuando aplique
 */
async function registrarAuditoria(idUsuario, accion, tablaAfectada = null, idRegistroAfectado = null) {
  try {
    const query = 'INSERT INTO auditoria (id_usuario, accion, tabla_afectada, id_registro_afectado) VALUES (?, ?, ?, ?)';
    await pool.query(query, [idUsuario, accion, tablaAfectada, idRegistroAfectado]);
  } catch (error) {
    // Este error no se envía al cliente para no exponer información interna,
    // pero se puede imprimir en el servidor o enviar a un sistema de logs.
    console.error('Error registrando auditoría:', error.message);
  }
}

module.exports = { registrarAuditoria };