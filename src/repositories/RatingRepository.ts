import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TRatingCreate, TYPES } from "../interfaces";
import { DBService } from "./DBService";
import { Rating } from "@prisma/client";

@injectable()
export class RatingRepository {
    constructor(@inject(TYPES.DBService) private dbService: DBService) {
        
    }

    public async create(data: TRatingCreate) {
        const newRatingItem = await this.dbService.getClient().rating.create({
            data: {
                rating: data.rating,
                bookId: data.bookId,
                userId: data.userId
            }
        });
        return newRatingItem;
    }
}