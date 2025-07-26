const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');

router.get('/', rolController.getAll);
router.post('/', rolController.create);

module.exports = router;