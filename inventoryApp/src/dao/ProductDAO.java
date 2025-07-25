package dao;

import model.Product;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Proporciona métodos para realizar operaciones CRUD sobre la tabla de productos en la base de datos.
 */
public class ProductDAO {
    /**
     * Inserta un nuevo producto en la base de datos.
     *
     * @param product El producto a insertar.
     * @throws SQLException Si ocurre un error al acceder a la base de datos.
     */
    public void agregarProducto(Product product) throws SQLException {
        String sql = "INSERT INTO productos (nombre, codigo, id_categoria, id_proveedor, precio, cantidad) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, product.getNombre());
            stmt.setString(2, product.getCodigo());
            stmt.setInt(3, product.getIdCategoria());
            stmt.setInt(4, product.getIdProveedor());
            stmt.setDouble(5, product.getPrecio());
            stmt.setInt(6, product.getCantidad());
            stmt.executeUpdate();
        }
    }

    /**
     * Recupera todos los productos de la base de datos.
     *
     * @return Lista de productos encontrados.
     * @throws SQLException Si ocurre un error al acceder a la base de datos.
     */
    public List<Product> obtenerTodos() throws SQLException {
        List<Product> productos = new ArrayList<>();
        String sql = "SELECT id_producto, nombre, codigo, id_categoria, id_proveedor, precio, cantidad FROM productos";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Product p = new Product();
                p.setIdProducto(rs.getInt("id_producto"));
                p.setNombre(rs.getString("nombre"));
                p.setCodigo(rs.getString("codigo"));
                p.setIdCategoria(rs.getInt("id_categoria"));
                p.setIdProveedor(rs.getInt("id_proveedor"));
                p.setPrecio(rs.getDouble("precio"));
                p.setCantidad(rs.getInt("cantidad"));
                productos.add(p);
            }
        }
        return productos;
    }

    /**
     * Elimina un producto específico de la base de datos, según su ID.
     *
     * @param idProducto El identificador del producto a eliminar.
     * @throws SQLException Si ocurre un error al acceder a la base de datos.
     */
    public void eliminarProducto(int idProducto) throws SQLException {
        String sql = "DELETE FROM productos WHERE id_producto = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, idProducto);
            stmt.executeUpdate();
        }
    }
}
