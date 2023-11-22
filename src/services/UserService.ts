import "reflect-metadata";
import { inject, injectable } from "inversify";
import { IBookInfo, IUserEdit, TUserOutput, TYPES } from "../interfaces";
import { UserRepository } from "../repositories/UserRepository";
import cryptoJS from "crypto-js";
import { mapUser } from "../mapping";

@injectable()
export class UserService {

    constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {
    }

    public async getUsers() {
        return await this.userRepository.findAll();
    }

    private comparePasswords(passwordFromClient: string, encryptedPassword: string) {
        var bytes  = cryptoJS.AES.decrypt(encryptedPassword, process.env.SALT);
        var originalText = bytes.toString(cryptoJS.enc.Utf8);

        return passwordFromClient === originalText;
    }

    public async loginUser(loginOrEmail: string, password: string) {
        const user = await this.userRepository.loginUser(loginOrEmail);
        
        if (!user)
            throw("User not found");

        if (!this.comparePasswords(password, user.password))
            throw("Wrong password");
        return mapUser(user);
    }

    public async registerUser(loginOrEmail: string, password: string) {
        var cipherPass = cryptoJS.AES.encrypt(
            password, process.env.SALT).toString();

        const user = await this.userRepository.registerUser(
            loginOrEmail, cipherPass);
        if (!user)
            throw("User was not registered");
        return mapUser(user);
    }

    public async getUserBooks(id: number) {
        const user = await this.userRepository.findById(id);

        if (!user || !user.books.length)
            return [];
        
        return {};
    }

    public async editUser(id: number, 
        userEdit: IUserEdit,
        loginOrEmail: string, password: string
    ) {
        await this.loginUser(loginOrEmail, password);

        const user = await this.userRepository.editUser(id, userEdit);

        if (!user)
            throw("User was not edited");
        return mapUser(user);
    }

    public async deleteUser(id: number, loginOrEmail: string, password: string) {
        await this.loginUser(loginOrEmail, password);

        return await this.userRepository.removeById(id);
    }
}
