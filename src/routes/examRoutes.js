const express = require('express');
const { body, param, query } = require('express-validator');
const {
  createExam,
  getExamById,
  getExams,
  updateExam
} = require('../controllers/examController');
const validateRequest = require('../middlewares/validator');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * Validador condicional del eje (axis):
 * - Si cylinder !== 0, el eje es OBLIGATORIO y debe estar entre 1° y 180°.
 * - Si cylinder === 0 o se omite, el eje es OPCIONAL.
 */
const validateEyeAxis = (eyeKey) => (value, { req }) => {
  const eye = req.body?.[eyeKey];
  const cylinder = eye?.cylinder;
  const hasCylinder = cylinder !== undefined && cylinder !== null && Number(cylinder) !== 0;

  if (hasCylinder) {
    if (value === undefined || value === null || value === '') {
      throw new Error(`El eje (${eyeKey}.axis) es obligatorio cuando el cilindro es distinto de 0`);
    }
    const num = Number(value);
    if (!Number.isFinite(num) || num < 1 || num > 180) {
      throw new Error(`El eje (${eyeKey}.axis) debe ser un número entre 1 y 180 grados`);
    }
  } else if (value !== undefined && value !== null && value !== '') {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 0 || num > 180) {
      throw new Error(`El eje (${eyeKey}.axis) debe estar entre 1 y 180 grados`);
    }
  }
  return true;
};

// Validaciones para POST / (crear examen)
const createExamValidations = [
  body('patientId')
    .notEmpty().withMessage('El ID del paciente es requerido')
    .isMongoId().withMessage('El ID del paciente no es un ObjectId válido'),

  body('examDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('examDate debe tener un formato de fecha válido (ISO 8601)'),

  body('examType')
    .optional({ nullable: true })
    .isString().trim(),

  body('reasonForVisit')
    .optional({ nullable: true })
    .isString().trim(),

  body('diagnosis')
    .optional({ nullable: true })
    .isString().trim(),

  body('recommendations')
    .optional({ nullable: true })
    .isString().trim(),

  body('notes')
    .optional({ nullable: true })
    .isString().trim(),

  body('followUpDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('followUpDate debe tener un formato de fecha válido (ISO 8601)'),

  // OD (Ojo derecho)
  body('od.sphere')
    .exists({ checkNull: false }).withMessage('OD sphere es requerido')
    .isFloat({ min: -30, max: 30 }).withMessage('OD sphere debe ser un número finito entre -30.00 y +30.00 dioptrías'),

  body('od.cylinder')
    .optional({ nullable: true })
    .isFloat({ min: -15, max: 15 }).withMessage('OD cylinder debe ser un número finito entre -15.00 y +15.00 dioptrías'),

  body('od.axis')
    .custom(validateEyeAxis('od')),

  body('od.addition')
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 6 }).withMessage('OD addition debe estar entre 0.00 y +6.00 dioptrías'),

  body('od.prism')
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 30 }).withMessage('OD prism debe estar entre 0 y 30 dioptrías prismáticas'),

  body('od.prismBase')
    .optional({ nullable: true })
    .isString().trim(),

  body('od.visualAcuityDistance')
    .optional({ nullable: true })
    .isString().trim(),

  body('od.visualAcuityNear')
    .optional({ nullable: true })
    .isString().trim(),

  // OS (Ojo izquierdo)
  body('os.sphere')
    .exists({ checkNull: false }).withMessage('OS sphere es requerido')
    .isFloat({ min: -30, max: 30 }).withMessage('OS sphere debe ser un número finito entre -30.00 y +30.00 dioptrías'),

  body('os.cylinder')
    .optional({ nullable: true })
    .isFloat({ min: -15, max: 15 }).withMessage('OS cylinder debe ser un número finito entre -15.00 y +15.00 dioptrías'),

  body('os.axis')
    .custom(validateEyeAxis('os')),

  body('os.addition')
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 6 }).withMessage('OS addition debe estar entre 0.00 y +6.00 dioptrías'),

  body('os.prism')
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 30 }).withMessage('OS prism debe estar entre 0 y 30 dioptrías prismáticas'),

  body('os.prismBase')
    .optional({ nullable: true })
    .isString().trim(),

  body('os.visualAcuityDistance')
    .optional({ nullable: true })
    .isString().trim(),

  body('os.visualAcuityNear')
    .optional({ nullable: true })
    .isString().trim(),

  // visualMeasurements opcional
  body('visualMeasurements.pupillaryDistance')
    .optional({ nullable: true })
    .isFloat({ min: 40, max: 85 }).withMessage('pupillaryDistance debe estar entre 40 y 85 mm'),

  body('visualMeasurements.rightPupillaryDistance')
    .optional({ nullable: true })
    .isFloat({ min: 20, max: 45 }).withMessage('rightPupillaryDistance debe estar entre 20 y 45 mm'),

  body('visualMeasurements.leftPupillaryDistance')
    .optional({ nullable: true })
    .isFloat({ min: 20, max: 45 }).withMessage('leftPupillaryDistance debe estar entre 20 y 45 mm'),

  body('visualMeasurements.intraocularPressureOD')
    .optional({ nullable: true })
    .isFloat({ min: 1, max: 70 }).withMessage('intraocularPressureOD debe estar entre 1 y 70 mmHg'),

  body('visualMeasurements.intraocularPressureOS')
    .optional({ nullable: true })
    .isFloat({ min: 1, max: 70 }).withMessage('intraocularPressureOS debe estar entre 1 y 70 mmHg'),

  body('visualMeasurements.workingDistance')
    .optional({ nullable: true })
    .isFloat({ min: 100, max: 1000 }).withMessage('workingDistance debe estar entre 100 y 1000 mm')
];

