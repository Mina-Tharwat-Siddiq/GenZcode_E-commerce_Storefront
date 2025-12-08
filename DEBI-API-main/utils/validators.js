import { body } from 'express-validator';

export const registerValidator = [
  body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 chars'),
  body('email').isEmail().withMessage('Provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Provide a valid email'),
  body('password').exists().withMessage('Password required'),
];
