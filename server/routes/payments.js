import express from 'express';

const router = express.Router();

// Mock payment processing
router.post('/process', (req, res) => {
    const { amount, cardNumber, expiry, cvc, name } = req.body;

    // Simulate processing delay
    setTimeout(() => {
        // Simple validation simulation
        if (!amount || !cardNumber || !expiry || !cvc || !name) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment details'
            });
        }

        // Simulate success for most cases, fail if amount is negative
        if (amount < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount'
            });
        }

        res.json({
            success: true,
            transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
            message: 'Payment processed successfully',
            timestamp: new Date().toISOString()
        });
    }, 1500);
});

export default router;
