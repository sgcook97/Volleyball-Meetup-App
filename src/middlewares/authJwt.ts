import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
    userId?: string;
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    let token = req.headers["x-access-token"] as string;
    const secret: string = process.env.JWT_SECRET_KEY as string;

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send({ message: "Token has expired" });
            } else {
                console.error(err);
                return res.status(401).send({ message: "Unauthorized!" });
            }
        }
        req.userId = (decoded as { id: string }).id;
        next();
    });
};

export default verifyToken;