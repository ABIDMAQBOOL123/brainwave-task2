const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  
//   const token = req.cookies['x-auth-token'];
const token = req.cookies['x-auth-token'] || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
  console.log(req.cookies['x-auth-token'])
 
  
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    
    req.user = await User.findById(decoded.id);
    
    
    next();
  } catch (error) {
    
    res.status(400).json({ message: 'Invalid token' });
  }
};
