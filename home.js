const express = require('express');
const { getLunarPhase, getPhase } = require('./lunarPhaseCal');
const homeRoutes = require('./routes').homeRoutes;

const router = express.Router();

router.get(homeRoutes.currentLunarPhase, (req, res) => {
    try {
        const moonFraction = getLunarPhase({});

        res.status(200).json({ moonPhase: getPhase(moonFraction) });
    } 
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
