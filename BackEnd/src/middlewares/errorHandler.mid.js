function errorHandler (error, req, res, next) {
    console.log(error);
    const message = `${req.method} ${req.url} - ` + (error.message ||  'Internal Server Error');
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ message })
}

export default errorHandler