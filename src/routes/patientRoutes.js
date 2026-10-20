const express = require('express');
const { body, param, query } = require('express-validator');
const { 
  getPatients, 
  getPatientById, 
  createPatient, 
  updatePatient, 
  deletePatient
} = require('../controllers/patientController');
const { getPatientExams } = require('../controllers/examController');
const validateRequest = require('../middlewares/validator');
const verifyToken = require('../middlewares/authMiddleware'); // <--- Importar middleware de seguridad

const router = express.Router();

router.get('/', verifyToken, getPatients);

router.get(
  '/:id',
  verifyToken, 
  [
    param('id').isMongoId().withMessage('ID de paciente inválido'),
    validateRequest
  ],
  getPatientById
);

router.post(
  '/',
  verifyToken, 
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio').isString(),
    body('email').isEmail().withMessage('El formato del email es inválido'),
    body('phone').isNumeric().withMessage('El teléfono solo debe contener números'),
    body('documentNumber').notEmpty().withMessage('El número de documento es obligatorio'),
    validateRequest
  ],
  createPatient
);

router.put(
  '/:id',
  verifyToken, 
  [
    param('id').isMongoId().withMessage('ID de paciente inválido'),
    validateRequest
  ],
  updatePatient
);

router.get(
  '/:patientId/exams',
  verifyToken, 
  [
    param('patientId').isMongoId().withMessage('ID de paciente inválido'),
    query('page').optional({ nullable: true }).isInt({ min: 1 }).withMessage('page debe ser un número entero mayor o igual a 1'),
    query('limit').optional({ nullable: true }).isInt({ min: 1, max: 100 }).withMessage('limit debe ser un número entero entre 1 y 100'),
    validateRequest
  ],
  getPatientExams
);

router.delete(
  '/:id',
  verifyToken, 
  [
    param('id').isMongoId().isString().withMessage('El ID no es válido')
  ],
  deletePatient
);

module.exports = router;