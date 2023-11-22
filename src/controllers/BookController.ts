import "reflect-metadata";
import { IBookEdit, IBookGetAllQuery, IBookCreate, TYPES } from "../interfaces";
import { BookService } from "../services/BookService";
import { Controller, Middleware } from "./Controller";
import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from "express";
import { throwServerError, validationWrapper, validationWrapperWithID } from "../utils";
import { body, param, validationResult, query } from "express-validator";

const BOOKS_MAIN_PATH = '/books';

@injectable()
export class BookController extends Controller {

    constructor(@inject(TYPES.BookService) private bookService: BookService) {
        super();

        this._router.get(
            BOOKS_MAIN_PATH,
            query('perPage', 'perPage must be number 1 - 30').isInt({ min: 1, max: 30 }),
            query('page', 'page must positive number').isInt({min: 1}),
            query('category').isString(), 
            this.getBooks.bind(this));
        this._router.post(
            BOOKS_MAIN_PATH, 
            body("name").exists().isString(),
            body("year").exists().isNumeric(), 
            body("categories").exists().isArray(),
            body("authors").exists().isArray(),
            body("price").exists().isNumeric(), 
            body("currency").exists().isString(),
            this.addBook.bind(this));
        this._router.put(
            BOOKS_MAIN_PATH + '/:id',
            param('id', 'id must number').isInt(), 
            body("name").optional({checkFalsy: true}).isString(),
            body("year").optional({checkFalsy: true}).isNumeric(), 
            body("categories").optional({checkFalsy: true}).isArray(),
            body("authors").optional({checkFalsy: true}).isArray(),
            body("price").optional({checkFalsy: true}).isNumeric(), 
            body("currency").optional({checkFalsy: true}).isString(),
            this.editBook.bind(this));
        this._router.delete(
            BOOKS_MAIN_PATH + '/:id', 
            param('id', 'id must number').isInt(),
            this.deleteBook.bind(this));
    }

    async getBooks(
        req: Request<{}, {}, {}, IBookGetAllQuery>, 
        res: Response, 
        next: NextFunction
    ) {
        const validResult = validationResult(req);

        if (!validResult.isEmpty()) {
            res.status(400);
            res.send({ errors: validResult.array() });
            return;
        }
        
        try {
            const perPage = Number(req.query.perPage);
            const page = Number(req.query.page);
            const books = await this.bookService.getBooks(
                perPage,
                page,
                req.query.category);
            res.send(books);
        } catch (e) {
            throwServerError(res, e);
        }
    }

    async addBook(req: Request<{}, {}, IBookCreate>, res: Response, next: NextFunction) {
        const validResult = validationResult(req);

        if (!validResult.isEmpty()) {
            res.status(400);
            res.send({ errors: validResult.array() });
            return;
        }
        
        try {
            const addBookResult = await this.bookService.addBook(
                req.body);
            res.status(201);
            res.send("Book created");
        } catch (e) {
            throwServerError(res, e);
        }
    }

    async editBook(req: Request<{ id: number }, {}, IBookEdit>, res: Response, next: NextFunction) {
        const validResult = validationResult(req);

        if (!validResult.isEmpty()) {
            res.status(400);
            res.send({ errors: validResult.array() });
            return;
        }
        
        try {
            const id = Number(req.params.id);
            await this.bookService.editBook(
                id, req.body);
            res.status(200);
            res.send(`Book edited: ${req.params.id}`);
        } catch (e) {
            throwServerError(res, e);
        }
    }

    async deleteBook(req: Request<{ id: number }>, res: Response, next: NextFunction) {
        validationWrapperWithID(req, res, 
            async (req: Request<{ id: number }>, res: Response) => {
                const id = Number(req.params.id);
                await this.bookService.deleteBook(id);
                res.status(200);
                res.send(`Book deleted: ${req.params.id}`);
            });
    }
}


