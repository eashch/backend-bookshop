import "reflect-metadata";
import { inject, injectable } from "inversify";
import { IBookCreate, IBookEdit, IBookInfo, TYPES } from "../interfaces";
import { DBService } from "./DBService";

@injectable()
export class BookRepository {
    constructor(@inject(TYPES.DBService) private dbService: DBService) {
    }
    
    public async findAll() {
        const booksList = await this.dbService.getClient().book.findMany({
            include: {
                categories: true,
                authors: true,
                ratings: true,
                currency: true
            }
        });
        return booksList;
    }

    public async findByCategory(perPage: number, page: number, category: string) {
        const result = await this.dbService.getClient().book.findMany({
            where: {
                categories: {
                    some: {
                        name: category
                    },
                }
            },
            include: {
                categories: true,
                authors: true,
                ratings: true,
                currency: true
            },
            skip: ((page - 1) * perPage),
            take: perPage,
        });
        return result;
    }

    public async findById(id: number) {
        const result = await this.dbService.getClient().book.findUnique({
            where: {
                id: id
            }
        });
        return result;
    }

    public async removeById(id: number) {
        const result = await this.dbService.getClient().book.delete({
            where: {
                id: id,
            },
        });
    }

    public async create(data: IBookCreate, 
            currencyId: number, 
            categoriesIdsToConnect: number[],
            authorsIdsToConnect: number[]) {

        await this.dbService.getClient().book.create({
            data: {
              name: data.name,
              language: data.language,
              price: data.price,
              year: data.year,

              categories: {
                connect: categoriesIdsToConnect.map(
                    item => {return {id: item}}),
              },
              authors: {
                connect: authorsIdsToConnect.map(
                    item => {return {id: item}}),
              },
              ratings: {
                create: data.ratings.map(
                    item => {return { rating: item.rating, userId: item.userId}})
              },
              currencyId: currencyId
            }
        });
    }

    public async edit(id: number, data: IBookEdit, 
        currencyId: number | undefined) {
            
    await this.dbService.getClient().book.update({
        where: {
            id: id
        },
        data: {
          name: data.name,
          language: data.language,
          price: data.price,
          year: data.year,
          currencyId: currencyId
        }
    });
}

    public async getCurrency(acronym: string) {
        const result = await this.dbService.getClient().currency.findFirst({
            where: {
                acronym: acronym
            }
        });
        return result; 
    }

    public async getAuthor(name: string) {
        const result = await this.dbService.getClient().author.findFirst({
            where: {
                name: name
            }
        });
        return result; 
    }

    public async getCategory(name: string) {
        const result = await this.dbService.getClient().category.findFirst({
            where: {
                name: name
            }
        });
        return result; 
    }
}