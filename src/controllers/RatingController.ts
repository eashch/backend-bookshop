import "reflect-metadata";
import { ITokenInfo, TRatingCreate, TYPES } from "../interfaces";
import { Controller } from "./Controller";
import { inject, injectable } from 'inversify';
import { RatingService } from "../services/RatingService";
import { Request, Response, NextFunction } from "express";
import { throwServerError } from "../utils";
import { body } from "express-validator";
import { AuthMiddleware } from "../MIddleware";

@injectable()
export class RatingController extends Controller {
    _authMiddleware: AuthMiddleware;

    constructor(@inject(TYPES.RatingService) private ratingService: RatingService) {
        super();
        this._authMiddleware = new AuthMiddleware();
        this._router.post(
            '/rating', 
            body("rating").exists().isNumeric(),
            body("bookId").exists().isNumeric(), 
            body("userId").exists().isNumeric(), 
            this._authMiddleware.handle.bind(this),
            this.addRating.bind(this));
    }

    async addRating(req: Request<{jwtPayload: ITokenInfo}, {}, TRatingCreate>, res: Response, next: NextFunction) {        
        try {
            await this.ratingService.addRating(req.body, 
                req.params.jwtPayload.loginOrEmail, 
                req.params.jwtPayload.password);
            res.status(201);
            res.send(`Rating added`);
        } catch (e) {
            throwServerError(res, e);
        }
    }
}


