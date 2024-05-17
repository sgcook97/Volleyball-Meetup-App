import db from '../models';
import { Request, Response, NextFunction } from 'express';

const { User } = db;

const validateUsernameOrEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const existingUser = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email }
            ]
        });
    
        if (existingUser) {
            const field = existingUser.username === req.body.username ? 'username' : 'email';
            res.status(400).send({ message: `Failed! ${field} is already in use!` });
            return;
        }
    
        next();
    } catch (error) {
        console.error('Error checking duplicate username or email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default validateUsernameOrEmail;