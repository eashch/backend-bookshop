import express, { Express } from 'express';
import { json } from 'body-parser';
import { inject, injectable } from 'inversify';
import { BookController } from './controllers/BookController';
import { TYPES } from './interfaces';
import { CategoryController } from './controllers/CategoryController';
import { UserController } from './controllers/UserController';
import { RatingController } from './controllers/RatingController';

const API_MAIN_PATH = '/api/v1';

@injectable()
export class App {
    private app: Express;
    private readonly port: number;

    constructor(@inject(TYPES.BookController) private bookController: BookController,
        @inject(TYPES.CategoryController) private categoryController: CategoryController,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.RatingController) private ratingController: RatingController,
    ) {
        this.app = express();
        this.port = Number(process.env.APP_PORT) || 3000;
    }

    private configureRoutes() {
        this.app.use(API_MAIN_PATH, this.bookController.getRouter());
        this.app.use(API_MAIN_PATH, this.categoryController.getRouter());
        this.app.use(API_MAIN_PATH, this.userController.getRouter());
        this.app.use(API_MAIN_PATH, this.ratingController.getRouter());
    }


    public async run() {
        this.app.use(json());
        this.configureRoutes();
        this.app.listen(this.port, () => {
            console.log(`App launched on port ${this.port}`);
        })
    }
}