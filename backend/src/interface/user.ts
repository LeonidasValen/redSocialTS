import { Request } from "express";
import { RowDataPacket } from "mysql2/promise";

export interface UserIdInterface extends Request {
    user?: {
        userId: number; // Ajusta el tipo según la estructura real de `user`
    };
}

export interface UserResultInterface extends RowDataPacket {
    id: number;
    photo: string;
    email: string;
    password: string;
    username: string;
    rol: string;
}