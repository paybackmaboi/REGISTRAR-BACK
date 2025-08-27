import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './User'; // Import User to establish association

export class Accounting extends Model {
    public id!: number;
    public studentId!: number;
    public balance!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initAccounting = (sequelize: Sequelize) => {
    Accounting.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            unique: true, // Each student has only one accounting record
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2), // Suitable for currency
            allowNull: false,
            defaultValue: 0.00,
        },
    }, {
        tableName: 'accounting',
        sequelize: sequelize,
    });
};

// Define the association between User and Accounting
export const associateAccounting = () => {
    // A user (student) has one accounting record
    User.hasOne(Accounting, {
        foreignKey: 'studentId',
        as: 'accounting'
    });
    // An accounting record belongs to one user (student)
    Accounting.belongsTo(User, {
        foreignKey: 'studentId',
        as: 'student'
    });
};