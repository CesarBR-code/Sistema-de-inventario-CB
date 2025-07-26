const pool = require('../db');

/**
 * Obtiene los productos más vendidos.
 *
 * Los productos se ordenan por la suma de las cantidades registradas en movimientos
 * de tipo 'salida'. El parámetro opcional `limit` controla cuántos resultados se
 * devuelven (por defecto 5).
 */
exports.productosMasVendidos = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  try {
    const query = `SELECT p.id_producto, p.nombre, SUM(m.cantidad) AS total_vendido
                   FROM movimientos_inventario m
                   JOIN productos p ON m.id_producto = p.id_producto
                   WHERE m.tipo_movimiento = 'salida'
                   GROUP BY p.id_producto, p.nombre
                   ORDER BY total_vendido DESC
                   LIMIT ?`;
    const [rows] = await pool.query(query, [limit]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error.message);
    res.status(500).json({ error: 'Error al obtener reporte de productos más vendidos' });
  }
};

/**
 * Obtiene los productos con bajo stock.
 *
 * Devuelve aquellos productos cuya cantidad actual es menor o igual al
 * stock mínimo definido. El parámetro `limit` controla cuántos registros
 * se devuelven (por defecto 10).
 */
exports.productosBajoStock = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  try {
    const query = `SELECT id_producto, nombre, cantidad, stock_minimo
                   FROM productos
                   WHERE cantidad <= stock_minimo
                   ORDER BY cantidad ASC
                   LIMIT ?`;
    const [rows] = await pool.query(query, [limit]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos con bajo stock:', error.message);
    res.status(500).json({ error: 'Error al obtener reporte de bajo stock' });
  }
};