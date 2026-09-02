const express = require('express');
const cors = require('cors');

const patientRoutes = require('./src/routes/patientRoutes');
const examRoutes = require('./src/routes/examRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/exams', examRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
