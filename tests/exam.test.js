const { describe, it, mock, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

const Exam = require('../src/models/exam');
const Patient = require('../src/models/patient');
const {
  createExamService,
  getExamByIdService,
  getAllExamsService,
  getPatientExamsService,
  updateExamService
} = require('../src/services/examService');

describe('Pruebas Unitarias e Integración: HU Registro y Gestión de Exámenes Optométricos', () => {
  const mockPatientId = new mongoose.Types.ObjectId().toString();
  const mockExamId = new mongoose.Types.ObjectId().toString();
  const mockOptometristId = new mongoose.Types.ObjectId().toString();

  afterEach(() => {
    mock.reset();
  });

  // 1. Registro exitoso
  it('1. Debe registrar un examen exitosamente asociado a un paciente existente', async () => {
    mock.method(Patient, 'findById', async (id) => {
      if (id === mockPatientId) {
        return { _id: mockPatientId, name: 'Juan Pérez', documentNumber: '1098765432' };
      }
      return null;
    });

    const examInput = {
      patientId: mockPatientId,
      examType: 'examen_visual',
      reasonForVisit: 'Visión borrosa en ojo derecho',
      od: {
        sphere: -1.75,
        cylinder: -0.50,
        axis: 90,
        addition: 1.00,
        visualAcuityDistance: '20/20'
      },
      os: {
        sphere: -1.25,
        cylinder: 0,
        addition: 1.00,
        visualAcuityDistance: '20/20'
      },
      visualMeasurements: {
        pupillaryDistance: 64,
        workingDistance: 400
      },
      diagnosis: 'Miopía leve y astigmatismo',
      recommendations: 'Uso de gafas de descanso'
    };

    mock.method(Exam, 'create', async (data) => ({
      _id: mockExamId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const result = await createExamService(examInput, mockOptometristId);

    assert.strictEqual(result.notFound, undefined);
    assert.ok(result.data);
    assert.strictEqual(result.data.patientId, mockPatientId);
    assert.strictEqual(result.data.optometristId, mockOptometristId);
    assert.strictEqual(result.data.od.sphere, -1.75);
    assert.strictEqual(result.data.os.cylinder, 0);
  });

  // 2. Paciente inexistente
  it('2. Debe retornar notFound si el paciente especificado no existe', async () => {
    mock.method(Patient, 'findById', async () => null);

    const examInput = {
      patientId: mockPatientId,
      od: { sphere: -1.00 },
      os: { sphere: -1.00 }
    };

    const result = await createExamService(examInput, mockOptometristId);
    assert.strictEqual(result.notFound, true);
    assert.match(result.message, /El paciente especificado no existe/);
  });

  // 3. Validación de graduación: negativa, positiva y neutra (cero)
  it('3. Debe admitir graduaciones negativas, positivas y neutras (cero)', () => {
    const validDoc = new Exam({
      patientId: mockPatientId,
      od: { sphere: -5.75, cylinder: 0 },
      os: { sphere: +2.50, cylinder: -1.25, axis: 45 }
    });

    const error = validDoc.validateSync();
    assert.strictEqual(error, undefined, 'No debe arrojar error de validación');
    assert.strictEqual(validDoc.od.sphere, -5.75);
    assert.strictEqual(validDoc.os.sphere, 2.50);
  });

  // 4. Campos opcionales sin forzar ceros indebidos
  it('4. Los campos opcionales no medidos deben permanecer como undefined', () => {
    const examDoc = new Exam({
      patientId: mockPatientId,
      od: { sphere: -1.00 },
      os: { sphere: -1.00 }
    });

    const error = examDoc.validateSync();
    assert.strictEqual(error, undefined);
    assert.strictEqual(examDoc.od.addition, undefined, 'Adición debe ser undefined');
    assert.strictEqual(examDoc.od.prism, undefined, 'Prisma debe ser undefined');
    assert.strictEqual(examDoc.visualMeasurements, undefined, 'visualMeasurements debe ser undefined');
    assert.ok(examDoc.examDate instanceof Date, 'examDate debe ser asignado automáticamente');
  });

  // 5. Consulta por ID con datos poblados
  it('5. Debe consultar un examen por su ID retornando datos del paciente', async () => {
    const mockPopulatedExam = {
      _id: mockExamId,
      patientId: { _id: mockPatientId, name: 'Juan Pérez' },
      od: { sphere: -1.00 },
      os: { sphere: -1.00 }
    };

    mock.method(Exam, 'findById', () => ({
      populate: () => ({
        populate: async () => mockPopulatedExam
      })
    }));

    const exam = await getExamByIdService(mockExamId);
    assert.ok(exam);
    assert.strictEqual(exam.patientId.name, 'Juan Pérez');
  });

  // 6. Historial del paciente ordenado descendente
  it('6. Debe obtener el historial de exámenes de un paciente con orden descendente', async () => {
    mock.method(Patient, 'findById', async () => ({ _id: mockPatientId }));
    mock.method(Exam, 'countDocuments', async () => 2);
    mock.method(Exam, 'find', () => ({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            select: async () => [
              { _id: 'exam-2', examDate: new Date('2026-10-20') },
              { _id: 'exam-1', examDate: new Date('2026-05-15') }
            ]
          })
        })
      })
    }));

    const result = await getPatientExamsService(mockPatientId, { page: 1, limit: 10 });
    assert.strictEqual(result.notFound, undefined);
    assert.strictEqual(result.exams.length, 2);
    assert.strictEqual(result.pagination.total, 2);
  });

  // 7. Paginación y filtros en listado general
  it('7. Debe listar exámenes aplicando filtros y paginación', async () => {
    mock.method(Exam, 'countDocuments', async (query) => {
      assert.strictEqual(query.examType, 'control');
      return 1;
    });

    mock.method(Exam, 'find', () => ({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            populate: () => ({
              populate: async () => [{ _id: 'exam-filtrado', examType: 'control' }]
            })
          })
        })
      })
    }));

    const result = await getAllExamsService({ examType: 'control' }, { page: 1, limit: 10 });
    assert.strictEqual(result.exams.length, 1);
    assert.strictEqual(result.pagination.total, 1);
    assert.strictEqual(result.pagination.page, 1);
  });

  // 8. Actualización sin pérdida de campos
  it('8. Debe actualizar datos clínicos sin sobrescribir campos omitidos', async () => {
    const existingExam = {
      _id: mockExamId,
      patientId: mockPatientId,
      od: {
        toObject: () => ({ sphere: -2.00, cylinder: -0.50, axis: 90 }),
        sphere: -2.00,
        cylinder: -0.50,
        axis: 90
      },
      os: {
        toObject: () => ({ sphere: -1.75, cylinder: 0 }),
        sphere: -1.75,
        cylinder: 0
      },
      notes: 'Notas iniciales',
      save: async function () {
        return this;
      }
    };

    mock.method(Exam, 'findById', async () => existingExam);

    const updatePayload = {
      notes: 'Notas actualizadas',
      od: { sphere: -2.25 } // Solo se actualiza la esfera de OD
    };

    const result = await updateExamService(mockExamId, updatePayload);
    assert.strictEqual(result.data.notes, 'Notas actualizadas');
    assert.strictEqual(result.data.od.sphere, -2.25);
    assert.strictEqual(result.data.od.cylinder, -0.50, 'El cilindro previo debe conservarse');
    assert.strictEqual(result.data.od.axis, 90, 'El eje previo debe conservarse');
  });

  // 9. Compatibilidad con documentos anteriores
  it('9. Debe ser 100% compatible con la estructura de exámenes guardados previamente', () => {
    const historicalDoc = new Exam({
      patientId: mockPatientId,
      od: { sphere: -2.00, cylinder: -0.75, axis: 180 },
      os: { sphere: -1.50, cylinder: -0.50, axis: 90 },
      notes: 'Examen histórico'
    });

    const error = historicalDoc.validateSync();
    assert.strictEqual(error, undefined, 'El documento histórico debe ser válido');
    assert.strictEqual(historicalDoc.examType, 'examen_visual');
    assert.ok(historicalDoc.examDate instanceof Date);
  });
});
