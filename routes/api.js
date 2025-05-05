const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const employeRoutes = require('./employe');

// Monter les sous-routes
router.use('/auth', authRoutes);
router.use('/employe', employeRoutes);

router.use((req, res) => {
    res.status(404).json({ message: 'Route API introuvable' });
});

module.exports = router;
