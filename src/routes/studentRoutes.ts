// src/routes/studentRoutes.ts

import express from 'express';
import {
    createAndEnrollStudent,
    getRegistrationStatus,
    getAllStudents,
    getStudentDetails, // This is the function for the route we need to fix
    updateStudent,
    deleteStudent,
    registerStudent,
    debugStudentRegistration,
    getStudentEnrollments,
} from '../controllers/studentController';

import { authMiddleware, adminMiddleware, adminOrAccountingMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Student registration
router.post('/register', registerStudent);

// Debug endpoint
router.get('/debug', authMiddleware, debugStudentRegistration);

// Admin & Accounting routes for student management
router.get('/', authMiddleware, adminOrAccountingMiddleware, getAllStudents);

// ✅ --- START: THE FINAL FIX --- ✅
// This route gets the main details for a single student.
// It needs to be accessible by both Admin and Accounting roles.
router.get('/:id', authMiddleware, adminOrAccountingMiddleware, getStudentDetails);
// ✅ --- END: THE FINAL FIX --- ✅


// These routes can remain admin-only unless you want Accounting to also perform these actions.
router.get('/:studentId/enrollments', authMiddleware, adminMiddleware, getStudentEnrollments);
router.put('/:id', authMiddleware, adminMiddleware, updateStudent);
router.delete('/:id', authMiddleware, adminMiddleware, deleteStudent);
router.post('/create-and-enroll', authMiddleware, adminMiddleware, createAndEnrollStudent);

export default router;