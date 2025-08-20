import { Request, Response, NextFunction } from 'express';
import { Subject, Course } from '../database';

interface ExpressRequest extends Request {
    user?: {
        id: number;
        role: 'student' | 'admin' | 'accounting';
    };
}

export const getAllSubjects = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const subjects = await Subject.findAll({
            include: [
                {
                    model: Course,
                    as: 'course'
                }
            ],
            where: { isActive: true }
        });
        res.json(subjects);
    } catch (error) {
        next(error);
    }
};

export const getSubjectById = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const subject = await Subject.findByPk(id, {
            include: [
                {
                    model: Course,
                    as: 'course'
                }
            ]
        });

        if (!subject) {
            res.status(404).json({ message: 'Subject not found.' });
            return;
        }

        res.json(subject);
    } catch (error) {
        next(error);
    }
};

export const getSubjectsByCourse = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { course } = req.params;
        
        const subjects = await Subject.findAll({
            include: [
                {
                    model: Course,
                    as: 'course',
                    where: { code: course }
                }
            ],
            where: { isActive: true }
        });

        res.json(subjects);
    } catch (error) {
        next(error);
    }
};

export const createSubject = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {
            code,
            description,
            units,
            courseId,
            yearLevel,
            semester,
        } = req.body;

        if (!code || !description || !units || !courseId || !yearLevel || !semester) {
            res.status(400).json({ message: 'Missing required fields.' });
            return;
        }

        const subject = await Subject.create({
            code,
            description,
            units,
            courseId,
            yearLevel,
            semester,
            isActive: true
        });

        res.status(201).json(subject);
    } catch (error) {
        next(error);
    }
};

export const updateSubject = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const subject = await Subject.findByPk(id);
        if (!subject) {
            res.status(404).json({ message: 'Subject not found.' });
            return;
        }

        await subject.update(updateData);
        res.json(subject);
    } catch (error) {
        next(error);
    }
};

export const deleteSubject = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const subject = await Subject.findByPk(id);
        if (!subject) {
            res.status(404).json({ message: 'Subject not found.' });
            return;
        }

        await subject.update({ isActive: false });
        res.json({ message: 'Subject deleted successfully.' });
    } catch (error) {
        next(error);
    }
}; 

export const getSubjectsByFilter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { courseId, yearLevel, semester } = req.query;

        if (!courseId || !yearLevel || !semester) {
            res.status(400).json({ message: 'courseId, yearLevel, and semester are required query parameters.' });
            return;
        }

        const subjects = await Subject.findAll({
            where: {
                courseId: parseInt(courseId as string, 10),
                yearLevel: parseInt(yearLevel as string, 10),
                semester: parseInt(semester as string, 10),
            },
            order: [['code', 'ASC']],
        });

        res.json(subjects);
    } catch (error) {
        console.error("Error fetching subjects by filter:", error);
        next(error);
    }
};