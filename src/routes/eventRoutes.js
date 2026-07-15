import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/admin/events')
  .get(getEvents)
  .post(protect, createEvent);

router.route('/admin/events/:id')
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

export default router;
