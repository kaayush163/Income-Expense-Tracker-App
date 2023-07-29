const express = require('express');
const router = express.Router();

const premiumController = require('../controllers/premium');
const premiumauthenticate = require('../middleware/auth');

router.get('/showLeaderBoard', premiumauthenticate.authenticate, premiumController.getUserLeaderboard);
router.get('/downloadlist', premiumauthenticate.authenticate , premiumController.downloadsList);

module.exports = router;