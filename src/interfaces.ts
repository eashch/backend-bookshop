import { Prisma, Rating, User, Book } from '@prisma/client'

export type TBookFullInfo = Prisma.BookGetPayload<{
    include: {
        categories: true,
        authors: true,
        ratings: true,
        currency: true
    }
}>

export interface IBookInfo {
    id: number;
    name: string;
    authors: string[];
    language: string;
    categories: string[];
    price: number;
    currency: string;
    year: number;
    rating: number;
}

export interface IRatingBook {
    userId: number,
    rating: number
}

export interface IBookCreate {
    name: string;
    authors: string[];
    language: string;
    categories: string[];
    ratings: IRatingBook[];
    price: number;
    currency: string;
    year: number;
}

export type TRatingCreate = Omit<Rating, "id">;

export type TUserOutput = Omit<User, "password">;

export interface IUserRegister {
    login?: string;
    email?: string;
    password: string;
}

export interface IUserEdit {
    name?: string,
    description?: string
}

export interface IUserRegister {
    login?: string;
    email?: string;
    password: string;
}

export interface IUserLogin {
    loginOrEmail: string;
    password: string;
}

export interface ITokenInfo {
    loginOrEmail: string;
    password: string;
    iat: number;
}

export interface IBookEdit {
    name?: string;
    language?: string;
    price?: number;
    currency?: string;
    year?: number;
}

export interface IBookGetAllQuery {
    perPage: number;
    page: number;
    category: string;
}

export interface ICategoryGetAllQuery {
    perPage: number;
    page: number;
}

interface Error {
    name: string;
    message: string;
    stack?: string;
}

export interface IRating {
    averageRating: number,
    reviews: number
}

export const TYPES = {
    BookController: Symbol.for('BookController'),
    BookService: Symbol.for('BookService'),
    BookRepository: Symbol.for('BookRepository'),

    CategoryController: Symbol.for('CategoryController'),
    CategoryService: Symbol.for('CategoryService'),
    CategoryRepository: Symbol.for('CategoryRepository'),

    UserController: Symbol.for('UserController'),
    UserService: Symbol.for('UserService'),
    UserRepository: Symbol.for('UserRepository'),

    RatingController: Symbol.for('RatingController'),
    RatingService: Symbol.for('RatingService'),
    RatingRepository: Symbol.for('RatingRepository'),

    App: Symbol.for('App'),
    DBService: Symbol.for('DBService')
} 