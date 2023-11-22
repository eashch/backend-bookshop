import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TRatingCreate, TYPES } from "../interfaces";
import { RatingRepository } from "../repositories/RatingRepository";
import { Rating } from "@prisma/client";
import { UserService } from "./UserService";

@injectable()
export class RatingService {

    constructor(@inject(TYPES.RatingRepository) private ratingRepository: RatingRepository,
        @inject(TYPES.UserService) private userService: UserService
    ) {
    }

    public async addRating(newRatingData: TRatingCreate, 
            loginOrEmail: string, password: string) {
        await this.userService.loginUser(loginOrEmail, password);
                
        return await this.ratingRepository.create(newRatingData);
    }
}
