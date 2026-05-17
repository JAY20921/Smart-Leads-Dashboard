import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCsv,
} from '../controllers/leadController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createLeadValidators, updateLeadValidators } from '../validators';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

router.get('/', getLeads);
router.get('/export/csv', exportLeadsCsv);
router.get('/:id', getLeadById);

// Create: both Admin and SalesUser can create
router.post('/', createLeadValidators, validate, createLead);

// Update: both Admin and SalesUser can update
router.put('/:id', updateLeadValidators, validate, updateLead);
router.patch('/:id', updateLeadValidators, validate, updateLead);

// Delete: Admin only
router.delete('/:id', authorize('Admin'), deleteLead);

export default router;
