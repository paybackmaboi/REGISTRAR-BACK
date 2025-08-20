import express from 'express';
import { getAllSchoolYears, getCombinedSchoolYearSemesters } from '../controllers/schoolYearController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Define the route to get all school years
// It's a public route, so no authMiddleware is needed, allowing the registration form to access it.
router.get('/', getAllSchoolYears);
router.get('/combined', getCombinedSchoolYearSemesters);
export default router;