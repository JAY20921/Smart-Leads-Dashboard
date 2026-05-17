import { body } from 'express-validator';
import { LEAD_STATUSES, LEAD_SOURCES } from '../constants';

export const registerValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one digit'),
];

export const loginValidators = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const createLeadValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 120 }).withMessage('Name must be 2–120 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(LEAD_STATUSES).withMessage(`Status must be one of: ${LEAD_STATUSES.join(', ')}`),
  body('source')
    .notEmpty().withMessage('Source is required')
    .isIn(LEAD_SOURCES).withMessage(`Source must be one of: ${LEAD_SOURCES.join(', ')}`),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('Phone cannot exceed 20 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 120 }).withMessage('Company cannot exceed 120 characters'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
];

export const updateLeadValidators = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 }).withMessage('Name must be 2–120 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email address'),
  body('status')
    .optional()
    .isIn(LEAD_STATUSES).withMessage(`Status must be one of: ${LEAD_STATUSES.join(', ')}`),
  body('source')
    .optional()
    .isIn(LEAD_SOURCES).withMessage(`Source must be one of: ${LEAD_SOURCES.join(', ')}`),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('Phone cannot exceed 20 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 120 }).withMessage('Company cannot exceed 120 characters'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
];
