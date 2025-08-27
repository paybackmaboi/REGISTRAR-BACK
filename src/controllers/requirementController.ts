// src/controllers/requirementController.ts

import { Request, Response, NextFunction } from 'express';
import { Student, User, SubmittedRequirement, sequelize } from '../database';
import { RequiredDocumentTypes } from '../models/SubmittedRequirement';

// For a logged-in student to get their own requirement status
export const getMyRequirements = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const student = await Student.findOne({ where: { userId: req.user.id } });
        if (!student) {
            res.status(404).json({ message: 'Student profile not found.' });
            return;
        }

        const submitted = await SubmittedRequirement.findAll({ where: { studentId: student.id } });
        
        // Create a map of submitted documents for easy lookup
        const submittedMap = new Map(submitted.map(doc => [doc.documentType, doc]));

        // Return the status for all required document types
        const requirementsStatus = RequiredDocumentTypes.map(docType => {
            const submission = submittedMap.get(docType);
            return {
                documentType: docType,
                isSubmitted: !!submission,
                status: submission ? submission.status : 'lacking',
                filePath: submission ? submission.filePath : null,
                notes: submission ? submission.notes : null,
            };
        });

        res.json(requirementsStatus);
    } catch (error) {
        next(error);
    }
};

// For a student to upload a requirement
export const uploadRequirement = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { documentType } = req.body;
        
        if (!req.file) {
            res.status(400).json({ message: 'File is required.' });
            return;
        }
        if (!RequiredDocumentTypes.includes(documentType)) {
            res.status(400).json({ message: 'Invalid document type.' });
            return;
        }

        const student = await Student.findOne({ where: { userId: req.user.id } });
        if (!student) {
            res.status(404).json({ message: 'Student profile not found.' });
            return;
        }

        // Use upsert: create new submission or update existing one (e.g., re-uploading)
        await SubmittedRequirement.upsert({
            studentId: student.id,
            documentType: documentType,
            filePath: req.file.filename, // Assumes file upload middleware saves filename
            status: 'submitted',
        });

        res.status(200).json({ message: `${documentType} uploaded successfully.` });
    } catch (error) {
        // Handle unique constraint violation (student already submitted this doc type)
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).json({ message: `You have already submitted a ${req.body.documentType}.` });
            return;
        }
        next(error);
    }
};

// For the Registrar to find students with lacking requirements
export const getLackingRequirements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { filterBy } = req.query; // e.g., ?filterBy=FORM_137

        if (filterBy && !RequiredDocumentTypes.includes(filterBy as string)) {
            res.status(400).json({ message: 'Invalid filter document type.' });
            return;
        }

        // Find IDs of all students who HAVE submitted the specific document
        const studentsWithDocument = await SubmittedRequirement.findAll({
            where: filterBy ? { documentType: filterBy } : {},
            attributes: ['studentId'],
            group: ['studentId']
        });
        const studentIdsWithDoc = studentsWithDocument.map(s => s.studentId);

        // Now find all students who are NOT in that list
        const { Op } = require('sequelize');
        const studentsLacking = await Student.findAll({
            where: {
                id: { [Op.notIn]: studentIdsWithDoc }
            },
            include: [{ model: User, as: 'user', attributes: ['idNumber', 'firstName', 'lastName'] }]
        });
        
        res.json(studentsLacking);
    } catch (error) {
        next(error);
    }
};

export const getRequirementsForStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { studentId } = req.params;
        
        const student = await Student.findByPk(studentId);
        if (!student) {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }

        const submitted = await SubmittedRequirement.findAll({ where: { studentId: student.id } });
        const submittedMap = new Map(submitted.map(doc => [doc.documentType, doc]));

        const requirementsStatus = RequiredDocumentTypes.map(docType => {
            const submission = submittedMap.get(docType);
            return {
                id: submission ? submission.id : null, // Include the submission ID for updates
                documentType: docType,
                isSubmitted: !!submission,
                status: submission ? submission.status : 'lacking',
                filePath: submission ? submission.filePath : null,
                notes: submission ? submission.notes : null,
            };
        });

        res.json(requirementsStatus);
    } catch (error) {
        next(error);
    }
};

// ✅ ADD THIS NEW FUNCTION (For the registrar to approve/reject a submission)
export const updateRequirementStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { requirementId } = req.params;
        const { status, notes } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            res.status(400).json({ message: 'Invalid status provided.' });
            return;
        }

        const requirement = await SubmittedRequirement.findByPk(requirementId);
        if (!requirement) {
            res.status(404).json({ message: 'Requirement submission not found.' });
            return;
        }

        requirement.status = status;
        if (notes) {
            requirement.notes = notes;
        }
        await requirement.save();

        res.json({ message: 'Requirement status updated successfully.' });
    } catch (error) {
        next(error);
    }
};