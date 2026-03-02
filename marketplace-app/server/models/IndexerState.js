const mongoose = require('mongoose');

const indexerStateSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    lastProcessedBlock: { type: Number, default: 0 }
}, { collection: 'indexer_state' });

module.exports = mongoose.model('IndexerState', indexerStateSchema);
