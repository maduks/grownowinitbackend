import jwt from 'jsonwebtoken';

const readToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

export const protect = (req, res, next) => {
  const token = readToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

// Attaches req.user when a valid token is present, but never rejects the request.
export const optionalAuth = (req, res, next) => {
  const token = readToken(req);
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      req.user = undefined;
    }
  }
  next();
};

// Must run after `protect`. Tokens issued before roles existed carry role "admin".
export const authorize = (...roles) => (req, res, next) => {
  const role = req.user?.role || 'admin';
  if (!roles.includes(role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
  }
  next();
};
