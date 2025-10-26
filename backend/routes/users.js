const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

// PUT /api/users/:id/profile (Update fullName, email)
router.put('/:id/profile', async (req, res) => {
    const { id } = req.params;
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        return res.status(400).json({ message: 'Full name and email are required.' });
    }

    try {
        await db.query('UPDATE users SET fullName = ?, email = ? WHERE id = ?', [fullName, email, id]);
        const [[updatedUser]] = await db.query('SELECT id, fullName, email, profilePicture, subscriptionPlan FROM users WHERE id = ?', [id]);
        res.status(200).json(updatedUser);
    } catch (error) {
        // Handle potential unique email constraint violation
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'This email is already in use.' });
        }
        console.error("Error updating profile:", error);
        res.status(500).json({ message: 'Server error while updating profile.' });
    }
});

// PUT /api/users/:id/password (Update password)
router.put('/:id/password', async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'All password fields are required.' });
    }

    try {
        const [[user]] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: 'Server error while changing password.' });
    }
});


// PUT /api/users/:id/picture
router.put('/:id/picture', async (req, res) => {
    const { id } = req.params;
    const { profilePicture } = req.body;

    if (!profilePicture) {
        return res.status(400).json({ message: 'Profile picture URL is required.' });
    }

    try {
        await db.query('UPDATE users SET profilePicture = ? WHERE id = ?', [profilePicture, id]);
        const [[updatedUser]] = await db.query('SELECT id, fullName, email, profilePicture, subscriptionPlan FROM users WHERE id = ?', [id]);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ message: 'Server error while updating profile picture.' });
    }
});


module.exports = router;