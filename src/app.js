const express = require('express');
const authRoutes = require('./routes/auth.routes');
const recordRoutes = require('./routes/record.routes');
const userRoutes = require('./routes/user.routes');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the VinylVault API by Efraín');
});

app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/users', userRoutes);

app.use(errorMiddleware);

module.exports = app;
