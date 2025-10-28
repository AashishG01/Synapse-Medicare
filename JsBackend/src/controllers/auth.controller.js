import User from '../models/user.model.js'; // <-- Note the .js extension
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper function to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (patient)
// @route   POST /api/auth/register/user
export const registerUser = async (req, res) => {
    // ... (logic is exactly the same)
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      user = new User({ name, email, password, role: 'user' });
      await user.save();
  
      const token = generateToken(user._id, user.role);
      res.status(201).json({ token, role: user.role });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
};

// @desc    Register a new hospital
// @route   POST /api/auth/register/hospital
export const registerHospital = async (req, res) => {
    // ... (logic is exactly the same)
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ msg: 'Hospital account already exists' });
        }
    
        user = new User({ name, email, password, role: 'hospital' });
        await user.save();
    
        const token = generateToken(user._id, user.role);
        res.status(201).json({ token, role: user.role });
    
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
};

// @desc    Login user or hospital
// @route   POST /api/auth/login
export const login = async (req, res) => {
    // ... (logic is exactly the same)
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
  
      const token = generateToken(user._id, user.role);
      res.json({ token, role: user.role });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
};