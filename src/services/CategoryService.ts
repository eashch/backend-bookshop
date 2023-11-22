import "reflect-metadata";
import { inject, injectable } from "inversify";
import { IBookInfo, TYPES } from "../interfaces";
import { CategoryRepository } from "../repositories/CategoryRepository";

@injectable()
export class CategoryService {

    constructor(@inject(TYPES.CategoryRepository) private categoryRepository: CategoryRepository) {
    
    }

    async getCategories(perPage: number, page: number) {
        return await this.categoryRepository.findAll(perPage, page);
    }

    async addCategory(categoryName: string) {
        return await this.categoryRepository.create(categoryName);
    }

    async editCategory(id: number, updatedCategoryName: string) {
        return await this.categoryRepository.editById(id, updatedCategoryName);
    }

    async deleteCategory(id: number) {
        return await this.categoryRepository.removeById(id);
    }
}
