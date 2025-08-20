import express from 'express';
import { getAllSemesters } from '../controllers/semesterController';

const router = express.Router();

router.get('/', getAllSemesters);

export default router;