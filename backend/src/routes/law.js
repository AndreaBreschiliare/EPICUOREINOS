const express = require('express');
const lawController = require('../controllers/lawController');

const router = express.Router({ mergeParams: true });

router.get('/', lawController.getFeudLaws);
router.get('/available', lawController.getAvailableLaws);
router.post('/:lawName/activate', lawController.activateLaw);
router.delete('/:lawName', lawController.deactivateLaw);

module.exports = router;
