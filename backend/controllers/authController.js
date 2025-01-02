const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();


exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;  
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ name, email, password });  
    await newUser.save();

    
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


    res.cookie('x-auth-token', token, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 3600000,   
      sameSite: 'strict',  
    });

    // res.setHeader('Authorization', `Bearer ${token}`);
    res.status(201).json({ message: 'User signed up successfully',token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    
    res.cookie('x-auth-token', token, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === 'production',  
      maxAge: 3600000,  
      sameSite: 'strict',  
    });

    // res.setHeader('Authorization', `Bearer ${token}`);
    console.log(token)
    res.json({ message: 'User logged in successfully',
       token,
     });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};  