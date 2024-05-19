import express, { Request, Response, Router } from 'express';
import { User } from '../models/user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import verifyToken from '../middlewares/authJwt';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

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

userRouter.post('/change-password', verifyToken, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.body.userId);

        if (!user) {
            return res.status(401).send({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).send({ message: "Password updated" });

    } catch (err : unknown) {
        console.error('Error in change-password route:', err);
        if (err instanceof Error) {
            res.status(500).send({ message: err.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});

userRouter.post('/forgot-password', async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.body.email });
    
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
    
        // Generate a unique JWT token for the user that contains the user's id
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY as string, {expiresIn: "10m",});
    
        // Send the token to the user's email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        }) as JwtPayload;
    
        // Email configuration
        const mailOptions = {
            from: process.env.GMAIL_EMAIL,
            to: req.body.email,
            subject: "Reset Password",
            html: `<h1>Reset Your Password</h1>
            <p>Click on the following link to reset your password:</p>
            <a href="${process.env.BLOCKPARTY_API_URL}/${token}">${process.env.BLOCKPARTY_API_URL}/reset-password/${token}</a>
            <p>The link will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>`,
        };
    
        transporter.sendMail(mailOptions, (err: any, info: any) => {
            if (err) {
                return res.status(500).send({ message: err.message });
            }
            res.status(200).send({ message: "Email sent" });
        });
    } catch (err: unknown) {
        console.error('Error in forgot-password route:', err);
        if (err instanceof Error) {
            res.status(500).send({ message: err.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});

userRouter.post('/reset-password/:token', async (req, res) => {
    try {
        // Verify the token sent by the user
        const decodedToken = jwt.verify(
            req.params.token,
            process.env.JWT_SECRET_KEY as string
        );
  
        // If the token is invalid, return an error
        if (!decodedToken || typeof decodedToken === 'string') {
            return res.status(401).send({ message: "Invalid token" });
        }
        
        // find the user with the id from the token
        const user = await User.findOne({ _id: decodedToken.userId });
        if (!user) {
            return res.status(401).send({ message: "no user found" });
        }
    
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        user.password = hashedPassword;
        await user.save();
  
        res.status(200).send({ message: "Password updated" });

    } catch (err : unknown) {
        console.error('Error in reset-password route:', err);
        if (err instanceof Error) {
            res.status(500).send({ message: err.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});


export default userRouter;