const express = require('express');
const app = express();
const productosRoutes = require('./productos');

app.use(express.json());
app.use('/api', productosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Node.js escuchando en el puerto ${PORT}`);
});
