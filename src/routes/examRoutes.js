const express = require('express');
const { body } = require('express-validator');
const { createExam } = require('../controllers/examController');
const validateRequest = require('../middlewares/validator');

const router = express.Router();

router.post(
  '/',
  [
    body('patientId').isMongoId().withMessage('ID de paciente inválido o faltante'),
    body('od.sphere').isNumeric().withMessage('OD sphere debe ser un número'),
    body('od.cylinder').isNumeric().withMessage('OD cylinder debe ser un número'),
    body('od.axis').isNumeric().withMessage('OD axis debe ser un número'),
    body('os.sphere').isNumeric().withMessage('OS sphere debe ser un número'),
    body('os.cylinder').isNumeric().withMessage('OS cylinder debe ser un número'),
    body('os.axis').isNumeric().withMessage('OS axis debe ser un número'),
    body('notes').optional().isString().withMessage('Las notas deben ser texto'),
    validateRequest
  ],
  createExam
);

module.exports = router;
