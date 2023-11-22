import "reflect-metadata";
import { App } from './src/App';
import * as dotenv from 'dotenv';
import { Container } from 'inversify';
import { BookController } from './src/controllers/BookController';
import { TYPES } from './src/interfaces';
import { BookService } from './src/services/BookService';
import { BookRepository } from './src/repositories/BookRepository';
import { DBService } from "./src/repositories/DBService";
import { CategoryRepository } from "./src/repositories/CategoryRepository";
import { CategoryService } from "./src/services/CategoryService";
import { CategoryController } from "./src/controllers/CategoryController";
import { UserRepository } from "./src/repositories/UserRepository";
import { UserController } from "./src/controllers/UserController";
import { UserService } from "./src/services/UserService";
import { RatingRepository } from "./src/repositories/RatingRepository";
import { RatingService } from "./src/services/RatingService";
import { RatingController } from "./src/controllers/RatingController";

dotenv.config();

async function bootstrap() {
    const container = new Container();
    container.bind < DBService > (TYPES.DBService).to(DBService).inSingletonScope();
    
    container.bind < BookRepository > (TYPES.BookRepository).to(BookRepository);
    container.bind < BookService > (TYPES.BookService).to(BookService);
    container.bind < BookController > (TYPES.BookController).to(BookController);

    container.bind < CategoryRepository > (TYPES.CategoryRepository).to(CategoryRepository);
    container.bind < CategoryService > (TYPES.CategoryService).to(CategoryService);
    container.bind < CategoryController > (TYPES.CategoryController).to(CategoryController);

    container.bind < UserRepository > (TYPES.UserRepository).to(UserRepository);
    container.bind < UserService > (TYPES.UserService).to(UserService);
    container.bind < UserController > (TYPES.UserController).to(UserController);

    container.bind < RatingRepository > (TYPES.RatingRepository).to(RatingRepository);
    container.bind < RatingService > (TYPES.RatingService).to(RatingService);
    container.bind < RatingController > (TYPES.RatingController).to(RatingController);
    
    container.bind < App > (TYPES.App).to(App);
    

    const app = container.get(TYPES.App) as App;

    await app.run();
}

bootstrap();