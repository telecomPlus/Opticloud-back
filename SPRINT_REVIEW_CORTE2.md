# Reporte de Sprint Review - Cierre de Corte II
**Asignatura:** Mobile and Cloud Computing - IS0276 - 210  
**Proyecto:** OptiCloud - Sistema de Gestión Óptica  
**Equipo de Desarrollo:**
- Juan Andrés Gómez Ortiz - `@jAndres-Ortiz02` - Desarrollador Fullstack / Backend & Mobile
- Adrian Leonardo Murcia - `@adrianleonardomurcialopez-hub` - Desarrollador Fullstack / Frontend Mobile

**Fecha de la Sprint Review:** 21/10/2026  
**Enlace a la Discusión en GitHub Discussions:** https://github.org/orgs/telecomPlus/discussions/27  
**Enlace a la Demo en Video (si aplica):** https://teams.microsoft.com/l/meetingrecap?driveId=b%21QetbAZrGa0eBBSYzi9iKANCWmLYF2mhGqa_f4RP96C9_jjNkfRUxTZRZzrk4UxZt&driveItemId=01TZTJSXNDFKGTGTZV55DY4CFB3TA2HIZQ&sitePath=https%3A%2F%2Ffundacionlibertadores-my.sharepoint.com%2F%3Av%3A%2Fg%2Fpersonal%2Falmurcial_libertadores_edu_co%2FIQCjKo0zTzXvR44IodzBo6MwAcU7QSfgtvWgmLgpEX5asU4&fileUrl=https%3A%2F%2Ffundacionlibertadores-my.sharepoint.com%2F%3Av%3A%2Fg%2Fpersonal%2Falmurcial_libertadores_edu_co%2FIQCjKo0zTzXvR44IodzBo6MwAcU7QSfgtvWgmLgpEX5asU4&iCalUid=040000008200E00074C5B7101A82E00800000000272FC355A961DD0100000000000000001000000020652249559D7C48A88802EF06CD3C13&threadId=19%3Ameeting_NjI3MTNkNmQtMDY5NC00YjVhLThkNGEtN2IxMTMyOTAwODZm%40thread.v2&organizerId=03228300-7d1f-41a0-8707-675f33fcdcff&tenantId=98c5292c-6f85-4565-8ace-969dada78808&callId=d54a6da3-2a70-44d2-9794-c4a2ebf64874&threadType=Meeting&meetingType=Scheduled&subType=RecapSharingLink_RecapChiclet&recapType=RecordingAndTranscript
**Enlace al APK / Release:** [URL de GitHub Releases / APK]  

---

## 1. Resumen Ejecutivo del Incremento de Software
Durante el desarrollo del Corte II, el equipo logró transformar la aplicación móvil **OptiCloud** en una solución integral y funcional estructurada bajo el patrón de arquitectura **MVVM (Model-View-ViewModel)** con **Jetpack Compose** en el Frontend (Android/Kotlin) y una API REST robusta en el Backend (**Node.js, Express y Mongoose con MongoDB en Azure Cosmos DB**).

El incremento de software alcanzado abarca la implementación completa del sistema de **Autenticación y Seguridad (HU-01 Login / HU-13 Logout)** mediante tokens JWT e hiper-encriptación Bcrypt, mitigando vulnerabilidades críticas de control de acceso (IDOR). Asimismo, se completaron los flujos centrales de la práctica optométrica: la creación y actualización de pacientes (HU-07), el registro detallado de exámenes optométricos (HU-02) y la consulta del historial clínico del paciente (HU-03). La integración con la base de datos en la nube garantizó la persistencia real y sincrónica de historias clínicas, alertas de inventario y registros de exámenes.

---

## 2. Matriz de Trazabilidad: Historias de Usuario y Bugs del Sprint (Taller 5)

