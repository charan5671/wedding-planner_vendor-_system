import express from 'express';

const router = express.Router();

// Get vendor analytics
router.get('/vendor/:id', (req, res) => {
    const { id } = req.params;

    // Generate mock data based on vendor ID to be consistent but random-looking
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const analytics = {
        views: {
            total: getRandom(100, 5000),
            trend: getRandom(-10, 20), // percentage
            history: Array.from({ length: 7 }, (_, i) => ({
                date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                count: getRandom(10, 100)
            }))
        },
        bookings: {
            total: getRandom(5, 50),
            pending: getRandom(0, 5),
            completed: getRandom(5, 45),
            revenue: getRandom(1000, 50000)
        },
        reviews: {
            average: (getRandom(30, 50) / 10).toFixed(1),
            count: getRandom(1, 100),
            breakdown: {
                5: getRandom(10, 50),
                4: getRandom(5, 20),
                3: getRandom(0, 10),
                2: getRandom(0, 5),
                1: getRandom(0, 2)
            }
        }
    };

    res.json(analytics);
});

export default router;
