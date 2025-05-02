const jwt = require('jsonwebtoken');
const AdminUser = require('../../models/adminModels/adminUserSchema');

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        // console.log("this is the admin Token => ",token);
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("data in admin token => ",decoded)

        const user = await AdminUser.findById(decoded.userId.id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token admin' });
        }

        req.user = user;
        req.definedBy = decoded.userId.id;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: `Authentication error admin: ${error.message}` });
    }
};

module.exports = authenticate;
