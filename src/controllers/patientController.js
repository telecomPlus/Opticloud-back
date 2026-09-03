const Patient = require('../models/Patient');


// GET: Obtener todos los pacientes
const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        
        // Retornar directamente el arreglo en lugar del objeto envuelto
        return res.status(200).json(patients);
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error al obtener los pacientes.', 
            error: error.message 
        });
    }
};

// GET: Obtener un solo paciente por ID
const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado en la base de '
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, phone, address } = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { email, phone, address },
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado en la base de datos.'
      });
    }

    res.status(200).json({
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

const createPatient = async (req, res, next) => {
  try {
    const { name, email, phone, address, documentNumber } = req.body;

    const newPatient = await Patient.create({
      name,
      email,
      phone,
      address,
      documentNumber
    });

    res.status(201).json({
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

const deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedPatient = await Patient.findByIdAndDelete(id);

    if (!deletedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Paciente eliminado correctamente',
      data: deletedPatient
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
