import jwt from 'jsonwebtoken';
import { validationResult, check } from 'express-validator';
import { cartsService, usersService } from '../services/index.js';
import { generateToken, generateRefreshToken } from '../utils/jsonWebToken.js';
import { createHash, isValidPassword, isStrongPassword } from '../utils/bcryptPassword.js';
import { logger } from '../utils/logger.js';
import { sendEmail } from '../utils/sendEmail.js';
import { JWT_PRIVATE_KEY, URL_RESET_PASS, NODE_ENV } from '../config/config.js';

// Middleware de validación de campos
export const validateFields = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			ok: false,
			errors: errors.mapped()
		});
	}
	next();
};

// Middleware de validación para login
export const loginValidations = [
	check('email', 'El email es obligatorio').isEmail(),
	check('password', 'La contraseña es obligatoria').notEmpty()
];

// Middleware de validación para registro
export const registerValidations = [
	check('first_name', 'El nombre es obligatorio').notEmpty(),
	check('last_name', 'El apellido es obligatorio').notEmpty(),
	check('email', 'El email no es válido').isEmail(),
	check('password')
		.isLength({ min: 8 })
		.withMessage('La contraseña debe tener al menos 8 caracteres')
		.custom((value) => isStrongPassword(value))
		.withMessage('La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales')
];

// Middleware de validación para restablecer contraseña
export const resetPasswordValidations = [
	check('token', 'El token es requerido').notEmpty(),
	check('password')
		.isLength({ min: 8 })
		.withMessage('La contraseña debe tener al menos 8 caracteres')
		.custom((value) => isStrongPassword(value))
		.withMessage('La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales')
];


export const sessionLogin = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const user = await usersService.getUserByEmail(email);
		if (!user) {
			return res.status(400).json({
				ok: false,
				msg: 'Credenciales inválidas'
			});
		}

		const validPassword = isValidPassword(password, user.password);
		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Credenciales inválidas'
			});
		}


		// Actualizar último inicio de sesión
		user.last_login = new Date();
		await user.save();

		const { _id, first_name, last_name, role } = user;

		// Generar tokens
		const token = generateToken({ _id, email, role });
		const refreshToken = generateRefreshToken({ _id });

		// Guardar refresh token en la base de datos
		await usersService.updateUser(_id, { refreshToken });


		// Configurar cookies seguras
		const cookieOptions = {
			httpOnly: true,
			secure: NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 24 * 60 * 60 * 1000 // 1 día
		};

		res.cookie('jwt', refreshToken, cookieOptions);

		return res.json({
			ok: true,
			user: {
				_id,
				first_name,
				last_name,
				email,
				role
			},
			token
		});

	} catch (error) {
		logger.error(`Error en login: ${error.message}`);
		next(error);
	}
};

