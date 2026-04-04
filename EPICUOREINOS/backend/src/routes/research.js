const express = require('express');
const researchController = require('../controllers/researchController');

const router = express.Router({ mergeParams: true });

router.get('/', researchController.listResearch);
router.get('/available', researchController.getAvailableResearch);
router.get('/tree', researchController.getResearchTree);
router.get('/progress', researchController.getResearchProgress);
router.post('/start', researchController.startResearch);

module.exports = router;
