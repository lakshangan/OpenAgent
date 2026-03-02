const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
    userAddress: { type: String, required: true, lowercase: true },
    agentId: { type: String, required: true },
    keyHash: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'REVOKED'], default: 'ACTIVE' },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'apikeys' });

apiKeySchema.index({ userAddress: 1, agentId: 1 }, { unique: true });

module.exports = mongoose.model('ApiKey', apiKeySchema);