| Tipo (HU/Bug) | ID Issue | Título de la Incidencia | Responsable | Rama Git | Pull Request (PR) | Estado (Done / Incomplete) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **HU** | #23 | HU-01 – Inicio de Sesión de Usuario (JWT) | @jAndres-Ortiz02 | `juan-qa` / `feature/hu01-login` | PR #24 (Merged) | Done |
| **HU** | #29 | HU-13 – Cerrar Sesión de Usuario | @jAndres-Ortiz02 | `juan-hu13-logout` | PR #28 (Merged) | Done |
| **HU** | #13 | HU-07 – Crear y Actualizar Datos de Paciente | @adrianleonardomurcialopez-hub | `feature/hu07-pacientes` | PR #26 (Merged) | Done |
| **HU** | #3 | HU-02 – Registrar Examen Optométrico | @adrianleonardomurcialopez-hub | `feature/hu02-examenes` | PR #25 (Merged) | Done |
| **HU** | #4 | HU-03 – Consultar Historial de Paciente | @adrianleonardomurcialopez-hub | `feature/hu03-historial` | PR #25 (Merged) | Done |
| **BUG** | #10 | [BUG Implementación] Respuesta JSON truncada en getPatientById | @jAndres-Ortiz02 | `bugfix/issue10-patient-by-id` | PR #19 (Merged) | Done |
| **BUG** | #12 | [Code Smell] Configuración inconsistente de Timestamps en Mongoose | @jAndres-Ortiz02 | `bugfix/issue12-timestamps` | PR #20 (Merged) | Done |
| **BUG** | #8 | [BUG Funcional] Ausencia de eliminación en cascada de exámenes | @jAndres-Ortiz02 | `bugfix/issue08-cascade-delete` | PR #21 (Merged) | Done |
| **BUG** | #11 | [Code Smell] Controladores monolíticos (Fat Controllers) | @jAndres-Ortiz02 | `refactor/issue11-service-layer` | PR #22 (Merged) | Done |
| **BUG** | #13 | [BUG Seguridad] Ausencia Total de Autenticación y Autorización (IDOR) | @jAndres-Ortiz02 | `bugfix/issue13-idor-auth` | PR #23 (Merged) | Done |
| **BUG** | #9 | [BUG Implementación] Middleware de Validación anulado | @adrianleonardomurcialopez-hub | `bugfix/issue09-middleware` | PR #16 (Merged) | Done |
| **BUG** | #7 | [BUG Funcional] Pérdida silenciosa de datos (documentNumber) al crear pacientes | @adrianleonardomurcialopez-hub | `bugfix/issue07-document-number` | PR #18 (Merged) | Done |
| **BUG** | #3 | [BUG Implementación] IP base hardcodeada (Base URL local) en Frontend | @adrianleonardomurcialopez-hub | `bugfix/frontend-issue03-ip` | PR #17 (Merged) | Done |
| **BUG** | #1 | [BUG Funcional] Fallo silencioso en validación de NewPatientScreen | @adrianleonardomurcialopez-hub | `bugfix/frontend-issue01-validation` | PR #25 (Merged) | Done |
| **BUG** | #8 | [BUG Seguridad] Acciones destructivas instantáneas sin confirmación | @adrianleonardomurcialopez-hub | `bugfix/frontend-issue08-confirm` | PR #26 (Merged) | Done |

---

## 3. Integración y Persistencia con la Base de Datos Cloud (Taller 6)
- **Plataforma Cloud utilizada:** MongoDB en Azure Cosmos DB / MongoDB Atlas
- **Cuenta con acceso docente:** `endiromero@gmail.com` (Verificada: No)
- **Coherencia con el Modelo ER y Diccionario de Datos:**  
  La estructura NoSQL implementada en Mongoose y Azure refleja fielmente las entidades del modelo ER del sistema:
  - Colección `users`: Administra las credenciales, nombres del especialista y contraseñas hasheadas con Bcrypt.
  - Colección `patients`: Almacena la información demográfica, incluyendo índices únicos sobre `documentNumber`.
  - Colección `exams`: Mantiene la relación referencias hacia `patientId`, permitiendo consultas eficientes de historial clínico y eliminación en cascada.
