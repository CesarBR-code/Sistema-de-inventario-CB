const pool = require('../db');
const { registrarAuditoria } = require('../helpers/auditHelper');

/**
 * Obtiene la lista completa de productos junto con su categoría y proveedor.
 *
 * Esta función realiza un JOIN con las tablas de categorías y proveedores
 * para devolver nombres descriptivos en lugar de solo IDs.
 */
exports.getAll = async (req, res) => {
  try {
    const query = `SELECT p.*, c.nombre_categoria, pr.nombre AS nombre_proveedor
                   FROM productos p
                   JOIN categorias c ON p.id_categoria = c.id_categoria
                   JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor`;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

/**
 * Obtiene un producto por su ID.
 */
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT p.*, c.nombre_categoria, pr.nombre AS nombre_proveedor
                   FROM productos p
                   JOIN categorias c ON p.id_categoria = c.id_categoria
                   JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
                   WHERE p.id_producto = ?`;
    const [rows] = await pool.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error.message);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

/**
 * Crea un nuevo producto.
 */
exports.create = async (req, res) => {
  const { nombre, codigo, id_categoria, id_proveedor, precio, cantidad, stock_minimo } = req.body;
  const idUsuario = req.userId || 1; // Por ahora se usa un id fijo; en producción se extrae del token
  try {
    const query = `INSERT INTO productos (nombre, codigo, id_categoria, id_proveedor, precio, cantidad, stock_minimo)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.query(query, [nombre, codigo, id_categoria, id_proveedor, precio, cantidad || 0, stock_minimo || 0]);
    // Registrar en auditoría
    await registrarAuditoria(idUsuario, 'Creó producto', 'productos', result.insertId);
    res.status(201).json({ id_producto: result.insertId, mensaje: 'Producto creado correctamente' });
  } catch (error) {
    console.error('Error al crear producto:', error.message);
    res.status(500).json({ error: 'Error al crear producto', detalles: error.message });
  }
};

/**
 * Actualiza un producto existente.
 */
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombre, codigo, id_categoria, id_proveedor, precio, cantidad, stock_minimo } = req.body;
  const idUsuario = req.userId || 1;
  try {
    // Verificar si el producto existe
    const [existing] = await pool.query('SELECT id_producto FROM productos WHERE id_producto = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const query = `UPDATE productos SET nombre = ?, codigo = ?, id_categoria = ?, id_proveedor = ?, precio = ?, cantidad = ?, stock_minimo = ? WHERE id_producto = ?`;
    await pool.query(query, [nombre, codigo, id_categoria, id_proveedor, precio, cantidad, stock_minimo, id]);
    await registrarAuditoria(idUsuario, 'Actualizó producto', 'productos', id);
    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error.message);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

/**
 * Elimina un producto.
 */
exports.remove = async (req, res) => {
  const { id } = req.params;
  const idUsuario = req.userId || 1;
  try {
    const [existing] = await pool.query('SELECT id_producto FROM productos WHERE id_producto = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    await pool.query('DELETE FROM productos WHERE id_producto = ?', [id]);
    await registrarAuditoria(idUsuario, 'Eliminó producto', 'productos', id);
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error.message);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};