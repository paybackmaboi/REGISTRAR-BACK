import { Request, Response, NextFunction } from 'express';
import { Semester } from '../database';

export const getAllSemesters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const semesters = await Semester.findAll({
            where: { isActive: true },
            order: [['id', 'ASC']] 
        });
        res.json(semesters);
    } catch (error) {
        console.error("Error fetching semesters:", error);
        next(error);
    }
};