export const sessionRegister = async (req, res, next) => {
	try {
		console.log('=== INICIO DEL REGISTRO ===');
		console.log('Datos recibidos en el body:', JSON.stringify(req.body, null, 2));
		
		const { email, password, first_name, last_name} = req.body;
		
		// Validar campos requeridos
		console.log('Validando campos requeridos...');
		console.log('Email:', email);
		console.log('Password:', password ? '***' : 'No proporcionada');
		console.log('First Name:', first_name);
		console.log('Last Name:', last_name);

		// Validar campos requeridos
		if (!email || !password || !first_name || !last_name) {
			return res.status(400).json({
				ok: false,
				msg: 'Todos los campos son obligatorios',
				missingFields: {
					email: !email,
					password: !password,
					first_name: !first_name,
					last_name: !last_name
				}
			});
		}

		// Verificar si el usuario ya existe
		console.log('Buscando usuario con email:', email);
		const userExists = await usersService.getUserByEmail(email);
		console.log('Resultado de la búsqueda:', userExists ? 'Usuario encontrado' : 'Usuario no encontrado');
		if (userExists) {
			return res.status(400).json({
				ok: false,
				msg: 'El correo electrónico ya está registrado'
			});
		}

		// Validar fortaleza de la contraseña
		console.log('Validando fortaleza de la contraseña...');
		const passwordIsStrong = isStrongPassword(password);
		console.log('Contraseña válida?:', passwordIsStrong);
		
		if (!passwordIsStrong) {
			return res.status(400).json({
				ok: false,
				msg: 'La contraseña debe contener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales',
				passwordRequirements: {
					minLength: password.length >= 8,
					hasUpperCase: /[A-Z]/.test(password),
					hasLowerCase: /[a-z]/.test(password),
					hasNumbers: /[0-9]/.test(password),
					hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
				}
			});
		}

		// Crear carrito para el usuario
		console.log('Creando carrito para el nuevo usuario...');
		const cart = await cartsService.addCart();
		console.log('Carrito creado:', cart ? `ID: ${cart._id}` : 'No se pudo crear el carrito');
		if (!cart) {
			throw new Error('No se pudo crear el carrito');
		}

		// Crear usuario
		console.log('Preparando datos del usuario...');
		const hashedPassword = createHash(password);
		console.log('Contraseña hasheada:', hashedPassword ? '***' : 'Error al hashear');
		
		const userData = {
			first_name,
			last_name,
			email,
			password: hashedPassword,
			cart_id: cart._id
		};
		
		console.log('Datos del usuario a crear:', {
			...userData,
			password: '***'
		});

		const user = await usersService.createUser(userData);
		const { _id, role } = user;

		// Generar tokens
		const token = generateToken({ _id, email, role });
		const refreshToken = generateRefreshToken({ _id });

		// Guardar refresh token en la base de datos
		await usersService.updateUser(_id, { refreshToken });

		// Configurar cookies seguras
		const cookieOptions = {
			httpOnly: true,
			secure: NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 24 * 60 * 60 * 1000 // 1 día
		};

		res.cookie('jwt', refreshToken, cookieOptions);

		return res.status(201).json({
			ok: true,
			user: {
				_id,
				first_name,
				last_name,
				email,
				role,
				cart_id: cart._id
			},
			token
		});

	} catch (error) {
		console.error('=== ERROR EN EL REGISTRO ===');
		console.error('Tipo de error:', error.name);
		console.error('Mensaje:', error.message);
		console.error('Stack:', error.stack);
		
		if (error.name === 'ValidationError') {
			console.error('Errores de validación:', error.errors);
			return res.status(400).json({
				ok: false,
				msg: 'Error de validación',
				errors: Object.values(error.errors).map(err => err.message)
			});
		}
		
		logger.error(`Error en sessionRegister: ${error.message}`, { error });
		return res.status(500).json({
			ok: false,
			msg: 'Error interno del servidor al registrar el usuario',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined
		});
	}
};

/**
 * @desc    Renovar token de autenticación
 * @route   GET /api/session/renew
 * @access  Privado
 */
export const revalidateToken = async (req, res, next) => {
	try {
		const { _id, first_name, last_name, email, role } = req.user;

		const user = await usersService.getUserByEmail(email);
		if (!user) {
			return res.status(404).json({
				ok: false,
				msg: 'Usuario no encontrado'
			});
		}

		const token = generateToken({ _id, first_name, last_name, email, role });

		return res.json({
			ok: true,
			user: {
				_id,
				first_name,
				last_name,
				email,
				role
			},
			token
		});
	} catch (error) {
		logger.error(`Error en revalidateToken: ${error.message}`);
		next(error);
	}
};

/**
 * @desc    Solicitar restablecimiento de contraseña
 * @route   POST /api/session/forgot-password
 * @access  Público
 */
export const changePassword = async (req, res, next) => {
	try {
		const { email } = req.body;

		const user = await usersService.getUserByEmail(email);
		if (!user) {
			// No revelar que el correo no existe por razones de seguridad
			return res.json({
				ok: true,
				msg: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña'
			});
		}

		// Generar token de un solo uso
		const resetToken = generateToken({
			id: user._id,
			email: user.email
		}, '15m'); // Token válido por 15 minutos

		// Guardar el token en el usuario
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutos
		await user.save();

		const resetUrl = `${URL_RESET_PASS}?token=${resetToken}`;

		// Enviar correo con el enlace de restablecimiento
		await sendEmail({
			to: email,
			subject: 'Restablece tu contraseña',
			html: `
                    <h1>Restablecer contraseña</h1>
                    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                    <a href="${resetUrl}">Restablecer contraseña</a>
                    <p>Este enlace expirará en 15 minutos.</p>
                    <p>Si no solicitaste este cambio, por favor ignora este correo.</p>
                `
		});

		return res.json({
			ok: true,
			msg: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña'
		});

	} catch (error) {
		logger.error(`Error en changePassword: ${error.message}`);
		next(error);
	}
};

