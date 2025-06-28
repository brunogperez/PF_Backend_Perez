import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { JWT_PRIVATE_KEY } from '../config/config.js'
import { logger } from '../utils/logger.js'

export const isAdmin = (req, res, next) => {
  if (!(req.role === 'admin' || req.role === 'premium'))
    return res.status(403).json({ ok: false, msg: 'Permisos insuficientes' })
  next()
}

export const validateFields = (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return res.status(400).json(error)
  }
  next()
}

export const validarJWT = (req, res, next) => {
  try {
    // Obtener el token del encabezado 'x-token' o 'authorization'
    let token = req.header('x-token') || req.header('authorization');
    
    if (!token) {
      return res.status(401).json({ 
        ok: false, 
        msg: 'No se proporcionó token de autenticación',
        code: 'MISSING_TOKEN'
      });
    }

    try {
      // Verificar si el token está en la lista negra (si se implementa)
      if (global.tokenBlacklist && global.tokenBlacklist[token]) {
        return res.status(401).json({
          ok: false,
          msg: 'Token inválido',
          code: 'TOKEN_BLACKLISTED'
        });
      }

      const decoded = jwt.verify(token, JWT_PRIVATE_KEY, {
        ignoreExpiration: false,
        clockTolerance: 5 // 5 segundos de tolerancia para sincronización de reloj
      });
      
      if (!decoded._id || !decoded.role) {
        return res.status(401).json({
          ok: false,
          msg: 'Token inválido - Faltan campos requeridos',
          code: 'INVALID_TOKEN_FORMAT'
        });
      }

      // Verificar si el token ha expirado manualmente (como respaldo)
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        return res.status(401).json({
          ok: false,
          msg: 'La sesión ha expirado. Por favor, inicia sesión nuevamente.',
          code: 'TOKEN_EXPIRED'
        });
      }

      // Asignar datos del usuario al request
      const userInfo = {
        _id: decoded._id,
        email: decoded.email,
        role: decoded.role
      };
      
      req.user = userInfo;
      
      // Mantener compatibilidad con el código existente
      req._id = userInfo._id;
      req.email = userInfo.email;
      req.role = userInfo.role;
      req.first_name = decoded.first_name;
      req.last_name = decoded.last_name;
      
      // Asignar el usuario completo al request para compatibilidad
      req.user = {
        _id: decoded._id,
        email: decoded.email,
        role: decoded.role,
        first_name: decoded.first_name,
        last_name: decoded.last_name
      };

      return next();
      
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          ok: false, 
          msg: 'La sesión ha expirado. Por favor, inicia sesión nuevamente.',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          ok: false,
          msg: 'Token inválido',
          code: 'INVALID_TOKEN',
          details: process.env.NODE_ENV === 'development' ? jwtError.message : undefined
        });
      }
      
      return res.status(401).json({ 
        ok: false, 
        msg: 'Error de autenticación',
        code: 'AUTH_ERROR',
        details: process.env.NODE_ENV === 'development' ? jwtError.message : undefined
      });
    }
    
  } catch (error) {
    logger.error('Error inesperado en middleware validarJWT:', error);
    return res.status(500).json({ 
      ok: false, 
      msg: 'Error interno del servidor al validar la autenticación',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};