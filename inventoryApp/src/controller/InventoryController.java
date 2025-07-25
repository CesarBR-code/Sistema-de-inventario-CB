package controller;

import dao.ProductDAO;
import javafx.beans.property.SimpleDoubleProperty;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.Region;
import model.Product;

import java.net.URL;
import java.sql.SQLException;
import java.util.List;
import java.util.ResourceBundle;

/**
 * Controlador para la vista de inventario.
 * Administra las interacciones del usuario con la interfaz, como agregar, eliminar y refrescar productos.
 */
public class InventoryController implements Initializable {

    @FXML
    private TextField nombreField;
    @FXML
    private TextField codigoField;
    @FXML
    private TextField categoriaField;
    @FXML
    private TextField proveedorField;
    @FXML
    private TextField precioField;
    @FXML
    private TextField cantidadField;
    @FXML
    private TableView<Product> tablaProductos;
    @FXML
    private TableColumn<Product, Integer> colId;
    @FXML
    private TableColumn<Product, String> colNombre;
    @FXML
    private TableColumn<Product, String> colCodigo;
    @FXML
    private TableColumn<Product, Integer> colCategoria;
    @FXML
    private TableColumn<Product, Integer> colProveedor;
    @FXML
    private TableColumn<Product, Double> colPrecio;
    @FXML
    private TableColumn<Product, Integer> colCantidad;
    @FXML
    private Label estadoLabel;

    // Fuente de datos para la tabla
    private final ObservableList<Product> datosProductos = FXCollections.observableArrayList();

    // DAO para realizar operaciones sobre la base de datos
    private final ProductDAO productoDAO = new ProductDAO();

    /**
     * Se ejecuta automáticamente después de cargar la FXML. Configura la tabla y carga los productos.
     */
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        // Configurar columnas con propiedades del modelo
    	colId.setCellValueFactory(new PropertyValueFactory<>("idProducto"));
    	colNombre.setCellValueFactory(new PropertyValueFactory<>("nombre"));
    	colCodigo.setCellValueFactory(new PropertyValueFactory<>("codigo"));
    	colCategoria.setCellValueFactory(new PropertyValueFactory<>("idCategoria"));
    	colProveedor.setCellValueFactory(new PropertyValueFactory<>("idProveedor"));
    	colPrecio.setCellValueFactory(new PropertyValueFactory<>("precio"));
    	colCantidad.setCellValueFactory(new PropertyValueFactory<>("cantidad"));

        // Asociar lista observable a la tabla
        tablaProductos.setItems(datosProductos);

        // Cargar datos iniciales desde la base de datos
        refrescarProductos(null);
    }

    /**
     * Maneja el evento de guardar producto. Valida los campos, crea un objeto Product y lo inserta en la base de datos.
     * Si la operación es exitosa, actualiza la tabla y muestra un mensaje informativo.
     */
    @FXML
    private void guardarProducto(ActionEvent event) {
        // Validar campos obligatorios
        if (nombreField.getText().isBlank() || codigoField.getText().isBlank() ||
                categoriaField.getText().isBlank() || proveedorField.getText().isBlank() ||
                precioField.getText().isBlank() || cantidadField.getText().isBlank()) {
            mostrarAlerta(Alert.AlertType.WARNING, "Campos obligatorios", "Por favor complete todos los campos.");
            return;
        }
        try {
            // Convertir valores de texto a tipos numéricos
            int categoriaId = Integer.parseInt(categoriaField.getText());
            int proveedorId = Integer.parseInt(proveedorField.getText());
            double precio = Double.parseDouble(precioField.getText());
            int cantidad = Integer.parseInt(cantidadField.getText());

            // Crear el producto con los datos ingresados
            Product producto = new Product();
            producto.setNombre(nombreField.getText());
            producto.setCodigo(codigoField.getText());
            producto.setIdCategoria(categoriaId);
            producto.setIdProveedor(proveedorId);

            producto.setPrecio(precio);
            producto.setCantidad(cantidad);

            // Guardar en la base de datos
            productoDAO.agregarProducto(producto);

            // Limpiar el formulario
            limpiarCampos();

            // Actualizar la tabla
            refrescarProductos(null);

            // Mostrar mensaje de éxito
            estadoLabel.setText("Producto guardado correctamente");
        } catch (NumberFormatException nfe) {
            mostrarAlerta(Alert.AlertType.ERROR, "Formato incorrecto", "Verifique los valores numéricos ingresados.");
        } catch (SQLException e) {
            mostrarAlerta(Alert.AlertType.ERROR, "Error de base de datos", "No se pudo guardar el producto: " + e.getMessage());
        }
    }

    /**
     * Maneja el evento de eliminar producto. Obtiene el producto seleccionado en la tabla y lo elimina de la base de datos.
     */
    @FXML
    private void eliminarProducto(ActionEvent event) {
        Product seleccionado = tablaProductos.getSelectionModel().getSelectedItem();
        if (seleccionado == null) {
            mostrarAlerta(Alert.AlertType.WARNING, "Selección requerida", "Seleccione un producto a eliminar.");
            return;
        }
        // Confirmar eliminación
        Alert confirmacion = new Alert(Alert.AlertType.CONFIRMATION);
        confirmacion.setTitle("Confirmar eliminación");
        confirmacion.setHeaderText(null);
        confirmacion.setContentText("¿Está seguro de eliminar el producto seleccionado?");
        confirmacion.getDialogPane().setMinHeight(Region.USE_PREF_SIZE);
        confirmacion.showAndWait().ifPresent(response -> {
            if (response == ButtonType.OK) {
                try {
                	productoDAO.eliminarProducto(seleccionado.getIdProducto());
                    refrescarProductos(null);
                    estadoLabel.setText("Producto eliminado correctamente");
                } catch (SQLException e) {
                    mostrarAlerta(Alert.AlertType.ERROR, "Error de base de datos", "No se pudo eliminar el producto: " + e.getMessage());
                }
            }
        });
    }

    /**
     * Maneja el evento de refrescar productos. Carga nuevamente todos los productos desde la base de datos.
     */
    @FXML
    public void refrescarProductos(ActionEvent event) {
        try {
            List<Product> lista = productoDAO.obtenerTodos();
            datosProductos.setAll(lista);
            estadoLabel.setText("Lista actualizada.");
        } catch (SQLException e) {
            mostrarAlerta(Alert.AlertType.ERROR, "Error de base de datos", "No se pudieron cargar los productos: " + e.getMessage());
        }
    }

    /**
     * Limpia todos los campos del formulario.
     */
    private void limpiarCampos() {
        nombreField.clear();
        codigoField.clear();
        categoriaField.clear();
        proveedorField.clear();
        precioField.clear();
        cantidadField.clear();
    }

    /**
     * Muestra una alerta al usuario con el tipo y mensajes especificados.
     *
     * @param tipo    Tipo de alerta (INFO, WARNING, ERROR).
     * @param titulo  Título de la ventana de alerta.
     * @param mensaje Contenido del mensaje a mostrar.
     */
    private void mostrarAlerta(Alert.AlertType tipo, String titulo, String mensaje) {
        Alert alerta = new Alert(tipo);
        alerta.setTitle(titulo);
        alerta.setHeaderText(null);
        alerta.setContentText(mensaje);
        alerta.getDialogPane().setMinHeight(Region.USE_PREF_SIZE);
        alerta.show();
    }
}