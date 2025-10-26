const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();

// GET all transactions for a specific user
router.get('/', async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const [transactions] = await db.query('SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC', [userId]);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST a new transaction (handles single and installments)
router.post('/', async (req, res) => {
    const { transactionData, installments, userId } = req.body;
    
    if (!transactionData || !userId) {
        return res.status(400).json({ message: 'Transaction data and User ID are required' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        let newTransactions = [];

        if (transactionData.isInstallment && installments > 1) {
            const parentId = uuidv4();
            const originalDate = new Date(transactionData.date + 'T00:00:00');
    
            for (let i = 0; i < installments; i++) {
                const installmentDate = new Date(originalDate);
                installmentDate.setMonth(originalDate.getMonth() + i);
                
                const newTransaction = {
                    ...transactionData,
                    id: uuidv4(),
                    userId: userId,
                    description: `${transactionData.description} (${i + 1}/${installments})`,
                    date: installmentDate.toISOString().split('T')[0],
                    installmentParentId: parentId,
                };
                await connection.query('INSERT INTO transactions SET ?', newTransaction);
                newTransactions.push(newTransaction);
            }
        } else {
            const newTransaction = { 
                ...transactionData, 
                id: uuidv4(), 
                userId: userId, 
                isInstallment: false 
            };
            await connection.query('INSERT INTO transactions SET ?', newTransaction);
            newTransactions.push(newTransaction);
        }

        await connection.commit();
        res.status(201).json(newTransactions);
    } catch (error) {
        console.error('Error adding transaction:', error);
        await connection.rollback();
        res.status(500).json({ message: 'Server error while adding transaction' });
    } finally {
        connection.release();
    }
});

// PUT (update) a transaction by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    // We only allow updating these specific fields.
    const { type, amount, categoryId, description, date } = req.body;
    
    try {
        const [result] = await db.query(
            'UPDATE transactions SET type = ?, amount = ?, categoryId = ?, description = ?, date = ? WHERE id = ?',
            [type, amount, categoryId, description, date, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const [[updatedTransaction]] = await db.query('SELECT * FROM transactions WHERE id = ?', [id]);
        res.status(200).json(updatedTransaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE a transaction by ID (handles single and parent installments)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { installmentParentId } = req.query;

    try {
        if (installmentParentId && installmentParentId !== 'null' && installmentParentId !== 'undefined') {
            await db.query('DELETE FROM transactions WHERE installmentParentId = ?', [installmentParentId]);
        } else {
            await db.query('DELETE FROM transactions WHERE id = ?', [id]);
        }
        res.status(204).send(); // No Content
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;