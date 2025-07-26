const pool = require('../db');
const { registrarAuditoria } = require('../helpers/auditHelper');

/**
 * Obtiene todos los movimientos de inventario.
 *
 * Para simplificar el ejemplo, se retornan los movimientos ordenados
 * por fecha descendente junto con el nombre del producto y del usuario.
 */
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT m.*, p.nombre AS nombre_producto, u.nombre AS nombre_usuario
                                     FROM movimientos_inventario m
                                     JOIN productos p ON m.id_producto = p.id_producto
                                     JOIN usuarios u ON m.id_usuario = u.id_usuario
                                     ORDER BY m.fecha_movimiento DESC`);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener movimientos:', error.message);
    res.status(500).json({ error: 'Error al obtener movimientos' });
  }
};

/**
 * Registra un movimiento de inventario (entrada, salida o ajuste).
 *
 * Para entradas se suma la cantidad al stock actual.
 * Para salidas se resta la cantidad.
 * Para ajustes se reemplaza la cantidad con el nuevo valor proporcionado.
 */
exports.create = async (req, res) => {
  const { id_producto, tipo_movimiento, cantidad, motivo } = req.body;
  const idUsuario = req.userId || 1;
  if (!['entrada', 'salida', 'ajuste'].includes(tipo_movimiento)) {
    return res.status(400).json({ error: 'Tipo de movimiento inválido' });
  }
  try {
    // Obtener producto actual
    const [productoRows] = await pool.query('SELECT cantidad FROM productos WHERE id_producto = ?', [id_producto]);
    if (productoRows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    let nuevaCantidad = productoRows[0].cantidad;
    if (tipo_movimiento === 'entrada') {
      nuevaCantidad += parseInt(cantidad, 10);
    } else if (tipo_movimiento === 'salida') {
      nuevaCantidad -= parseInt(cantidad, 10);
      if (nuevaCantidad < 0) nuevaCantidad = 0;
    } else if (tipo_movimiento === 'ajuste') {
      nuevaCantidad = parseInt(cantidad, 10);
    }
    // Inicio de transacción
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      // Insertar movimiento
      const [result] = await conn.query('INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, cantidad, motivo, id_usuario) VALUES (?, ?, ?, ?, ?)', [id_producto, tipo_movimiento, cantidad, motivo, idUsuario]);
      // Actualizar stock de producto
      await conn.query('UPDATE productos SET cantidad = ? WHERE id_producto = ?', [nuevaCantidad, id_producto]);
      await conn.commit();
      await registrarAuditoria(idUsuario, `Registró movimiento de tipo ${tipo_movimiento}`, 'movimientos_inventario', result.insertId);
      res.status(201).json({ id_movimiento: result.insertId, mensaje: 'Movimiento registrado correctamente', nuevaCantidad });
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error al registrar movimiento:', error.message);
    res.status(500).json({ error: 'Error al registrar movimiento' });
  }
};