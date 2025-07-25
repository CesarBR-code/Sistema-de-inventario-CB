import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

/**
 * Clase principal que inicia la aplicación JavaFX.
 */
public class Main extends Application {
    @Override
    public void start(Stage primaryStage) throws Exception {
        // Cargar la vista principal desde el FXML
        Parent root = FXMLLoader.load(getClass().getResource("view/InventoryView.fxml"));
        primaryStage.setTitle("Sistema de Inventario");
        primaryStage.setScene(new Scene(root));
        primaryStage.setResizable(false);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}