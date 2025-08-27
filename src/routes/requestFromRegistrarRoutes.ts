// src/routes/requestRoutes.ts

import express from 'express';
import { createRequest, getPendingRequests, updateRequestStatus, getRequestsByStudent } from '../controllers/requestFromRegistrarController';
import { authMiddleware, adminMiddleware, accountingMiddleware } from '../middleware/authMiddleware'; // Assuming you create accountingMiddleware

const router = express.Router();

// Route for admin (Registrar) to create a request
router.post('/', authMiddleware, adminMiddleware, createRequest);

// Route for admin (Registrar) to get all requests for one student
router.get('/student/:studentId', authMiddleware, adminMiddleware, getRequestsByStudent);

// Route for accounting to get all requests needing approval
router.get('/pending-approval', authMiddleware, accountingMiddleware, getPendingRequests);

// Route for accounting to update a request's status (approve/reject)
router.patch('/:requestId/status', authMiddleware, accountingMiddleware, updateRequestStatus);

export default router;