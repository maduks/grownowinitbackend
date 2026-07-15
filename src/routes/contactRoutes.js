import express from 'express';
import { getContactInfo, updateContactInfo, submitContactMessage } from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/contact-info', getContactInfo);
router.put('/admin/contact-info', protect, updateContactInfo);
router.post('/contact', submitContactMessage);

export default router;
