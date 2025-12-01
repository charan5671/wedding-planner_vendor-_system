import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { JSONFilePreset } from 'lowdb/node';

const router = express.Router();
const defaultData = { users: [], vendors: [], bookings: [], reviews: [], budgets: [], notifications: [], admins: [], payments: [], wishlist: [] };
const db = await JSONFilePreset('db.json', defaultData);

// Get budget for user
router.get('/user/:userId', async (req, res) => {
    await db.read();
    const userBudget = db.data.budgets.filter(b => b.userId === req.params.userId);
    res.json(userBudget);
});

// Add expense
router.post('/', async (req, res) => {
    const { userId, category, amount, description, date } = req.body;
    await db.read();

    const newExpense = {
        id: uuidv4(),
        userId,
        category,
        amount: parseFloat(amount),
        description,
        date: date || new Date().toISOString(),
        createdAt: new Date().toISOString()
    };

    db.data.budgets.push(newExpense);
    await db.write();

    res.status(201).json(newExpense);
});

// Update expense
router.patch('/:id', async (req, res) => {
    const { category, amount, description } = req.body;
    await db.read();

    const expense = db.data.budgets.find(b => b.id === req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (category) expense.category = category;
    if (amount) expense.amount = parseFloat(amount);
    if (description) expense.description = description;

    await db.write();
    res.json(expense);
});

// Delete expense
router.delete('/:id', async (req, res) => {
    await db.read();
    const index = db.data.budgets.findIndex(b => b.id === req.params.id);

    if (index === -1) return res.status(404).json({ message: 'Expense not found' });

    db.data.budgets.splice(index, 1);
    await db.write();

    res.json({ message: 'Expense deleted' });
});

export default router;
