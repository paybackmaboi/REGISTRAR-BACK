// src/controllers/requestController.ts

import { Request, Response, NextFunction } from 'express';
import { Request as RequestModel, User, Student } from '../database';

// For Admins/Registrar to create a new request
export const createRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { studentId, documentType, schoolYear, semester, amount } = req.body;
        
        const newRequest = await RequestModel.create({
            studentId,
            documentType,
            schoolYear,
            semester,
            amount,
            status: 'pending_approval' // Initial status for accounting
        });
        
        res.status(201).json(newRequest);
    } catch (error) {
        console.error("Error creating request:", error);
        next(error);
    }
};

// For Accounting to view all pending requests
export const getPendingRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const requests = await RequestModel.findAll({
            where: { status: 'pending_approval' },
            include: [{
                model: Student,
                as: 'student',
                include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'idNumber'] }]
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(requests);
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        next(error);
    }
};

// For Accounting to approve or reject a request
export const updateRequestStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { requestId } = req.params;
        const { status } = req.body; // Expecting 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            res.status(400).json({ message: 'Invalid status provided.' });
            return;
        }

        const request = await RequestModel.findByPk(requestId);
        if (!request) {
            res.status(404).json({ message: 'Request not found.' });
            return;
        }

        request.status = status;
        await request.save();

        res.json(request);
    } catch (error) {
        console.error("Error updating request status:", error);
        next(error);
    }
};

// For Admins/Registrar to view all requests for a specific student
export const getRequestsByStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { studentId } = req.params;
        const requests = await RequestModel.findAll({
            where: { studentId },
            order: [['createdAt', 'DESC']]
        });
        res.json(requests);
    } catch (error) {
        console.error("Error fetching requests for student:", error);
        next(error);
    }
};