// Validaciones para PUT / PATCH /:id
const updateExamValidations = [
  param('id')
    .isMongoId().withMessage('ID de examen inválido'),

  body('patientId')
    .optional({ nullable: true })
    .isMongoId().withMessage('El ID del paciente no es un ObjectId válido'),

  body('examDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('examDate debe tener un formato de fecha válido (ISO 8601)'),

  body('od.sphere')
    .optional({ nullable: true })
    .isFloat({ min: -30, max: 30 }).withMessage('OD sphere debe ser un número finito entre -30.00 y +30.00 dioptrías'),

  body('od.cylinder')
    .optional({ nullable: true })
    .isFloat({ min: -15, max: 15 }).withMessage('OD cylinder debe ser un número finito entre -15.00 y +15.00 dioptrías'),

  body('od.axis')
    .optional({ nullable: true })
    .isFloat({ min: 1, max: 180 }).withMessage('OD axis debe estar entre 1 y 180 grados'),

  body('os.sphere')
    .optional({ nullable: true })
    .isFloat({ min: -30, max: 30 }).withMessage('OS sphere debe ser un número finito entre -30.00 y +30.00 dioptrías'),

  body('os.cylinder')
    .optional({ nullable: true })
    .isFloat({ min: -15, max: 15 }).withMessage('OS cylinder debe ser un número finito entre -15.00 y +15.00 dioptrías'),

  body('os.axis')
    .optional({ nullable: true })
    .isFloat({ min: 1, max: 180 }).withMessage('OS axis debe estar entre 1 y 180 grados')
];

// Validaciones para listado GET /
const listExamsValidations = [
  query('patientId')
    .optional({ nullable: true })
    .isMongoId().withMessage('El ID de paciente a filtrar no es un ObjectId válido'),

  query('startDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('startDate debe tener formato de fecha válido (ISO 8601)'),

  query('endDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('endDate debe tener formato de fecha válido (ISO 8601)'),

  query('page')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('page debe ser un número entero mayor o igual a 1'),

  query('limit')
    .optional({ nullable: true })
    .isInt({ min: 1, max: 100 }).withMessage('limit debe ser un número entero entre 1 y 100')
];

// POST /api/v1/exams - Registrar examen
router.post(
  '/',
  verifyToken,
  createExamValidations,
  validateRequest,
  createExam
);

// GET /api/v1/exams - Listar exámenes con filtros y paginación
router.get(
  '/',
  verifyToken,
  listExamsValidations,
  validateRequest,
  getExams
);

// GET /api/v1/exams/:id - Consultar detalle de examen
router.get(
  '/:id',
  verifyToken,
  [
    param('id').isMongoId().withMessage('ID de examen inválido'),
    validateRequest
  ],
  getExamById
);

// PUT /api/v1/exams/:id - Actualizar examen
router.put(
  '/:id',
  verifyToken,
  updateExamValidations,
  validateRequest,
  updateExam
);

// PATCH /api/v1/exams/:id - Actualización parcial de examen
router.patch(
  '/:id',
  verifyToken,
  updateExamValidations,
  validateRequest,
  updateExam
);

module.exports = router;