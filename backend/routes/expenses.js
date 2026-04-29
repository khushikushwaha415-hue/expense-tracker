const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Get all expenses
router.get('/', auth, async(req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server error!', error });
    }
});

// Add expense
router.post('/', auth, async(req, res) => {
    try {
        const { description, amount, category, date } = req.body;

        const expense = new Expense({
            userId: req.userId,
            description,
            amount,
            category,
            date
        });

        await expense.save();
        res.status(201).json({ message: 'Expense added!', expense });

    } catch (error) {
        res.status(500).json({ message: 'Server error!', error });
    }
});

// Delete expense
router.delete('/:id', auth, async(req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error!', error });
    }
});

module.exports = router;