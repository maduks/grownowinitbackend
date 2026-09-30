import express from 'express';
import {
  getPublicContent,
  getAdminContent,
  updateContent,
  resetContent,
} from '../controllers/contentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const canEdit = [protect, authorize('admin', 'editor')];

router.get('/content', getPublicContent);

router.get('/admin/content', ...canEdit, getAdminContent);
router.route('/admin/content/:key')
  .put(...canEdit, updateContent)
  .delete(...canEdit, resetContent);

export default router;
