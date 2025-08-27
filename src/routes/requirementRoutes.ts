// src/routes/requirementRoutes.ts

import express from 'express';
import { getMyRequirements, uploadRequirement, getLackingRequirements, getRequirementsForStudent, updateRequirementStatus } from '../controllers/requirementController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';
import upload from '../middleware/fileUpload';

const router = express.Router();

// --- Student Routes ---
router.get('/my-requirements', authMiddleware, getMyRequirements);
router.post('/upload', authMiddleware, upload.single('document'), uploadRequirement);

// --- Admin (Registrar) Routes ---
router.get('/lacking', authMiddleware, adminMiddleware, getLackingRequirements);

// ✅ ADD THIS ROUTE (To get a specific student's requirements)
router.get('/student/:studentId', authMiddleware, adminMiddleware, getRequirementsForStudent);

// ✅ ADD THIS ROUTE (To approve/reject a submission)
router.patch('/:requirementId/status', authMiddleware, adminMiddleware, updateRequirementStatus);

export default router;