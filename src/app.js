const express = require('express');
const recordRoutes = require('./routes/record.routes');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the VinylVault API by Efrain');
});

app.use('/api/records', recordRoutes);

app.use(errorMiddleware);

module.exports = app;
