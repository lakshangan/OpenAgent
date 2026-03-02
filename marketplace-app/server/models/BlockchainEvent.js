const mongoose = require('mongoose');

const blockchainEventSchema = new mongoose.Schema({
    txHash: { type: String, required: true },
    logIndex: { type: Number, required: true },
    eventName: { type: String, required: true },
    blockNumber: { type: Number, required: true },
    data: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' }
}, { collection: 'blockchain_events' });

blockchainEventSchema.index({ txHash: 1, logIndex: 1 }, { unique: true });

module.exports = mongoose.model('BlockchainEvent', blockchainEventSchema);
