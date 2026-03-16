require('dotenv').config();
const express = require('express');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task Manager API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
