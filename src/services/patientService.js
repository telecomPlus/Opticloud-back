const Patient = require('../models/patient');
const Exam = require('../models/exam');

const getAllPatientsService = async () => {
  return await Patient.find();
};

const getPatientByIdService = async (id) => {
  return await Patient.findById(id);
};

const createPatientService = async (patientData) => {
  return await Patient.create(patientData);
};

const updatePatientService = async (id, updateData) => {
  return await Patient.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
};

const deletePatientService = async (id) => {
  const deletedPatient = await Patient.findByIdAndDelete(id);
  if (!deletedPatient) return null;

  // Mantenemos también la eliminación en cascada de los exámenes que implementamos antes
  const deletedExams = await Exam.deleteMany({ patientId: id });

  return {
    deletedPatient,
    examsDeletedCount: deletedExams.deletedCount
  };
};

module.exports = {
  getAllPatientsService,
  getPatientByIdService,
  createPatientService,
  updatePatientService,
  deletePatientService
};