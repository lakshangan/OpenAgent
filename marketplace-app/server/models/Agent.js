const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: String,
    role: String,
    price: String,
    currency: { type: String, default: 'ETH' },
    description: String,
    owner: String,
    creator: String,
    model: String,
    tags: [String],
    dateCreated: { type: Date, default: Date.now },
    status: { type: String, default: 'LISTED' }, // LISTED, PENDING_REVIEW, DELISTED
    trustScore: { type: Number, default: 0 },
    trustTier: { type: String, default: 'EXPERIMENTAL' },
    image: String,
    gallery: [String],
    github: String,
    version: String,
    contextWindow: String,
    architecture: String,
    framework: String,
    apiDependencies: String,
    inferenceService: String,
    license: String,
    pricingModel: { type: String, default: 'ONE_TIME' },
    deliveryType: { type: String, default: 'DOWNLOAD' },
    videoLink: String,
    website: String,
    discord: String,
    telegram: String,
    docs: String,
    codeFile: String,
    txHash: String,
    artifactHash: String,
    fileUrl: String,
    fileSha256: String
}, { collection: 'agents' });

module.exports = mongoose.model('Agent', agentSchema);
