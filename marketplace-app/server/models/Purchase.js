const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    agentId: { type: String, required: true },
    buyer: { type: String, required: true },
    txHash: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: 'CREATED' },
    escrowId: { type: String },
    expiryAt: { type: Date },
    trustTierSnapshot: { type: String },
    escrowHours: { type: Number },
    categorySnapshot: { type: String }
}, { collection: 'purchases' });

purchaseSchema.index({ txHash: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
