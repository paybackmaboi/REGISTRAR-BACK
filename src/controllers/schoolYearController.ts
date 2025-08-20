import { Request, Response, NextFunction } from 'express';
import { SchoolYear, Semester } from '../database'; 

/**
 * Fetches all active school years from the database.
 */
export const getAllSchoolYears = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const schoolYears = await SchoolYear.findAll({
            where: { isActive: true },
            // Order by the 'year' field in descending order to show the most recent year first
            order: [['year', 'DESC']] 
        });

        res.json(schoolYears);
    } catch (error) {
        console.error("Error fetching school years:", error);
        next(error); // Pass the error to your error handling middleware
    }
};

export const getCombinedSchoolYearSemesters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const schoolYears = await SchoolYear.findAll({
            where: { isActive: true },
            order: [['year', 'DESC']]
        });

        const semesters = await Semester.findAll({
            where: { isActive: true },
            order: [['id', 'ASC']]
        });

        // Create a combined list
        const combinedList = schoolYears.flatMap(sy => 
            semesters.map(sem => ({
                // Create a unique composite ID like "1-1" (schoolYearId-semesterId)
                id: `${sy.id}-${sem.id}`, 
                displayText: `SY ${sy.year} - ${sem.name}`
            }))
        );

        res.json(combinedList);
    } catch (error) {
        console.error("Error fetching combined school years and semesters:", error);
        next(error);
    }
};