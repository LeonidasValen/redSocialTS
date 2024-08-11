import nodemailer from "nodemailer"
import { CORREO_NM, PASS_NM } from "../config";
import { Request, Response } from "express";

export const sendVerificationEmail = async (req:Request, res:Response) => {
    const { email, verificationToken } = req.body;

    //console.log(email, verificationToken)

    //prepara el email de quien va enviar el correo
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: CORREO_NM,
            pass: PASS_NM
        }
    });

    //prepara el correo y al destinatario a enviar
    const mailOptions = {
        from: CORREO_NM,
        to: email,
        subject: 'Verifica tu correo electrónico',
        text: `Por favor verifica tu correo electrónico haciendo clic en el siguiente enlace: http://localhost:5173/verify-email?token=${verificationToken}`
    };

    //envia el correo
    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo de verificación enviado.');
        
        res.status(201).json({ message: 'Usuario registrado correctamente. Correo de verificación enviado. Verifique su correo electronico' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al enviar el correo de verificación" });
    }
};
