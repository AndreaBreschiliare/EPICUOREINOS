const express = require('express');
const levelController = require('../controllers/levelController');

const router = express.Router({ mergeParams: true });

router.get('/', levelController.getLevelUpStatus);
router.get('/status', levelController.getLevelUpStatus);
router.post('/', levelController.levelUpFeud);

module.exports = router;