export const validateTokenPass = async (req, res, next) => {
	try {
		const { token } = req.query;
		if (!token) {
			return res.status(400).json({
				ok: false,
				msg: 'Token no proporcionado'
			});
		}

		const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
		const user = await usersService.getUserByEmail(decoded.email);

		if (!user || user.resetPasswordToken !== token) {
			return res.status(400).json({
				ok: false,
				msg: 'Token inválido o expirado'
			});
		}

		if (user.resetPasswordExpires < Date.now()) {
			return res.status(400).json({
				ok: false,
				msg: 'El token ha expirado'
			});
		}

		return res.json({
			ok: true,
			token,
			email: decoded.email
		});

	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({
				ok: false,
				msg: 'Token expirado'
			});
		}
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({
				ok: false,
				msg: 'Token inválido'
			});
		}
		logger.error(`Error en validateTokenPass: ${error.message}`);
		next(error);
	}
};

/**
 * @desc    Restablecer contraseña
 * @route   POST /api/session/reset-password
 * @access  Público
 */
export const resetPassword = async (req, res, next) => {
	try {
		const { token, password } = req.body;

		// Verificar el token
		const decoded = jwt.verify(token, JWT_PRIVATE_KEY);

		// Buscar usuario por ID del token
		const user = await usersService.getUserById(decoded.id);

		if (!user || user.resetPasswordToken !== token) {
			return res.status(400).json({
				ok: false,
				msg: 'Token inválido o expirado'
			});
		}

		// Verificar si el token ha expirado
		if (user.resetPasswordExpires < Date.now()) {
			return res.status(400).json({
				ok: false,
				msg: 'El enlace ha expirado. Por favor, solicita otro'
			});
		}


		// Verificar si la nueva contraseña es diferente a la actual
		const isSamePassword = isValidPassword(password, user.password);
		if (isSamePassword) {
			return res.status(400).json({
				ok: false,
				msg: 'La nueva contraseña debe ser diferente a la actual'
			});
		}
		// Actualizar contraseña y limpiar token
		user.password = createHash(password);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;

		await user.save();

		// Enviar confirmación por correo
		await sendEmail({
			to: user.email,
			subject: 'Contraseña actualizada',
			html: `
                    <h1>Contraseña actualizada</h1>
                    <p>Tu contraseña ha sido actualizada exitosamente.</p>
                    <p>Si no realizaste este cambio, por favor contacta a soporte inmediatamente.</p>
                `
		});

		return res.json({
			ok: true,
			msg: 'Contraseña actualizada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.'
		});

	} catch (error) {
		if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
			return res.status(400).json({
				ok: false,
				msg: 'Token inválido o expirado. Por favor, solicita otro enlace.'
			});
		}
		logger.error(`Error en resetPassword: ${error.message}`);
		next(error);
	}
}

export const getUsers = async (req, res, next) => {
	try {
		const users = await usersService.getUsers();

		// No devolver información sensible como contraseñas
		const sanitizedUsers = users.map(user => ({
			_id: user._id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			role: user.role,
			last_login: user.last_login,
			cart_id: user.cart_id
		}));

		return res.json({
			ok: true,
			users: sanitizedUsers
		});

	} catch (error) {
		logger.error(`Error en getUsers: ${error.message}`);
		next(error);
	}
};

