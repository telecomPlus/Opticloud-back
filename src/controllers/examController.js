const Exam = require('../models/Exam');
const Patient = require('../models/Patient');

const createExam = async (req, res, next) => {
  try {
    const { patientId, od, os, notes } = req.body;

    const patientExists = await Patient.findById(patientId);
    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: 'El paciente especificado no existe en la base de datos'
      });
    }

    const newExam = await Exam.create({ patientId, od, os, notes });

    res.status(201).json({
      success: true,
      message: 'Examen registrado exitosamente',
      data: newExam
    });
  } catch (error) {
    next(error);
  }
};

const getPatientExams = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const patientExists = await Patient.findById(patientId);
    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: 'El paciente especificado no existe'
      });
    }

    const exams = await Exam.find({ patientId })
      .sort({ createdAt: -1 })
      .select('-updatedAt -__v');

    if (exams.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'El paciente no tiene exámenes registrados.',
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: 'Historial de exámenes recuperado exitosamente',
      count: exams.length,
      data: exams
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createExam, getPatientExams };
