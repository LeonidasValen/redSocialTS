import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { JWT_TOKEN } from "../config";

interface Payload{
    [key: string]: any;
}

export function createJWT(payload: Payload): Promise<string>{
    return new Promise((resolve, reject) => {
        const options: SignOptions = {
            expiresIn: '7d'
        };

        jwt.sign(payload, JWT_TOKEN as Secret ,options, (err, token)=>{
            if(err){
                reject(err)
            }else if(token){
                resolve(token)
            }else{
                reject(new Error('Token no generado'))
            }
        })
    })
}