import express from 'express';
import { createRegistration, getRegistrations, getRegistrationById } from '../controllers/registrationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route for form submission
router.post('/registrations', createRegistration);

// Admin routes for fetching data
router.get('/admin/registrations', protect, authorize('admin'), getRegistrations);
router.get('/admin/registrations/:id', protect, authorize('admin'), getRegistrationById);

export default router;