export const deleteUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		logger.info(`Intentando eliminar usuario con ID: ${id}`);

		// Verificar si el usuario está autenticado
		if (!req.user || !req.user._id) {
			logger.warn('Intento de eliminación sin autenticación');
			return res.status(401).json({
				ok: false,
				msg: 'No autorizado. Debes iniciar sesión primero.'
			});
		}

		// Verificar que el usuario no se esté intentando eliminar a sí mismo
		if (req.user._id.toString() === id) {
			logger.warn('Intento de auto-eliminación detectado');
			return res.status(400).json({
				ok: false,
				msg: 'No puedes eliminar tu propia cuenta'
			});
		}

		// Verificar que el usuario a eliminar exista
		const userToDelete = await usersService.getUserById(id);
		if (!userToDelete) {
			logger.warn(`Usuario con ID ${id} no encontrado`);
			return res.status(404).json({
				ok: false,
				msg: 'Usuario no encontrado'
			});
		}

		// Verificar permisos (solo admin puede eliminar usuarios)
		if (req.user.role !== 'admin') {
			logger.warn('Intento de eliminación sin permisos de administrador');
			return res.status(403).json({
				ok: false,
				msg: 'No tienes permiso para realizar esta acción. Se requieren permisos de administrador.'
			});
		}

		logger.info(`Eliminando usuario: ${userToDelete.email}`);
		const deletedUser = await usersService.deleteUser(id);

		if (!deletedUser) {
			logger.error('Error al eliminar usuario: deleteUser devolvió null');
			return res.status(500).json({
				ok: false,
				msg: 'Error al eliminar el usuario'
			});
		}

		logger.info(`Usuario ${userToDelete.email} eliminado correctamente`);
		return res.json({
			ok: true,
			msg: 'Usuario eliminado correctamente',
			deletedUserId: id
		});
	} catch (error) {
		logger.error('Error en deleteUser:', {
			error: error.message,
			stack: error.stack,
			userId: req.user?._id,
			targetUserId: req.params?.id
		});
		return res.status(500).json({
			ok: false,
			msg: 'Error interno del servidor al eliminar el usuario',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined
		});
	}
};


export const deleteInactiveUsers = async (req, res, next) => {
	try {
		const users = await usersService.getUsers();
		const date = new Date();
		const twoDaysAgo = new Date(date.setDate(date.getDate() - 2));

		const usersToDelete = users.filter(user => {
			// No eliminar usuarios administradores
			if (user.role === 'admin') return false;

			// Solo eliminar usuarios inactivos por más de 2 días
			return user.last_login && new Date(user.last_login) < twoDaysAgo;
		});

		// Usar Promise.all para eliminar usuarios en paralelo
		await Promise.all(
			usersToDelete.map(user => usersService.deleteUser(user._id))
		);

		return res.json({
			ok: true,
			msg: 'Usuarios inactivos eliminados correctamente',
			deletedCount: usersToDelete.length
		});

	} catch (error) {
		logger.error(`Error en deleteInactiveUsers: ${error.message}`);
		next(error);
	}
};

export const getUserById = async (req, res, next) => {
	try {
		const { id } = req.params;

		// Buscar el usuario por ID
		const user = await usersService.getUserById(id);
		if (!user) {
			return res.status(404).json({
				ok: false,
				msg: 'Usuario no encontrado'
			});
		}

		// Devolver los datos del usuario (sin información sensible)
		const { _id, first_name, last_name, email, role, last_connection, cart_id } = user;
		
		return res.json({
			ok: true,
			user: {
				id: _id,
				first_name,
				last_name,
				email,
				role,
				last_connection,
				cart_id: cart_id ? cart_id.toString() : null
			}
		});

	} catch (error) {
		logger.error(`Error en getUserById: ${error.message}`);
		next(error);
	}
};

export const switchUserRole = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { role } = req.body;

		// Verificar si el usuario existe
		const user = await usersService.getUserById(id);
		if (!user) {
			return res.status(404).json({
				ok: false,
				msg: 'Usuario no encontrado'
			});
		}

		// Verificar si el rol solicitado es válido
		if (role && !['user', 'premium', 'admin'].includes(role)) {
			return res.status(400).json({
				ok: false,
				msg: 'Rol no válido. Los roles permitidos son: user, premium, admin'
			});
		}

		// Cambiar el rol del usuario
		const updatedUser = await usersService.switchRole(id, user.role, role);

		return res.json({
			ok: true,
			msg: 'Rol de usuario actualizado correctamente',
			user: {
				id: updatedUser._id,
				email: updatedUser.email,
				role: updatedUser.role
			}
		});

	} catch (error) {
		logger.error(`Error en switchUserRole: ${error.message}`);
		next(error);
	}
};
