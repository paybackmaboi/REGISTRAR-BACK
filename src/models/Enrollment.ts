import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

// ✨ FIX: Made 'status' and 'enrollmentDate' optional with '?'
// This aligns with the database having default values for them.
interface EnrollmentAttributes {
    id: number;
    studentId: number;
    scheduleId: number;
    status?: 'enrolled' | 'assessed' | 'dropped';
    enrollmentDate?: Date;
}

// ✨ FIX: Added 'status' and 'enrollmentDate' to the optional fields for creation.
interface EnrollmentCreationAttributes extends Optional<EnrollmentAttributes, 'id' | 'status' | 'enrollmentDate'> {}

export class Enrollment extends Model<EnrollmentAttributes, EnrollmentCreationAttributes> implements EnrollmentAttributes {
    public id!: number;
    public studentId!: number;
    public scheduleId!: number;
    public status!: 'enrolled' | 'assessed' | 'dropped';
    public enrollmentDate!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initEnrollment = (sequelize: Sequelize) => {
    Enrollment.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        scheduleId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('enrolled', 'assessed', 'dropped'),
            defaultValue: 'enrolled', // This default is used if not provided
            allowNull: false,
        },
        enrollmentDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, // This default is used if not provided
        },
    }, {
        tableName: 'enrollments',
        sequelize: sequelize,
    });
};