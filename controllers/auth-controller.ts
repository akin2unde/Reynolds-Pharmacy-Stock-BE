import { StatusCodes } from 'http-status-codes';
import { Controller, Get, Post, Put, Delete, ClassMiddleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '../models/user';
import { AuthService } from '../services';
import { plainToClass, plainToInstance } from 'class-transformer';
import { AuthMiddleware } from '../middleware/auth-middleware';

@Controller('api/auth')
@ClassMiddleware([AuthMiddleware])
export class AuthController {

    constructor(service:AuthService) 
    {
        this.service= service;
    }
      service:AuthService;
    @Post('login')
    private async login(req: Request, res: Response) {
         var result =await this.service.login(req.body);
        return res.status(StatusCodes.OK).json(result);
    }

    @Post("save")
    private async save(req: Request, res: Response) {
        var data = plainToInstance(User,<User[]>req.body) //req.body as User[];
        var savedData =await this.service.save(data);
        return res.status(StatusCodes.OK).json(savedData);
    }

    @Delete('delete/:code')
    private async delete(req: Request, res: Response) {
        await this.service.delete(req.params.code);
        return res.status(StatusCodes.OK).json();
    }

}
