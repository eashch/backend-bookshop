import { verify } from 'jsonwebtoken';
import { Middleware } from './controllers/Controller';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { env } from 'process';
import { validationResult } from 'express-validator';

export class ValidateMiddleware extends Middleware {
    public handle(req, res, next) {
        const validResult = validationResult(req);

        if (!validResult.isEmpty()) {
            res.status(400);
            res.send({ errors: validResult.array() });
            return;
        }

        if (req.body.password.length < 6) {
            res.status(400);
            res.send("Password must be 6 or more symbols");
            return;
        }

        if (!req.body.login && !req.body.email) {
            res.status(422);
            res.send("Must have login or email");
            return;
        }

        const validateEmail = (email) => {
            return String(email)
              .toLowerCase()
              .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              );
        };

        if (req.body.email) {
            if (!validateEmail(req.body.email)) {
                res.status(400);
                res.send("Invalid email");
                return;
            }
        }

        jwt.sign({ loginOrEmail: req.body.login ? req.body.login : req.body.email, 
                password: req.body.password }, process.env.JWTSECRET, (err, token) => {
            res.setHeader("TOKEN", token);
            next();
        });
    }
}

export class LogInMiddleware extends Middleware {
    public handle(req, res, next) {
        const validResult = validationResult(req);

        if (!validResult.isEmpty()) {
            res.status(400);
            res.send({ errors: validResult.array() });
            return;
        }

        jwt.sign({ loginOrEmail: req.body.loginOrEmail, 
                password: req.body.password }, process.env.JWTSECRET, (err, token) => {
            res.setHeader("TOKEN", token);
            next();
        });
    }
}

export class AuthMiddleware extends Middleware {
    public handle(req, res, next) {
        const validResult = validationResult(req);

        if (!validResult.isEmpty()) {
            res.status(400);
            res.send({ errors: validResult.array() });
            return;
        }
        const token = req.headers.authorization.split(' ')[1];
        verify(token, process.env.JWTSECRET, (err, payload) => {
            if (err) {
                res.status(401).send();
            } else {
                req.params.jwtPayload = payload;
                next();
            }
        })
    }
} 