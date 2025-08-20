import express from 'express';
import { 
    getAllSubjects, 
    getSubjectById, 
    createSubject, 
    updateSubject, 
    deleteSubject,
    getSubjectsByCourse,
    getSubjectsByFilter
} from '../controllers/subjectController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Get all subjects
router.get('/', authMiddleware, getAllSubjects);

// Get subjects by course
router.get('/course/:course', getSubjectsByCourse);

// ✨ FIX: The specific '/filter' route must come BEFORE the dynamic '/:id' route.
router.get('/filter', getSubjectsByFilter);

// Get specific subject by ID
router.get('/:id', getSubjectById);

// Create new subject (admin only)
router.post('/', authMiddleware, adminMiddleware, createSubject);

// Update subject (admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateSubject);

// Delete subject (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteSubject);

export default router;