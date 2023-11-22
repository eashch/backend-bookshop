import "reflect-metadata";
import { ICategoryGetAllQuery, TYPES } from "../interfaces";
import { Controller } from "./Controller";
import { inject, injectable } from 'inversify';
import { CategoryService } from "../services/CategoryService";
import { Request, Response, NextFunction } from "express";
import { throwServerError, validationWrapper, validationWrapperWithID } from "../utils";
import { body, param, validationResult, query } from "express-validator";

const CATEGORY_MAIN_PATH = '/categories'; 

@injectable()
export class CategoryController extends Controller {

    constructor(@inject(TYPES.CategoryService) private categoryService: CategoryService) {
        super();
        this._router.get(
            CATEGORY_MAIN_PATH, 
            query('perPage', 'perPage must be number 1 - 30').isInt({ min: 1, max: 30 }),
            query('page', 'page must positive number').isInt({min: 1}),
            this.getCategories.bind(this));
        this._router.post(
            CATEGORY_MAIN_PATH,
            body("name").exists().isString(),
            this.addCategory.bind(this));
        this._router.put(
            CATEGORY_MAIN_PATH + '/:id',
            param('id', 'id must number').isInt(),
            body("name").exists().isString(), 
            this.editCategory.bind(this));
        this._router.delete(
            CATEGORY_MAIN_PATH + '/:id',
            param('id', 'id must number').isInt(), 
            this.deleteCategory.bind(this));
    }

    async getCategories(req: Request<{}, {}, {}, ICategoryGetAllQuery>, res: Response) {

        const validResult = validationResult(req);

        if (!validResult.isEmpty()) {
            res.status(400);
            res.send({ errors: validResult.array() });
            return;
        }
        
        try {
            const perPage = Number(req.query.perPage);
            const page = Number(req.query.page);
            const categories = await this.categoryService.getCategories(
                perPage,
                page);
            res.send(categories);
        } catch (e) {
            throwServerError(res, e);
        }
    }

    async addCategory(req: Request<{}, {}, {name: string}>, res: Response) {
        const validResult = validationResult(req);

        if (!validResult.isEmpty()) {
            res.status(400);
            res.send({ errors: validResult.array() });
            return;
        }
        
        try {
            const newCategory = await this.categoryService.addCategory(
                req.body.name);
            res.status(201);
            res.send(newCategory);
        } catch (e) {
            throwServerError(res, e);
        }
    }

    async editCategory(req: Request<{ id: number }, {}, {name: string}>, 
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
            const id = Number(req.params.id);
            await this.categoryService.editCategory(
                id,
                req.body.name);
            res.status(200);
            res.send(`New category name: ${req.body.name}`);
        } catch (e) {
            throwServerError(res, e);
        }
    }

    async deleteCategory(req: Request<{ id: number }>, res: Response, next: NextFunction) {
        validationWrapperWithID(req, res, 
            (req: Request<{ id: number }>, res: Response) => {
                const id = Number(req.params.id);
                const del = this.categoryService.deleteCategory(id);
                res.status(200);
                res.send(`Category deleted: ${id} ${typeof id}`);
            });
    }
}


