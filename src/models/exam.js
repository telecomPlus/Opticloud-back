const mongoose = require('mongoose');

const eyeGraduationSchema = new mongoose.Schema({
  sphere: { type: Number, required: true },
  cylinder: { type: Number, required: true },
  axis: { type: Number, required: true },
}, { _id: false });

const examSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'El ID del paciente es requerido'],
    },
    od: {
      type: eyeGraduationSchema,
      required: true,
    },
    os: {
      type: eyeGraduationSchema,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model('Exam', examSchema);
