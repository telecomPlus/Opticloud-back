const mongoose = require('mongoose');

/**
 * Sub-esquema de graduación refractiva para cada ojo (OD - Ojo Derecho, OS - Ojo Izquierdo).
 * Unidades y convenciones clínicas:
 * - sphere: Esfera en dioptrías (D). Admite valores negativos (miopía), positivos (hipermetropía) y cero (plano).
 * - cylinder: Cilindro astigmático en dioptrías (D).
 * - axis: Eje astigmático en grados sexagesimales (1° a 180°). Requerido cuando cylinder != 0.
 * - addition: Adición para visión próxima / presbicia en dioptrías (D).
 * - prism: Potencia prismática en dioptrías prismáticas (Δ).
 * - prismBase: Orientación de la base prismática (Base In, Base Out, Base Up, Base Down).
 * - visualAcuityDistance: Agudeza visual lejana (ej: '20/20', '20/40').
 * - visualAcuityNear: Agudeza visual próxima (ej: '0.50M', '20/20', 'J1').
 */
const eyeGraduationSchema = new mongoose.Schema(
  {
    sphere: {
      type: Number,
      required: [true, 'La esfera (sphere) es requerida'],
    },
    cylinder: {
      type: Number,
      default: undefined,
    },
    axis: {
      type: Number,
      default: undefined,
    },
    addition: {
      type: Number,
      default: undefined,
    },
    prism: {
      type: Number,
      default: undefined,
    },
    prismBase: {
      type: String,
      trim: true,
      default: undefined,
    },
    visualAcuityDistance: {
      type: String,
      trim: true,
      default: undefined,
    },
    visualAcuityNear: {
      type: String,
      trim: true,
      default: undefined,
    },
  },
  { _id: false }
);

/**
 * Sub-esquema de mediciones visuales adicionales.
 * Unidades:
 * - pupillaryDistance: Distancia pupilar binocular en milímetros (mm).
 * - rightPupillaryDistance: Distancia pupilar monocular derecha en milímetros (mm).
 * - leftPupillaryDistance: Distancia pupilar monocular izquierda en milímetros (mm).
 * - intraocularPressureOD: Presión intraocular ojo derecho en milímetros de mercurio (mmHg).
 * - intraocularPressureOS: Presión intraocular ojo izquierdo en milímetros de mercurio (mmHg).
 * - workingDistance: Distancia de trabajo habitual para visión de cerca en milímetros (mm).
 */
const visualMeasurementsSchema = new mongoose.Schema(
  {
    pupillaryDistance: {
      type: Number,
      default: undefined,
    },
    rightPupillaryDistance: {
      type: Number,
      default: undefined,
    },
    leftPupillaryDistance: {
      type: Number,
      default: undefined,
    },
    intraocularPressureOD: {
      type: Number,
      default: undefined,
    },
    intraocularPressureOS: {
      type: Number,
      default: undefined,
    },
    workingDistance: {
      type: Number,
      default: undefined,
    },
  },
  { _id: false }
);

/**
 * Esquema principal de Examen Optométrico Clínico.
 */
const examSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'El ID del paciente es requerido'],
      index: true,
    },
    examDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    examType: {
      type: String,
      trim: true,
      default: 'examen_visual',
    },
    optometristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reasonForVisit: {
      type: String,
      trim: true,
      default: '',
    },
    od: {
      type: eyeGraduationSchema,
      required: [true, 'La graduación de OD (ojo derecho) es requerida'],
    },
    os: {
      type: eyeGraduationSchema,
      required: [true, 'La graduación de OS (ojo izquierdo) es requerida'],
    },
    visualMeasurements: {
      type: visualMeasurementsSchema,
      default: undefined,
    },
    diagnosis: {
      type: String,
      trim: true,
      default: '',
    },
    recommendations: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    followUpDate: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Exam', examSchema);

