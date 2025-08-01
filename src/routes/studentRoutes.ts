import express from 'express';
import { createAndEnrollStudent } from '../controllers/studentController';
// FIX: Import the functions with their correct exported names
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Route for admin to create a new student account
// FIX: Use the correctly named functions in the route definition
router.post('/create-and-enroll', authMiddleware, adminMiddleware, createAndEnrollStudent);

export default router;