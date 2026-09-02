const express = require('express');
const { body, param } = require('express-validator');
const { updatePatient } = require('../controllers/patientController');
const { getPatientExams } = require('../controllers/examController');
// const { validateRequest } = require('../middlewares/validator');

const router = express.Router();

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID de paciente inválido'),
    body('email').optional().isEmail().withMessage('El formato del email es inválido'),
    body('phone').optional().isNumeric().withMessage('El teléfono solo debe contener números').isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 dígitos'),
    body('address').optional().isString().withMessage('La dirección debe ser una cadena de texto'),
    // validateRequest
  ],
  updatePatient
);

router.get(
  '/:patientId/exams',
  [
    param('patientId').isMongoId().withMessage('ID de paciente inválido'),
    // validateRequest
  ],
  getPatientExams
);

module.exports = router;
