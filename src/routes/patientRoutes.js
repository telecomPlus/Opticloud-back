const express = require('express');
const { body, param } = require('express-validator');
const { 
  getPatients, 
  getPatientById, 
  createPatient, 
  updatePatient, 
  deletePatient
} = require('../controllers/patientController');
const { getPatientExams } = require('../controllers/examController');
const validateRequest = require('../middlewares/validator');

const router = express.Router();


// Obtener todos los pacientes
router.get('/', getPatients);

// Obtener un paciente específico por ID
router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID de paciente inválido')
  ],
  getPatientById
);
// Crear un nuevo paciente
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser texto'),
    body('email').isEmail().withMessage('El formato del email es inválido'),
    body('phone').isNumeric().withMessage('El teléfono solo debe contener números').isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 dígitos'),
    body('address').optional().isString().withMessage('La dirección debe ser una cadena de texto'),
    body('documentNumber').notEmpty().withMessage('El número de documento es obligatorio').isLength({ min: 5, max: 15 }).withMessage('El número de documento debe tener entre 5 y 15 dígitos'),
    validateRequest
  ],
  createPatient
);

// Actualizar información del paciente
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID de paciente inválido'),
    body('email').optional().isEmail().withMessage('El formato del email es inválido'),
    body('phone').optional().isNumeric().withMessage('El teléfono solo debe contener números').isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 dígitos'),
    body('address').optional().isString().withMessage('La dirección debe ser una cadena de texto'),
    body('documentNumber')
      .optional()
      .isLength({ min: 5, max: 15 }).withMessage('El número de documento debe tener entre 5 y 15 dígitos'),
    validateRequest
  ],
  updatePatient
);

// Obtener exámenes de un paciente
router.get(
  '/:patientId/exams',
  [
    param('patientId').isMongoId().withMessage('ID de paciente inválido'),
    validateRequest
  ],
  getPatientExams
);


router.delete(
  '/:id',
  [
    param('id')
      .notEmpty()
      .withMessage('El ID del paciente es obligatorio')
      .isMongoId()
      .withMessage('El ID del paciente no es válido')
  ],
  deletePatient
);

module.exports = router;