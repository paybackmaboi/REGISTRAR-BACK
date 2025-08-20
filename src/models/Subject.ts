import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

// ✨ FIX: Removed subjectType from the interface
interface SubjectAttributes {
    id: number;
    code: string;
    description?: string;
    units: number;
    courseId: number;
    yearLevel: number;
    semester: number;
    isActive?: boolean;
}

interface SubjectCreationAttributes extends Optional<SubjectAttributes, 'id'> {}

export class Subject extends Model<SubjectAttributes, SubjectCreationAttributes> implements SubjectAttributes {
    public id!: number;
    public code!: string;
    public description!: string;
    public units!: number;
    public courseId!: number;
    public yearLevel!: number;
    public semester!: number;
    public isActive!: boolean; // subjectType was removed here

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initSubject = (sequelize: Sequelize) => {
    Subject.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        units: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        courseId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        yearLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        semester: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // ✨ FIX: The subjectType field definition has been completely removed
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'subjects',
        sequelize: sequelize,
    });
};