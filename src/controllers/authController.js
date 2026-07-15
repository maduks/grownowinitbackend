import jwt from 'jsonwebtoken';

// @desc    Admin login
// @route   POST /auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Add 30 days to current date for expiresAt
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    return res.status(200).json({
      token,
      expiresAt: expiresAt.toISOString(),
    });
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
};
