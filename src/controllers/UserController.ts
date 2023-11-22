import "reflect-metadata";
import { IUserLogin, IUserRegister, IUserEdit, TYPES, ITokenInfo } from "../interfaces";
import { Controller } from "./Controller";
import { inject, injectable } from 'inversify';
import { UserService } from "../services/UserService";
import { Request, Response, NextFunction } from "express";
import { throwServerError, validationWrapper } from "../utils";
import { body, param } from "express-validator";
import { AuthMiddleware, LogInMiddleware, ValidateMiddleware } from "../MIddleware";

const USER_MAIN_PATH = '/user';

@injectable()
export class UserController extends Controller {
    _registerMiddleware: ValidateMiddleware;
    _logInMiddleware: LogInMiddleware;
    _authMiddleware: AuthMiddleware;

    constructor(@inject(TYPES.UserService) private userService: UserService) {
        super();
        this._registerMiddleware = new ValidateMiddleware();
        this._authMiddleware = new AuthMiddleware();
        this._logInMiddleware = new LogInMiddleware();

        this._router.get(
            USER_MAIN_PATH, 
            this.getUsers.bind(this));
        this._router.post(
            USER_MAIN_PATH + '/login', 
            body("loginOrEmail").exists().isString(),
            body("password").exists().isString(),
            this._logInMiddleware.handle.bind(this),
            this.loginUser.bind(this));
        this._router.post(
            USER_MAIN_PATH + '/register', 
            body("email").optional({checkFalsy: true}).isEmail(),
            body("login").optional({checkFalsy: true}).isString(),
            body("password").exists().isString(),
            this._registerMiddleware.handle.bind(this),
            this.registerUser.bind(this));
        this._router.get(
            USER_MAIN_PATH + '/books', 
            this.getUserBooks.bind(this));
        this._router.put(
            USER_MAIN_PATH + '/:id',
            param('id', 'id must number').isInt(), 
            body("name").optional({checkFalsy: true}).isString(),
            body("description").optional({checkFalsy: true}).isString(),
            this._authMiddleware.handle.bind(this),
            this.editUser.bind(this));
        this._router.delete(
            USER_MAIN_PATH + '/:id', 
            param('id', 'id must number').isInt(),
            this._authMiddleware.handle.bind(this),
            this.deleteUser.bind(this));
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        validationWrapper(req, res, async (req: Request, res: Response) => {
            const users = await this.userService.getUsers();
            res.status(200);
            res.send(users);
        });
    }

    async loginUser(req: Request<{}, {}, IUserLogin>, 
        res: Response, next: NextFunction
    ) {
        try {
            const user = await this.userService.loginUser(
                req.body.loginOrEmail, 
                req.body.password);
            
            if (!user) {
                res.status(404);
                res.send("User doesn't exist");  
                return;  
            }
            res.status(200);
            res.send(user);
        } catch (e) {
            throwServerError(res, e);
        }
    }

    async registerUser(req: Request<{}, {}, IUserRegister>, 
        res: Response, next: NextFunction
    ) {        
        try {
            let loginOrEmail = req.body.email;
            if (!loginOrEmail || !loginOrEmail)
                loginOrEmail = req.body.login;

            const newUser = await this.userService.registerUser(
                loginOrEmail, 
                req.body.password);
            res.status(201);
            res.send(newUser);
        } catch (e) {
            if (e.message.includes("Unique constraint failed on the fields")) {
                res.status(400);
                res.send(`Login or email must be unique`);
                return;
            }
            throwServerError(res, e);
        }
    }

    async getUserBooks(req: Request, res: Response, next: NextFunction) {
        validationWrapper(req, res, async (req: Request, res: Response) => {
            const userBooks = await this.userService.getUserBooks(4);
            res.send(userBooks);
        });
    }

    async editUser(req: Request<{ id: number, jwtPayload: ITokenInfo }, {}, IUserEdit>, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            const editedUser = await this.userService.editUser(
                id, req.body, 
                req.params.jwtPayload.loginOrEmail, 
                req.params.jwtPayload.password);
            res.status(200);
            res.send(editedUser);
        } catch (e) {
            throwServerError(res, e);
        }
    }

    async deleteUser(req: Request<{ id: number, jwtPayload: ITokenInfo }>, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            await this.userService.deleteUser(id, 
                req.params.jwtPayload.loginOrEmail, 
                req.params.jwtPayload.password);
            res.status(200);
            res.send(`User deleted: ${req.params.id}`);
        } catch (e) {
            throwServerError(res, e);
        }
    }
}


