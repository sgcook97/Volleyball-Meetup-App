const dotenv = require('dotenv').config();
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import db from './models';
import authRouter from './routes/authRoutes';
import postRouter from './routes/postRoutes';
import userRouter from './routes/userRoutes';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

// connect to db
const MONGODB_URI: string = process.env.MONGODB_URI as string;
db.mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

// routes
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);


// healthcheck
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('Server is running');
});


// Run server
const PORT: string = process.env.PORT as string;
app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});