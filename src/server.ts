const dotenv = require('dotenv').config();
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './routes/authRoutes';



const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGODB_URI: string = process.env.MONGODB_URI as string;

(async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to the database');
    } catch(error) {
        console.error(error);
    }
})();

// routes
app.use('/auth', authRouter);


// healthcheck
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('Server is running');
});

const PORT: string = process.env.PORT as string;

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});