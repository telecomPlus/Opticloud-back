const {
  createExamService,
  getExamByIdService,
  getAllExamsService,
  getPatientExamsService,
  updateExamService
} = require('../services/examService');

/**
 * POST /api/v1/exams
 * Registra un examen asociado a un paciente existente.
 */
const createExam = async (req, res, next) => {
  try {
    const result = await createExamService(req.body, req.user?.id);

    if (result.notFound) {
      return res.status(404).json({
        success: false,
        message: result.message
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Examen registrado exitosamente.',
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/exams/:id
 * Consulta el detalle de un examen por su ID.
 */
const getExamById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exam = await getExamByIdService(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Examen no encontrado en el sistema.'
      });
    }

    return res.status(200).json({
      success: true,
      data: exam
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/exams
 * Lista exámenes con filtros y paginación en orden descendente.
 */
const getExams = async (req, res, next) => {
  try {
    const { patientId, examType, startDate, endDate, page, limit } = req.query;

    const result = await getAllExamsService(
      { patientId, examType, startDate, endDate },
      { page, limit }
    );

    return res.status(200).json({
      success: true,
      message: 'Exámenes recuperados exitosamente.',
      count: result.exams.length,
      pagination: result.pagination,
      data: result.exams
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/patients/:patientId/exams
 * Consulta el historial de exámenes de un paciente.
 */
const getPatientExams = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { page, limit } = req.query;

    const result = await getPatientExamsService(patientId, { page, limit });

    if (result.notFound) {
      return res.status(404).json({
        success: false,
        message: result.message
      });
    }

    if (result.exams.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'El paciente no tiene exámenes registrados.',
        count: 0,
        pagination: result.pagination,
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Historial de exámenes recuperado exitosamente.',
      count: result.exams.length,
      pagination: result.pagination,
      data: result.exams
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/exams/:id o PATCH /api/v1/exams/:id
 * Actualiza los datos de un examen clínico.
 */
const updateExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await updateExamService(id, req.body);

    if (result.notFound) {
      return res.status(404).json({
        success: false,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Examen actualizado exitosamente.',
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExam,
  getExamById,
  getExams,
  getPatientExams,
  updateExam
};
