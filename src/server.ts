import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import db from './models';
import authRouter from './routes/authRoutes';
import postRouter from './routes/postRoutes';
import userRouter from './routes/userRoutes';
import messageRouter from './routes/messageRoutes';
import { createServer } from 'http';
import connectDB from './config/database';
import configureSocket from './config/socket';
import { Server } from 'socket.io';

dotenv.config();

const app: Express = express();

// Server setup
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

// socket.io setup
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

// configure socket. config in config/socket.ts
configureSocket(io);

// connect to db. config in config/database.ts
connectDB();

// routes from routes/*.ts
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/message', messageRouter);


// healthcheck
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('Server is running');
});


// Run server
const PORT: string = process.env.PORT as string;
server.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});