import express, { Request, Response, Router } from 'express';
import { User } from '../models/user';
import verifyToken from '../middlewares/authJwt';

const userRouter: Router = express.Router();

userRouter.get('/:id', verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({
            username: user.username,
            email: user.email,
            skillLevel: user.skillLevel,
            favoritePlaces: user.favoritePlaces,
        });
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

userRouter.put('/:id/skill-level', verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const { skillLevel } = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, { skillLevel }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Error updating skill level:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default userRouter;