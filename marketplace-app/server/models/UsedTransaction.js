const mongoose = require('mongoose');

const usedTransactionSchema = new mongoose.Schema({
    hash: { type: String, required: true, unique: true, lowercase: true },
    agentId: { type: Number, required: true },
    buyerAddress: String,
    amount: Number,
    usedAt: { type: Date, default: Date.now }
}, { collection: 'used_transactions' });

module.exports = mongoose.model('UsedTransaction', usedTransactionSchema);
