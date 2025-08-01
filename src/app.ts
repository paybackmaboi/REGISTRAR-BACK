import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { sequelize, connectAndInitialize } from './database';
import authRoutes from './routes/authRoutes';
import requestRoutes from './routes/requestRoutes';
import studentRoutes from './routes/studentRoutes'; 
import accountRoutes from './routes/accountRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.set('json spaces', 2);
// --- Global Middleware ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the project's root 'uploads' directory
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));


// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/accounts', accountRoutes);

// --- Error Handling Middleware ---
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error("An error occurred:", err.message);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ message: err.message || 'An internal server error occurred.' });
};

app.use(errorHandler);


const startServer = async () => {
    try {
        await connectAndInitialize();
        await sequelize.sync({ alter: true }); 
        console.log('All models were synchronized successfully.');

        const { User } = require('./database');
        
        // --- START OF FIX ---
        // Seeding dummy accounts if they don't exist, now with names
        await User.findOrCreate({
            where: { idNumber: 'S001' },
            defaults: { 
                idNumber: 'S001', 
                password: 'password', 
                role: 'student',
                firstName: 'Juan',
                lastName: 'Dela Cruz'
            }
        });
        console.log('Dummy student S001 created or already exists.');

        await User.findOrCreate({
            where: { idNumber: 'A001' },
            defaults: { 
                idNumber: 'A001', 
                password: 'adminpass', 
                role: 'admin',
                firstName: 'Admin',
                lastName: 'User'
            }
        });
        console.log('Dummy admin A001 created or exists.');

        await User.findOrCreate({
            where: { idNumber: 'AC001' },
            defaults: { 
                idNumber: 'AC001', 
                password: 'accountingpass', 
                role: 'accounting',
                firstName: 'Accounting',
                lastName: 'User'
            }
        });
        console.log('Dummy accounting AC001 created or exists.');
        // --- END OF FIX ---

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error('Unable to start the server:', err);
        process.exit(1);
    }
};

startServer();

export default app;