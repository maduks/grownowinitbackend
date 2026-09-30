import express from 'express';
import { getContactInfo, updateContactInfo, submitContactMessage } from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/contact-info', getContactInfo);
router.put('/admin/contact-info', protect, authorize('admin'), updateContactInfo);
router.post('/contact', submitContactMessage);

export default router;
