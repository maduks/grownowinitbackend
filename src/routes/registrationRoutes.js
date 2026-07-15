import express from 'express';
import { createRegistration, getRegistrations, getRegistrationById } from '../controllers/registrationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route for form submission
router.post('/registrations', createRegistration);

// Admin routes for fetching data
router.get('/admin/registrations', protect, getRegistrations);
router.get('/admin/registrations/:id', protect, getRegistrationById);

export default router;
