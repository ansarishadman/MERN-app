const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : '';
    
    if (!token) {
        return res.status(403).json({ status: 'error', error: 'No token provided!' });
    }

    jwt.verify(token, 'secretToken', (err, decoded) => {
        if (err) {
            return res.status(500).json({ status: 'error', error: 'Failed to authenticate token!' });
        }

        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;