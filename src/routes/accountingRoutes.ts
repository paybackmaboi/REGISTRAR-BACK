// In src/routes/accountingRoutes.ts

import express from 'express';
// 1. Make sure 'getBalanceByStudentId' is imported
import { getBalanceByStudentId, updateStudentBalance, getStudentBalance } from '../controllers/accountingController';
import { authMiddleware, adminOrAccountingMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/my-balance', authMiddleware, getStudentBalance);

// 2. Point the route to the correct controller function
router.get('/student/:userId', authMiddleware, adminOrAccountingMiddleware, getBalanceByStudentId);
router.patch('/student/:userId', authMiddleware, adminOrAccountingMiddleware, updateStudentBalance);

export default router;