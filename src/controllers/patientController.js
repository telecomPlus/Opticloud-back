const {
  getAllPatientsService,
  getPatientByIdService,
  createPatientService,
  updatePatientService,
  deletePatientService
} = require('../services/patientService');

// GET: Obtener todos los pacientes
const getPatients = async (req, res, next) => {
  try {
    const patients = await getAllPatientsService();
    return res.status(200).json(patients);
  } catch (error) {
    next(error);
  }
};

// GET: Obtener un solo paciente por ID
const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await getPatientByIdService(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado en la base de datos.'
      });
    }

    return res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// POST: Crear un nuevo paciente
const createPatient = async (req, res, next) => {
  try {
    const newPatient = await createPatientService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Paciente creado correctamente',
      data: newPatient
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'El email o número de documento ya está registrado.' 
      });
    }
    next(error);
  }
};

// PUT: Actualizar paciente
const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, phone, address } = req.body;

    const updatedPatient = await updatePatientService(id, { email, phone, address });

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado en la base de datos.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Información del paciente actualizada correctamente',
      data: updatedPatient
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'El email ingresado ya está registrado por otro paciente.' });
    }
    next(error);
  }
};

// DELETE: Eliminar paciente (con cascada incluida gracias al servicio)
const deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deletePatientService(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Paciente y sus exámenes asociados eliminados correctamente',
      data: {
        patient: result.deletedPatient,
        examsDeletedCount: result.examsDeletedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getPatients, 
  getPatientById, 
  createPatient, 
  updatePatient,
  deletePatient
};