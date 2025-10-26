const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();

// GET all goals for a specific user
router.get('/', async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const [goals] = await db.query('SELECT * FROM goals WHERE userId = ? ORDER BY deadline ASC', [userId]);
        res.status(200).json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST a new goal
router.post('/', async (req, res) => {
    const { userId, name, targetAmount, deadline } = req.body;
     if (!userId || !name || !targetAmount || !deadline) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const newGoal = {
            id: uuidv4(),
            userId,
            name,
            targetAmount,
            deadline,
            currentAmount: 0,
        };
        await db.query('INSERT INTO goals SET ?', newGoal);
        res.status(201).json(newGoal);
    } catch (error) {
        console.error('Error creating goal:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT (update) a goal by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, targetAmount, deadline, currentAmount } = req.body;

    try {
        const [[goalToUpdate]] = await db.query('SELECT * FROM goals WHERE id = ?', [id]);
        if (!goalToUpdate) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        const updatedGoalData = {
            name: name !== undefined ? name : goalToUpdate.name,
            targetAmount: targetAmount !== undefined ? targetAmount : goalToUpdate.targetAmount,
            deadline: deadline !== undefined ? deadline : goalToUpdate.deadline,
            currentAmount: currentAmount !== undefined ? currentAmount : goalToUpdate.currentAmount,
        };

        await db.query('UPDATE goals SET ? WHERE id = ?', [updatedGoalData, id]);

        const [[updatedGoal]] = await db.query('SELECT * FROM goals WHERE id = ?', [id]);
        res.status(200).json(updatedGoal);
    } catch (error) {
        console.error('Error updating goal:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE a goal by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM goals WHERE id = ?', [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;