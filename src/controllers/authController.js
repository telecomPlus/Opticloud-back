const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
    }

    const secretKey = process.env.JWT_SECRET || 'clave_secreta_temporal_opticloud';
    const token = jwt.sign(
      { id: user._id, email: user.email },
      secretKey,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login exitoso',
      token,
      data: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };