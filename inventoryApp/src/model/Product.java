package model;

/**
 * Representa un producto en el sistema de inventario.
 * Esta clase actúa como modelo de datos para la tabla de productos.
 * Implementa la estructura básica con atributos y métodos getters y setters.
 */
public class Product {
    private int idProducto;
    private String nombre;
    private String codigo;
    private int idCategoria;
    private int idProveedor;
    private double precio;
    private int cantidad;

    /**
     * Constructor vacío requerido por JavaFX y frameworks de persistencia.
     */
    public Product() {
    }

    /**
     * Constructor completo para crear un producto con todos sus datos.
     *
     * @param idProducto   Identificador único del producto en la base de datos.
     * @param nombre       Nombre del producto.
     * @param codigo       Código único del producto.
     * @param idCategoria  Identificador de la categoría a la que pertenece el producto.
     * @param idProveedor  Identificador del proveedor del producto.
     * @param precio       Precio unitario del producto.
     * @param cantidad     Cantidad disponible en inventario.
     */
    public Product(int idProducto, String nombre, String codigo, int idCategoria, int idProveedor, double precio, int cantidad) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.codigo = codigo;
        this.idCategoria = idCategoria;
        this.idProveedor = idProveedor;
        this.precio = precio;
        this.cantidad = cantidad;
    }

    // Métodos getters y setters para cada campo
    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public int getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(int idCategoria) {
        this.idCategoria = idCategoria;
    }

    public int getIdProveedor() {
        return idProveedor;
    }

    public void setIdProveedor(int idProveedor) {
        this.idProveedor = idProveedor;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
}
