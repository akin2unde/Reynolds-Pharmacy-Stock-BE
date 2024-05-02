import { StatusCodes } from 'http-status-codes';
import { Controller, Get, Post, Put, Delete, ClassMiddleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '../models/user';
import { AuthService, ProductService } from '../services';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Product } from '../models/product';
import { AuthMiddleware } from '../middleware/auth-middleware';

@Controller('api/product')
@ClassMiddleware([AuthMiddleware])
export class ProductController {
    service:ProductService;
  constructor(service:ProductService) 
    {
        this.service= service;
    }
    @Get('getAll')
    private async getAll(req: Request, res: Response) {
         var result =await this.service.getAll();
        return res.status(StatusCodes.OK).json(result);
    }
    @Get("getByCode/:code")
    private async getByCode(req: Request, res: Response) {
        const result =await this.service.getByCode(req.params.code);
        return res.status(StatusCodes.OK).json(result);
    }
     @Post("get")
    private async get(req: Request, res: Response) {
        const result =await this.service.get(req.body);
        return res.status(StatusCodes.OK).json(result);
    }
    @Post("save")
    private async save(req: Request, res: Response) {
        var data = plainToInstance(Product,<Product[]>req.body)
        var savedData =await this.service.save(data);
        return res.status(StatusCodes.OK).json(savedData);
    }

    @Delete('delete/:code')
    private async delete(req: Request, res: Response) {
        await this.service.delete(req.params.code);
        return res.status(StatusCodes.OK).json();
    }
}