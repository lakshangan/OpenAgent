const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userAddress: { type: String, required: true, lowercase: true },
    agentId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    txHash: { type: String },
    status: { type: String, enum: ['ACTIVE', 'EXPIRED'], default: 'ACTIVE' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'subscriptions' });

subscriptionSchema.index({ userAddress: 1, agentId: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
