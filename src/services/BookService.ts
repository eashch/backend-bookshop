import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TBookFullInfo, IBookInfo, TYPES, IBookEdit, IBookCreate } from "../interfaces";
import { BookRepository } from "../repositories/BookRepository";
import { mapBooks } from "../mapping";

@injectable()
export class BookService {

    constructor(@inject(TYPES.BookRepository) private bookRepository: BookRepository) {
    }

    async getBooks(perPage: number, page: number, category: string) {
        const rawBooks = await this.bookRepository.findByCategory(
            perPage, page, category);

        const books = mapBooks(rawBooks as TBookFullInfo[]);

        return books;
    }

    async addBook(bookInfo: IBookCreate) {
        const currencyObj = await this.bookRepository.getCurrency(
            bookInfo.currency);
        
        if (!currencyObj)
            throw("Currency doesn't exist");

        const authorIds: number[] = [];
        const categoryIds: number[] = [];

        await Promise.all(bookInfo.authors.map(async author => {
            const authorDB = await this.bookRepository.getAuthor(author);
            if (!authorDB)
                throw 'Author must exists';
            authorIds.push(authorDB.id);
        }));

        await Promise.all(bookInfo.categories.map(async category => {
            const categoryDB = await this.bookRepository.getCategory(category);
            if (!categoryDB)
                throw 'Category must exists';
            categoryIds.push(categoryDB.id);
        }));
        return await this.bookRepository.create(
            bookInfo, currencyObj.id, categoryIds, authorIds);
    }

    async editBook(id: number, data: IBookEdit) {
        let currency = undefined;
        if (data.currency) {
            const currencyObj = await this.bookRepository.getCurrency(
                data.currency);
            
            if (!currencyObj)
                throw("Currency doesn't exist");
            currency = currencyObj.id;
        }

        return await this.bookRepository.edit(id, data, currency);
    }

    async deleteBook(id: number) {
        return await this.bookRepository.removeById(id);
    }
}