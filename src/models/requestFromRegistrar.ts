// src/models/Request.ts

import { Model, DataTypes, Sequelize } from 'sequelize';
import { Student } from './Student'; // Import Student to establish the relationship

export class requestFromRegistrar extends Model {
    public id!: number;
    public studentId!: number;
    public documentType!: string;
    public schoolYear!: string | null;
    public semester!: string | null;
    public amount!: number;
    public status!: 'pending_approval' | 'approved' | 'rejected' | 'ready_for_pickup' | 'completed' | 'cancelled';

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initRequestFromRegistrar = (sequelize: Sequelize) => {
    requestFromRegistrar.init({
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
            type: DataTypes.STRING,
            allowNull: false,
        },
        schoolYear: {
            type: DataTypes.STRING,
            allowNull: true, // Some requests may not be specific to a school year
        },
        semester: {
            type: DataTypes.STRING,
            allowNull: true, // Some requests may not be specific to a semester
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        status: {
            // ENUM restricts the status to only these specific values
            type: DataTypes.ENUM('pending_approval', 'approved', 'rejected', 'ready_for_pickup', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending_approval',
        },
    }, {
        tableName: 'requestFromRegistrar',
        sequelize: sequelize,
    });
};

// This function defines the relationship between Request and Student
export const associateRequest = () => {
    // A Student can have many Requests
    Student.hasMany(requestFromRegistrar, {
        foreignKey: 'studentId',
        as: 'requests'
    });
    // A Request belongs to one Student
    requestFromRegistrar.belongsTo(Student, {
        foreignKey: 'studentId',
        as: 'student'
    });
};