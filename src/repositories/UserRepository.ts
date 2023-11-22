import "reflect-metadata";
import { inject, injectable } from "inversify";
import { IBookInfo, IUserEdit, TYPES } from "../interfaces";
import { DBService } from "./DBService";

@injectable()
export class UserRepository {
    constructor(@inject(TYPES.DBService) private dbService: DBService) {

    }
    
    public async findAll() {
        const users = await this.dbService.getClient().user.findMany();
        return users;
    }

    public async findById(id: number) {
        const user = await this.dbService.getClient().user.findUnique({
            where: {
                id: id
            },
            include: {
                books: {
                    include: {
                        categories: true,
                        authors: true,
                        ratings: true,
                        currency: true  
                    }
                }
            }
        });
        return user;
    }

    public async findByLoginOrEmailAndPassword(loginOrEmail: string, password: string) {
        const user = await this.dbService.getClient().user.findUnique({
            where: {
                login_or_email: loginOrEmail,
                password: password
            },
            include: {
                books: {
                    include: {
                        categories: true,
                        authors: true,
                        ratings: true,
                        currency: true  
                    }
                }
            }
        });
        return user;
    }

    public async removeById(id: number) {
        const result = await this.dbService.getClient().user.delete({
            where: {
                id: id,
            },
        });
    }

    public async loginUser(loginOrEmail: string) {
        return await this.dbService.getClient().user.findFirst({
            where: {
                login_or_email: loginOrEmail
            },
        });
    }

    public async registerUser(loginOrEmail: string, password: string) {
        return await this.dbService.getClient().user.create({
            data: {
                login_or_email: loginOrEmail,
                password: password,
                name: "",
                register_date: ((new Date()).toISOString()),
                description: ""
            },
        });
    }

    public async editUser(id: number, userEdit: IUserEdit) {
        return await this.dbService.getClient().user.update({
            where: {
                id: id
            },
            data: userEdit
        });
    }
}