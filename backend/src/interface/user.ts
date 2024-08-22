import { Request } from "express";
import { RowDataPacket } from "mysql2/promise";

export interface UserIdInterface extends Request {
    user?: {
        userId: number; // Ajusta el tipo según la estructura real de `user`
    };
}

export interface UserIsExisting extends RowDataPacket {
    id: number;
    photo: string | null;
    username: string;
    email: string;
    rol: string;
    f_creation: Date;
}

export interface UserResultInterface extends RowDataPacket {
    id: number;
    photo: string;
    username: string;
    email: string;
    rol: string;
    password: string;
}