- **Evidencias de Persistencia en Tiempo Real:**  
  [Se incluirán las capturas de pantalla de la consola de Azure Cosmos DB / MongoDB Compass mostrando los documentos creados y sincronizados desde el emulador de Android].

---

## 4. Auditoría de Flujo Git y Code Review
- **Cumplimiento de la regla de ramas individuales:**  
  Cada integrante trabajó estrictamente sobre ramas independientes asociadas a su nombre e issue (`juan-qa`, `juan-hu13-logout`, `feature/hu07-pacientes`, etc.). Ningún integrante realizó commits directamente sobre `main` o `develop`.
- **Code Review y Aprobación de Pull Requests:**  
  Se implementó una política de integración mediante **Pull Requests (PRs)** hacia la rama `qa` y `main`. Cada PR requirió revisión cruzada de código y verificación de compilación antes de ser mezclado (*merged*). En total se ejecutaron y cerraron exitosamente **11 Pull Requests** (#16 al #26).

---

## 5. Verificación de la Definition of Done (DoD)

| Criterio de la Definition of Done (DoD) | Cumplimiento | Evidencia / Justificación |
| :--- | :---: | :--- |
| Código compila sin errores en la rama principal | ✅ | Ejecución exitosa de `./gradlew installDebug` en Android Studio. |
| Ramas individuales creadas por cada HU/Bug | ✅ | Ramas `juan-qa`, `juan-hu13-logout`, `feature/hu07-pacientes`, etc. |
| Pull Requests individuales enlazados a issues | ✅ | PRs #16 al #26 enlazados a los issues #1 al #29. |
| Code review realizado y approved por pares | ✅ | Revisiones aprobadas en GitHub por `@jAndres-Ortiz02` y `@adrianleonardomurcialopez-hub`. |
| Persistencia funcional en la base de datos cloud | ❌ | Conexión activa a Azure Cosmos DB registrando pacientes y exámenes. |
| Acceso otorgado a endiromero@gmail.com | ❌ | Pendiente por conceder en el portal de Azure / MongoDB Atlas. |
| Pruebas de usuario y verificación funcional | ✅ | Pruebas de Login, Logout, creación de pacientes y consulta de exámenes en AVD Pixel 8 Pro. |

---

## 6. Balance de Acciones de Mejora del Corte I (Taller 4)
El equipo evidenció una mejora sustancial en comparación con el desempeño del Corte I:
- **Mayor volumen de entregables:** Se completaron exitosamente 5 Historias de Usuario (HU) y 10 correcciones de bugs y refactorizaciones críticas.
- **Metodología y Comunicación:** Se incrementó la frecuencia de comunicación dentro del equipo y se mantuvo un control riguroso del tablero Kanban en GitHub Projects.
- **Flujo de Trabajo Git:** Se adoptó formalmente el uso de Pull Requests con ramas de desarrollo limpias, reduciendo significativamente los conflictos de merge e impulsando la calidad y seguridad del código de la aplicación.

---

## 7. Adaptaciones y Proyección para el Corte III
- **Lecciones aprendidas durante la Sprint Review:** La gestión de la asincronía en las peticiones HTTP y el almacenamiento seguro de credenciales locales (SharedPreferences + Memoria RAM) son claves para evitar errores de autorización (401) en la experiencia de usuario.
- **Deuda técnica o ítems pendientes (Not Done):** Otorgar formalmente los permisos de lectura en la consola cloud a la cuenta del docente (`endiromero@gmail.com`) y grabar el video demostrativo.
- **Próximos pasos en el Product Backlog (Corte III):**
  1. Implementar el módulo completo de Inventario y Alertas de bajo stock de insumos ópticos.
  2. Automatización de pruebas y canalizaciones CI/CD para compilación de APKs.
