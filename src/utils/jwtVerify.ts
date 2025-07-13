import jwt from "jsonwebtoken";

const jwtPrivate = process.env.JWT_PRIVATE;

const decodeToken = (token: string): any =>
    jwt.verify(token, JSON.stringify(jwtPrivate));

const generateToken = (data: any, expiresIn: any = "2d") =>
    jwt.sign(data, JSON.stringify(jwtPrivate), {
        expiresIn,
    });

const jwtTokenHandler = {
    decodeToken,
    generateToken,
};
export default jwtTokenHandler;
