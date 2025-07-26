const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Lista todos los productos
router.get('/', productoController.getAll);
// Obtiene un producto por id
router.get('/:id', productoController.getById);
// Crea un producto
router.post('/', productoController.create);
// Actualiza un producto
router.put('/:id', productoController.update);
// Elimina un producto
router.delete('/:id', productoController.remove);

module.exports = router;