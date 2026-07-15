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

app.use('/auth', authRoutes);

// Using top level for the rest since their paths inside the router files
// are explicitly defined according to the spec
app.use('/', registrationRoutes);
app.use('/', eventRoutes);
app.use('/', contactRoutes);

app.get('/', (req, res) => {
  res.send('GET Initiative API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
