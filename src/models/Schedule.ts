import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

// ✨ FIX: Updated the interface to explicitly use `| null` for nullable fields
// and `?` for fields with database defaults.
interface ScheduleAttributes {
    id: number;
    subjectId: number;
    schoolYearId: number;
    semesterId: number;
    dayOfWeek: string | null;
    startTime: string | null;
    endTime: string | null;
    room: string | null;
    maxStudents: number | null;
    currentEnrolled?: number; // Optional because it has a default value
    isActive?: boolean;      // Optional because it has a default value
}

// When creating a new schedule, `id` is optional.
interface ScheduleCreationAttributes extends Optional<ScheduleAttributes, 'id'> {}

export class Schedule extends Model<ScheduleAttributes, ScheduleCreationAttributes> implements ScheduleAttributes {
    public id!: number;
    public subjectId!: number;
    public schoolYearId!: number;
    public semesterId!: number;
    
    // These types are correct as they match what the database can return (a string or null)
    public dayOfWeek!: string | null;
    public startTime!: string | null;
    public endTime!: string | null;
    public room!: string | null;
    public maxStudents!: number | null;
    
    public currentEnrolled!: number;
    public isActive!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initSchedule = (sequelize: Sequelize) => {
    Schedule.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        subjectId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        schoolYearId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        semesterId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        dayOfWeek: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        room: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        maxStudents: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 50,
        },
        currentEnrolled: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'schedules',
        sequelize: sequelize,
    });
};