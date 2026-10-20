const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado. No se proporcionó un token de autenticación.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Reemplaza 'TU_SECRET_KEY' por la variable de entorno process.OnInit o JWT_SECRET de tu .env
    const secretKey = process.env.JWT_SECRET || 'clave_secreta_temporal_opticloud';
    const decoded = jwt.verify(token, secretKey);

    req.user = decoded; // Guardamos los datos del usuario decodificados en la petición
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido o expirado.'
    });
  }
};

module.exports = verifyToken;