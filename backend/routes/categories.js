const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();

// GET all categories for a specific user
router.get('/', async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        // This query fetches both user-specific and default (userId is NULL) categories.
        // For this app, we assume all categories are user-specific as per the schema.
        const [categories] = await db.query('SELECT * FROM categories WHERE userId = ?', [userId]);
        res.status(200).json(categories);
    } catch (error)
 {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST a new category
router.post('/', async (req, res) => {
    const { userId, name, icon, type } = req.body;
    if (!userId || !name || !icon || !type) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const newCategory = {
            id: uuidv4(),
            userId,
            name,
            icon,
            type
        };
        await db.query('INSERT INTO categories SET ?', newCategory);
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT (update) a category
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, icon, type } = req.body;
    try {
        await db.query('UPDATE categories SET name = ?, icon = ?, type = ? WHERE id = ?', [name, icon, type, id]);
        const [[updatedCategory]] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE a category
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // You might want to add a check here to ensure transactions with this category are handled,
        // e.g., set to a default "uncategorized" or prevent deletion if in use.
        // For now, we allow deletion. The ON DELETE CASCADE is not set, so this is safe for now.
        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        res.status(204).send();
    } catch (error) {
        // If a transaction uses this category, the DELETE will fail due to foreign key constraint
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ message: 'Cannot delete category as it is currently in use by one or more transactions.' });
        }
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;