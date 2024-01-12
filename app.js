const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();

require('./db');
const PORT = 8000;
app.use(bodyParser.json());
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

// Your other routes or middleware go here

// This is your root route
app.get('/', (req, res) => {
    res.json({
        message: 'TASK MANAGER API IS WORKING'
    });
});

// Error-handling middleware
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ error: 'Invalid JSON format' });
    }
    next(err);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}..`);
});
