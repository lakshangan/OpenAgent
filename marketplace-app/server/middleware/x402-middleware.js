const { verifyUSDCPayment } = require('../utils/x402-utils');
const Agent = require('../models/Agent');
const AppError = require('../utils/AppError');

/**
 * x402 Middleware: Enforces "Payment Required" for API access.
 * Expects 'x-agent-id' and 'x-payment-proof' (optional for initial call).
 */
const x402Middleware = async (req, res, next) => {
    try {
        const agentId = req.headers['x-agent-id'];
        const paymentProof = req.headers['x-payment-proof'];

        if (!agentId) {
            return next(new AppError("Missing x-agent-id header", 400));
        }

        // 1. Fetch Agent Details (to get price and recipient)
        const agent = await Agent.findOne({ agentId: parseInt(agentId) });
        if (!agent) {
            return next(new AppError("Agent not found", 404));
        }

        // Default x402 price (e.g., $0.05 USDC) if not explicitly set
        // In a real scenario, this might be a 'pricePerInference' field on the Agent model
        const price = agent.inferencePrice || 0.05; 
        const recipient = agent.payoutAddress || agent.creatorAddress || req.headers['x-recipient-override'];

        if (!recipient) {
            return next(new AppError("Agent configuration error: No payout address found", 500));
        }

        // 2. Case: No Payment Proof (Request Instructions)
        if (!paymentProof) {
            // Special case for x402: We pass the object directly or use a specialized AppError
            const instructions = {
                amount: price,
                currency: "USDC",
                chain: "Base Sepolia",
                recipient: recipient,
                memo: `Payment for Agent ${agentId} inference`
            };
            return res.status(402).json({ error: "Payment Required", instructions });
        }

        // 3. Case: Payment Proof Submitted
        const UsedTransaction = require('../models/UsedTransaction');
        
        // Anti-Replay Check
        const alreadyUsed = await UsedTransaction.findOne({ hash: paymentProof.toLowerCase() });
        if (alreadyUsed) {
            return next(new AppError("This transaction hash has already been used for an inference (Double Spend Detected).", 403));
        }

        const isValid = await verifyUSDCPayment(paymentProof, price, recipient);
        
        if (!isValid) {
            return next(new AppError("Transaction hash not found, failed, or incorrect amount/recipient.", 402));
        }

        // Record the transaction as used before proceeding
        await UsedTransaction.create({
            hash: paymentProof.toLowerCase(),
            agentId: parseInt(agentId),
            amount: price,
            buyerAddress: req.headers['x-buyer-address'] || 'anonymous'
        });

        // Payment valid! Attach agent data to request for next step
        req.agent = agent;
        req.paymentVerified = true;
        next();

    } catch (error) {
        next(error); // Pass to global error handler
    }
};

module.exports = x402Middleware;
