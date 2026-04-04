const express = require('express');
const cargoController = require('../controllers/cargoController');

const router = express.Router({ mergeParams: true });

router.get('/', cargoController.getFeudCargos);
router.get('/available', cargoController.getAvailableCargos);
router.post('/:cargoName/assign', cargoController.assignCargo);
router.delete('/:cargoName', cargoController.removeCargo);

module.exports = router;
