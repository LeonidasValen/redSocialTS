import rateLimit from 'express-rate-limit'

export const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 12, // número máximo de intentos de inicio de sesión permitidos dentro del período de tiempo
    message: 'Demasiados intentos de inicio de sesión. Por favor, inténtalo de nuevo más tarde.'
})

export const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // número máximo de intentos de inicio de sesión permitidos dentro del período de tiempo
    message: 'Demasiadas peticiones. Vuelva más tarde.'
})