import "reflect-metadata";
import { Router, Request, Response, NextFunction } from 'express';
import { injectable } from "inversify";

interface IMiddleware {
    handle: (req: Request, res: Response, next: NextFunction) => void;
}

export abstract class Middleware implements IMiddleware {
    public handle(req: Request, res: Response, next: NextFunction) { }
}

interface ControllerRoute {
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
    path: string;
    fn: (req: Request, res: Response, next: NextFunction) => void;
    middleware: IMiddleware[];
}

@injectable()
export class Controller {
    protected _router: Router;

    constructor() {
        this._router = Router();
    }

    public getRouter(): Router {
        return this._router;
    }

    protected bindRoutes(routes: ControllerRoute[]) {
        routes.forEach((route) => {
            const ctxHandler = route.fn.bind(this);

            const routeHandlers = route.middleware ? [...route.middleware.map((m) => m.handle), ctxHandler] : [];
    
            this._router[route.method ?? 'get'](route.path, routeHandlers);
        })
    }
}