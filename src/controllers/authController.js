import jwt from 'jsonwebtoken';

// @desc    Admin / content editor login
// @route   POST /auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  // "admin" has full access; "editor" (optional, set EDITOR_PASSWORD) can only manage
  // website content and events, not registrations or contact settings.
  let role = null;
  if (process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
    role = 'admin';
  } else if (process.env.EDITOR_PASSWORD && password === process.env.EDITOR_PASSWORD) {
    role = 'editor';
  }

  if (!role) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ role }, process.env.JWT_SECRET, { expiresIn: '30d' });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  return res.status(200).json({
    token,
    role,
    expiresAt: expiresAt.toISOString(),
  });
};
