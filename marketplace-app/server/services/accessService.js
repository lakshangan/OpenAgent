const Purchase = require('../models/Purchase');
const Subscription = require('../models/Subscription');

async function canAccess(agentId, walletAddress) {
    if (!agentId || !walletAddress) return false;

    const addressLower = walletAddress.toLowerCase();

    // Check one-time purchase
    const purchase = await Purchase.findOne({
        agentId: agentId.toString(),
        buyer: addressLower
    });

    if (purchase && purchase.status !== 'DISPUTED') {
        return true;
    }

    // Check active subscription
    const sub = await Subscription.findOne({
        agentId: agentId.toString(),
        userAddress: addressLower
    });

    if (sub && sub.expiresAt > new Date()) {
        return true;
    }

    return false;
}

module.exports = {
    canAccess
};
