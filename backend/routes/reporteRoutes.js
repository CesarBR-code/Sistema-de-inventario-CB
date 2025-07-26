const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

router.get('/mas-vendidos', reporteController.productosMasVendidos);
router.get('/bajo-stock', reporteController.productosBajoStock);

module.exports = router;