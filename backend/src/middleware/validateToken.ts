import jwt, { JwtPayload, Secret, VerifyErrors } from "jsonwebtoken";
import { JWT_TOKEN } from "../config";
import { NextFunction, Request, Response } from "express";

// Extender el objeto Request para incluir la propiedad user
interface CustomRequest extends Request {
    user?: string | JwtPayload; // asegura que se tipean las propiedades
}

interface CustomRequestUser extends Request {
    user?: JwtPayload & { userId: number }; // asegura que `user` tenga `userId` como número
}

// Extender el objeto Request para incluir la propiedad user
interface CustomRequestPost extends Request {
    user?: JwtPayload | null; // El tipo de `user` puede ser JwtPayload o null
}


export const validateToken = (req: CustomRequest, res: Response, next: NextFunction): Response | void => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "No estás autenticado" });

    jwt.verify(token, JWT_TOKEN as Secret, (err: VerifyErrors | null, user: JwtPayload | string | undefined) => {
        if (err) return res.status(403).json({ message: "Token inválido" });

        req.user = user as JwtPayload;

        next();
    });
};

export const verifyUser = (req: CustomRequestUser, res: Response, next: NextFunction): Response | void => {
    validateToken(req, res, ()=>{
        const userIdFromParams = parseInt(req.params.id);
        if(req.user?.userId === userIdFromParams){
            next();
        }else{
            return res.status(403).json({message: "No estás autorizado"})
        }
    })
};

export const validatePost = (req: CustomRequestPost, res: Response, next: NextFunction): Response | void => {
    const token = req.cookies.token;

    if (!token){
        req.user = null
        return next()
    }

    jwt.verify(token, JWT_TOKEN as Secret, (err: VerifyErrors | null, user: JwtPayload | string | undefined) => {
        if (err) return res.status(403).json({ message: "Token inválido" });

        req.user = user as JwtPayload;

        next();
    });
};
