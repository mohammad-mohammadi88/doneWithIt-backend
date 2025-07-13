import { RequestHandler } from "express";

import type { User } from "../types/requestHandler.js";
import { jwtTokenHandler } from "../utils/index.js";

const auth: RequestHandler = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token)
        return res
            .status(401)
            .send({ error: "Access denied. No token provided." });

    try {
        const payload: User | any = jwtTokenHandler.decodeToken(token);
        if (typeof payload === "object") req.user = payload;
        next();
    } catch (err) {
        res.status(400).send({ error: "Invalid token." });
    }
};

export default auth;
