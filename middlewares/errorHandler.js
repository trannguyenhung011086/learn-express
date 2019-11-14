module.exports = {
    createError: (err, req, res, next) => {
        if (res.headersSent) {
            return next(err);
        }

        if (err.shouldRedirect) {
            res.redirect('/user/login');
        } else {
            res.status(err.status || 500).json({
                status: err.status,
                message: err.message,
                stack: err.stack,
            });
        }
    },
};
