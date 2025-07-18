const express = require('express');
const app = express();
const path = require('path');
const productosRoutes = require('./productos');

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos desde la raíz del proyecto (index.html, etc)
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas API
app.use('/api', productosRoutes);

// Puerto de servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Node.js escuchando en el puerto ${PORT}`);
});
