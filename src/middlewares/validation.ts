import type { NextFunction, Response, Request } from "express";
import type { Schema } from "joi";

const validation =
    (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
        const result = schema.validate(req.body ?? {});
        if (result.error)
            return res.status(400).send({
                error: result?.error?.details?.map((e: any) => e.message),
            });

        next();
    };
export default validation;
