import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { protect, optionalAuth, authorize } from '../middleware/auth.js';

const router = express.Router();

const canEdit = [protect, authorize('admin', 'editor')];

router.route('/admin/events')
  .get(optionalAuth, getEvents)
  .post(...canEdit, createEvent);

router.route('/admin/events/:id')
  .put(...canEdit, updateEvent)
  .delete(...canEdit, deleteEvent);

export default router;
