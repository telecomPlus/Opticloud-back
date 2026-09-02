const Patient = require('../models/Patient');

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
        message: 'Paciente no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Información del paciente actualizada correctamente',
      data: updatedPatient
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'El email ya está registrado por otro paciente.' });
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

module.exports = { createPatient, updatePatient };
