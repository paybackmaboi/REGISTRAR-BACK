// src/controllers/accountingController.ts

import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Accounting, User } from '../database';

// Extend Express Request type for clarity
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                role: 'student' | 'admin' | 'accounting';
            };
        }
    }
}

// This function is for STUDENTS to get their OWN balance. It is correct.
export const getStudentBalance = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const studentId = req.user?.id;
        const userRole = req.user?.role;

        if (!studentId || userRole !== 'student') {
            res.status(401).json({ message: 'Unauthorized: Student access only.' });
            return;
        }

        const accountingRecord = await Accounting.findOne({ where: { studentId } });

        if (!accountingRecord) {
            res.json({ balance: 0.00 });
            return;
        }

        res.json({ balance: accountingRecord.balance });
    } catch (error) {
        next(error);
    }
};

// ✅ --- START: MODIFIED FUNCTION --- ✅
// This is for admins/accounting to get a student's balance.
export const getBalanceByStudentId = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // FIX: Use 'userId' to match the parameter in accountingRoutes.ts
        const { userId } = req.params; 
        
        const student = await User.findByPk(userId);
        if (!student || student.role !== 'student') {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }

        // FIX: Use the correct variable here as well
        const accountingRecord = await Accounting.findOne({ where: { studentId: parseInt(userId, 10) } });

        if (!accountingRecord) {
            res.json({ balance: 0.00 });
            return;
        }

        res.json({ balance: accountingRecord.balance });
    } catch (error) {
        next(error);
    }
};
// ✅ --- END: MODIFIED FUNCTION --- ✅


// ✅ --- START: MODIFIED FUNCTION --- ✅
// For admins/accounting to update a student's balance
export const updateStudentBalance = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // FIX: Use 'userId' to match the parameter in accountingRoutes.ts
        const { userId } = req.params;
        const { balance } = req.body;

        if (balance === undefined || isNaN(parseFloat(balance))) {
            res.status(400).json({ message: 'A valid balance is required.' });
            return;
        }

        const student = await User.findByPk(userId);
        if (!student || student.role !== 'student') {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }

        // Use upsert to create or update the record
        // FIX: Use the correct variable here as well
        await Accounting.upsert({
            studentId: parseInt(userId, 10),
            balance: parseFloat(balance),
        });

        res.json({ message: 'Student balance updated successfully.' });

    } catch (error) {
        next(error);
    }
};
// ✅ --- END: MODIFIED FUNCTION --- ✅