import { Request, Response , NextFunction } from 'express';
import { jwtVerify } from 'jose';
import User from '../models/User';

// Set secret 
const secret = new TextEncoder().encode('my_jwt_secret');

// Define the payload 
interface JwtPayload {
    id: string ;
    role: string; 
}

// Auth Function for route protection 
export const authJose = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access denied');
    }

    try {
        const { payload } = await jwtVerify(token, secret) as unknown as { payload: JwtPayload };

        // Fetch the user from the database
        const user = await User.findById(payload.id);
        if (!user) {
            return res.status(401).send('User not found');
        }

        // Attach user to request object
        req.user = {
            id: user.id,
            role: user.role,
        };

        next();
    } catch (err) {
        res.status(400).send('Invalid token from jose');
    }
};

// Auth function for user/admin roles
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).send('Access denied');
        }
        next();
    };
};