const express = require('express');
const recordRoutes = require('./routes/record.routes');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the VinylVault API by Efraín');
});

app.use('/api/records', recordRoutes);

module.exports = app;
