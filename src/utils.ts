import { Request, Response } from "express";
import { validationResult } from "express-validator";

export const throwServerError = (res: Response, e: Error) => {
    console.debug(e.message);
    res.status(500);
    res.send("Server error");
}

export const validationWrapper = (
    req: Request, 
    res: Response, 
    onValidationPass: (req: Request, res: Response) => void
) => {
    const validResult = validationResult(req);

    if (!validResult.isEmpty()) {
        res.status(400);
        res.send({ errors: validResult.array() });
        return;
    }
    
    try {
        onValidationPass(req, res);
    } catch (e) {
        throwServerError(res, e as Error);
    }
}

export const validationWrapperWithID = (
    req: Request<{ id: number }>, 
    res: Response, 
    onValidationPass: (req: Request<{ id: number }>, res: Response) => void
) => {
    const validResult = validationResult(req);

    if (!validResult.isEmpty()) {
        res.status(400);
        res.send({ errors: validResult.array() });
        return;
    }
    
    try {
        onValidationPass(req, res);
    } catch (e) {
        throwServerError(res, e as Error);
    }
}