import { logger } from '../utils/logger.js';

export const errorHandler = (error, req, res, next) => {
    logger.error(`Error: ${error.message}`);
    logger.error(`Stack: ${error.stack}`);
    
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            ok: false,
            msg: 'Error de validación',
            errors: error.errors
        });
    }

    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            ok: false,
            msg: 'Token inválido'
        });
    }

    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            ok: false,
            msg: 'Token expirado'
        });
    }

    // Error por defecto
    res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};

export const notFoundHandler = (req, res) => {
    res.status(404).json({
        ok: false,
        msg: 'Ruta no encontrada'
    });
};
