require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const transactionsRoutes = require('./routes/transactions');
const goalsRoutes = require('./routes/goals');
const categoriesRoutes = require('./routes/categories');
const usersRoutes = require('./routes/users'); // Import user routes

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allows cross-origin requests from your frontend
app.use(express.json()); // Allows the server to accept and parse JSON in request bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/users', usersRoutes); // Use user routes

// Simple root route to check if the server is up
app.get('/', (req, res) => {
    res.send('FinanDash API is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});