declare namespace  Express {
    interface Request {
        jwtPayload: {
            loginOrEmail: string,
            password: string,
            iat: number
        }
    }
}