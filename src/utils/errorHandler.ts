import type { Response } from "express";

const errorHandler = <T>(
    value: any,
    res: Response,
    errorMessage?: string
): T => {
    if (value === false){
        res.status(500).json({
            error: "There is a problem with database connection!",
        })
        throw new Error("There is a problem with database connection!")
    }
    if (errorMessage && value === null) {
        res.status(404).json({
            error: `There is no ${errorMessage} in database!`,
        });
        throw new Error(`There is no ${errorMessage} in database!`);
    }
    return value;
};
export default errorHandler;
