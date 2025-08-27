// src/models/SubmittedRequirement.ts

import { Model, DataTypes, Sequelize } from 'sequelize';
import { Student } from './Student';

// Define the types of documents that are required.
export const RequiredDocumentTypes = [
    'NSO_BIRTH_CERTIFICATE',
    'FORM_137',
    '2X2_PICTURE'
];

export class SubmittedRequirement extends Model {
    public id!: number;
    public studentId!: number;
    public documentType!: 'NSO_BIRTH_CERTIFICATE' | 'FORM_137' | '2X2_PICTURE';
    public filePath!: string;
    public status!: 'submitted' | 'approved' | 'rejected';
    public notes!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initSubmittedRequirement = (sequelize: Sequelize) => {
    SubmittedRequirement.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        documentType: {
            type: DataTypes.ENUM(...RequiredDocumentTypes),
            allowNull: false,
        },
        filePath: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('submitted', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'submitted',
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'submitted_requirements',
        sequelize: sequelize,
        // Ensure a student can only submit each document type once
        indexes: [{ unique: true, fields: ['studentId', 'documentType'] }]
    });
};

export const associateSubmittedRequirement = () => {
    Student.hasMany(SubmittedRequirement, {
        foreignKey: 'studentId',
        as: 'submittedRequirements'
    });
    SubmittedRequirement.belongsTo(Student, {
        foreignKey: 'studentId',
        as: 'student'
    });
};