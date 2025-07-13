import { User } from "@prisma/client";
import Joi from "joi";

import type { MyRequestHandler } from "../types/requestHandler.js";
import { validationSchema } from "../middlewares/index.js";
import { minPasswordLength } from "../config/defaults.js";
import { usersStore } from "../db/index.js";
import {
    errorHandler,
    generatePassword,
    jwtTokenHandler,
} from "../utils/index.js";

// login user
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(minPasswordLength),
});
export interface LoginUser {
    email: string;
    password: string;
}
const loginCTRL: MyRequestHandler<never, string, LoginUser> = async (
    req,
    res
) => {
    const { email, password } = req.body;

    const value = await usersStore.getUserWithEmailOrId({ email });
    const {
        id: userId,
        name,
        password: hashedPassword,
    } = errorHandler<User>(value, res, "user with this email");

    if (!(await generatePassword.isPasswordValid(password, hashedPassword)))
        return res.status(401).json({ error: "Invalid password!" });

    const token = jwtTokenHandler.generateToken({
        email,
        name,
        userId,
    });
    res.send(token);
};
export const loginHandler = [validationSchema(loginSchema), loginCTRL];

// register user
const registerSchema = Joi.object({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2),
    password: Joi.string().required().min(minPasswordLength),
});
export interface RegisterUser {
    email: string;
    password: string;
    name: string;
}
const registerCTRL: MyRequestHandler<never, string, RegisterUser> = async (
    req,
    res
) => {
    const { email, name, password } = req.body;
    const value = await usersStore.getUserWithEmailOrId({ email });
    const result = errorHandler<User | null>(value, res);
    if (result)
        return res
            .status(400)
            .json({ error: "There is a user with this email" });

    const hashedPassword = await generatePassword.handPassword(password);

    const response = await usersStore.registerUser({
        email,
        name,
        password: hashedPassword,
    });
    const { id: userId } = errorHandler<User>(response, res);

    const token = jwtTokenHandler.generateToken({
        userId,
        name,
        email,
    });
    res.status(201).send(token);
};
export const registerHandler = [validationSchema(registerSchema), registerCTRL];
