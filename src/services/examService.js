const Exam = require('../models/exam');
const Patient = require('../models/patient');

/**
 * Servicio para crear un nuevo examen optométrico comprobando que el paciente exista
 * y vinculando el profesional autenticado.
 */
const createExamService = async (examData, userId) => {
  const patient = await Patient.findById(examData.patientId);
  if (!patient) {
    return { notFound: true, message: 'El paciente especificado no existe en el sistema.' };
  }

  const payload = { ...examData };
  delete payload.optometristId; // Evita spoofing del optometrista desde el cliente
  if (userId) {
    payload.optometristId = userId;
  }

  const newExam = await Exam.create(payload);
  return { data: newExam };
};

/**
 * Servicio para consultar un examen por su ID con datos poblados de paciente y profesional.
 */
const getExamByIdService = async (id) => {
  return await Exam.findById(id)
    .populate('patientId', 'name documentNumber email phone address')
    .populate('optometristId', 'name email');
};

/**
 * Servicio para listar exámenes con filtros (paciente, tipo, fechas) y paginación ordenada.
 */
const getAllExamsService = async (filters = {}, pagination = {}) => {
  const query = {};

  if (filters.patientId) {
    query.patientId = filters.patientId;
  }

  if (filters.examType) {
    query.examType = filters.examType;
  }

  if (filters.startDate || filters.endDate) {
    query.examDate = {};
    if (filters.startDate) {
      query.examDate.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.examDate.$lte = new Date(filters.endDate);
    }
  }

  const page = Math.max(1, parseInt(pagination.page || 1, 10));
  const limit = Math.min(100, Math.max(1, parseInt(pagination.limit || 10, 10)));
  const skip = (page - 1) * limit;

  const [total, exams] = await Promise.all([
    Exam.countDocuments(query),
    Exam.find(query)
      .sort({ examDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('patientId', 'name documentNumber email phone')
      .populate('optometristId', 'name email')
  ]);

  return {
    exams,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
};

/**
 * Servicio para consultar el historial de exámenes de un paciente.
 */
const getPatientExamsService = async (patientId, pagination = {}) => {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    return { notFound: true, message: 'El paciente especificado no existe en el sistema.' };
  }

  const query = { patientId };
  const page = Math.max(1, parseInt(pagination.page || 1, 10));
  const limit = Math.min(100, Math.max(1, parseInt(pagination.limit || 10, 10)));
  const skip = (page - 1) * limit;

  const [total, exams] = await Promise.all([
    Exam.countDocuments(query),
    Exam.find(query)
      .sort({ examDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v')
  ]);

  return {
    exams,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
};

/**
 * Servicio para actualizar datos clínicos de un examen de manera no destructiva.
 */
const updateExamService = async (id, updateData) => {
  const exam = await Exam.findById(id);
  if (!exam) {
    return { notFound: true, message: 'Examen no encontrado para actualizar.' };
  }

  if (updateData.patientId && updateData.patientId.toString() !== exam.patientId.toString()) {
    const patientExists = await Patient.findById(updateData.patientId);
    if (!patientExists) {
      return { notFound: true, message: 'El nuevo paciente especificado no existe en el sistema.' };
    }
    exam.patientId = updateData.patientId;
  }

  if (updateData.od) {
    const currentOd = exam.od ? exam.od.toObject() : {};
    exam.od = { ...currentOd, ...updateData.od };
  }

  if (updateData.os) {
    const currentOs = exam.os ? exam.os.toObject() : {};
    exam.os = { ...currentOs, ...updateData.os };
  }

  if (updateData.visualMeasurements) {
    const currentVm = exam.visualMeasurements ? exam.visualMeasurements.toObject() : {};
    exam.visualMeasurements = { ...currentVm, ...updateData.visualMeasurements };
  }

  if (updateData.examDate !== undefined) exam.examDate = updateData.examDate;
  if (updateData.examType !== undefined) exam.examType = updateData.examType;
  if (updateData.reasonForVisit !== undefined) exam.reasonForVisit = updateData.reasonForVisit;
  if (updateData.diagnosis !== undefined) exam.diagnosis = updateData.diagnosis;
  if (updateData.recommendations !== undefined) exam.recommendations = updateData.recommendations;
  if (updateData.notes !== undefined) exam.notes = updateData.notes;
  if (updateData.followUpDate !== undefined) exam.followUpDate = updateData.followUpDate;

  const updatedExam = await exam.save();
  return { data: updatedExam };
};

module.exports = {
  createExamService,
  getExamByIdService,
  getAllExamsService,
  getPatientExamsService,
  updateExamService
};
