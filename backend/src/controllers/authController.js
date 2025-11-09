import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// 🧾 Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, collegeName } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Password will be automatically hashed by the User model pre-save hook
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: password,
      collegeName,
      role: 'member',
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check if user is OAuth user (no password)
    if (user.provider && !user.password) {
      return res.status(400).json({
        message: 'Please use OAuth login for this account'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👤 Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 OAuth Success handler
export const oauthSuccess = async (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user._id);
    
    // Return HTML that will store the token in localStorage and close the popup
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Login Successful</title>
        </head>
        <body>
          <script>
            // Store token and user data in localStorage
            localStorage.setItem('token', '${token}');
            localStorage.setItem('user', JSON.stringify({
              _id: '${user._id}',
              name: '${user.name}',
              email: '${user.email}',
              role: '${user.role}',
              provider: '${user.provider}',
              avatar: '${user.avatar || ''}',
            }));
            
            // Close the popup window
            window.close();
          </script>
          <p>Login successful! You can close this window.</p>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 OAuth Failure handler
export const oauthFailure = (req, res) => {
  res.status(401).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Login Failed</title>
      </head>
      <body>
        <script>
          window.close();
        </script>
        <p>Login failed. You can close this window.</p>
      </body>
    </html>
  `);
};
