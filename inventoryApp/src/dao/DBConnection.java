package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Maneja la obtención de conexiones a la base de datos MySQL.
 *
 * Esta clase centraliza la lógica de conexión para reutilizarla en todo el proyecto.
 */
public class DBConnection {
    // URL de conexión de la base de datos. Ajustar el puerto, nombre de base de datos, parámetros y zona horaria según sea necesario.
    private static final String URL = "jdbc:mysql://localhost:3306/inventario cb";
    // Nombre de usuario con permisos para acceder a la base de datos.
    private static final String USER = "root";
    // Contraseña asociada al usuario.
    private static final String PASSWORD = "";

    /**
     * Obtiene una nueva conexión a la base de datos.
     *
     * @return Una instancia de {@link Connection} activa.
     * @throws SQLException si ocurre un error al conectar.
     */
    public static Connection getConnection() throws SQLException {
        try {
            // Registrar el driver de MySQL. No es estrictamente necesario con JDBC 4.0+, pero se incluye para claridad.
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            // En caso de que el driver no se encuentre en el classpath, se lanza un error.
            throw new SQLException("No se encontró el driver MySQL JDBC", e);
        }
        // Devolver una conexión activa usando las credenciales configuradas.
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}