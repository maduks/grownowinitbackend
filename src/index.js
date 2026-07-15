import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/v1/auth', authRoutes);

// Using top level for the rest since their paths inside the router files
// are explicitly defined according to the spec
app.use('/v1', registrationRoutes);
app.use('/v1', eventRoutes);
app.use('/v1', contactRoutes);

app.get('/', (req, res) => {
  res.send('GET Initiative API is running...');
});

// Generic error handler to catch invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, error: 'Invalid JSON payload format' });
  }
  next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
