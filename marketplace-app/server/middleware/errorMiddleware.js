/**
 * Global Error Handler Middleware
 * Catches all errors passed to next() and formats them for the client.
 */
const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Development vs Production logging
    if (process.env.NODE_ENV === 'development') {
        console.error(`[DEV ERROR] ${err.message}`, {
            stack: err.stack,
            path: req.originalUrl,
            method: req.method
        });
    } else if (err.statusCode === 500) {
        // Only log 500 errors in production to avoid noise
        console.error(`[PRD ERROR] ${err.message}`, { path: req.originalUrl });
    }

    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        // Hide stack trace in production for security
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorMiddleware;
