const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const ApiKey = require('../models/ApiKey');
const { canAccess } = require('../services/accessService');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { agentId } = req.body;
        const userAddress = req.user.address.toLowerCase();

        if (!agentId) return res.status(400).json({ error: 'agentId required' });

        const hasAccess = await canAccess(agentId, userAddress);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Active subscription required to generate API key.' });
        }

        const rawKey = 'sk_live_' + crypto.randomBytes(24).toString('hex');
        const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

        await ApiKey.findOneAndUpdate(
            { userAddress, agentId },
            { keyHash, status: 'ACTIVE', updatedAt: new Date() },
            { upsert: true }
        );

        res.json({ success: true, apiKey: rawKey, message: 'Store this key securely. It will not be shown again.' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
        const userAddress = req.user.address.toLowerCase();
        const keys = await ApiKey.find({ userAddress, status: 'ACTIVE' }, '-keyHash');
        res.json(keys);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
