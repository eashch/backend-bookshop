import "reflect-metadata";
import { inject, injectable } from "inversify";
import { IBookInfo, TYPES } from "../interfaces";
import { DBService } from "./DBService";

@injectable()
export class CategoryRepository {
    constructor(@inject(TYPES.DBService) private dbService: DBService) {
   
    }
    
    public async findAll(perPage: number, page: number) {
        const categories = await this.dbService.getClient().category.findMany({
            skip: ((page - 1) * perPage),
            take: perPage,
        });
        return categories;
    }

    public async editById(id: number, updatedCategoryName: string) {
        
        const result = await this.dbService.getClient().category.update({
            where: {
              id: id
            },
            data: {
              name: updatedCategoryName
            }
        });
        return result;
    }

    public async removeById(idDelete: number) {
        const result = await this.dbService.getClient().category.delete({
            where: {
                id: idDelete,
            },
        });
    }

    public async create(categoryName: string) {
        const newCategoryItem = await this.dbService.getClient().category.create({
            data: {
                name: categoryName
            }
        });
        return newCategoryItem;
    }
}