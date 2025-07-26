const express = require('express');
const router = express.Router();
const movimientoController = require('../controllers/movimientoController');

router.get('/', movimientoController.getAll);
router.post('/', movimientoController.create);

module.exports = router;