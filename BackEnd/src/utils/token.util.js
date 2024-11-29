import jwt from 'jsonwebtoken';
const { SECRET_KEY } = process.env;

function createTokenUtil(data) {
    const token = jwt.sign(
        data,
        SECRET_KEY,
        { expiresIn: 60 * 60 * 24 * 7 }
    );
    return token;
}


function verifyTokenUtil(token) {
    try {
    const verifyData = jwt.verify(token, SECRET_KEY);
    return verifyData;
    } catch (err) {
        throw new Error("Token is invalid");
        
    }
}

export { createTokenUtil, verifyTokenUtil };