module.exports = {
    createError: (err, req, res, next) => {
        if (res.headersSent) {
            next(err);
        }

        res.status(err.status || 500).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
        });
    },
};
