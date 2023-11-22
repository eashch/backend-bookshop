import "reflect-metadata";
import { injectable } from "inversify";
import { PrismaClient, Book } from '@prisma/client';

@injectable()
export class DBService {
    private _client: PrismaClient

    constructor() {
        this._client = new PrismaClient();
    }

    getClient() {
        return this._client;
    }
}