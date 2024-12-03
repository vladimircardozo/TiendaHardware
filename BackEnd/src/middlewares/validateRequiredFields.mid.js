function validateRequiredFields (req, res, next) {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required.'});
    }

    return next();
}

export default validateRequiredFields;