import { StatusCodes } from 'http-status-codes';
import { Controller, Get, Post, Delete, ClassMiddleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { StockCountService } from "../services";
import { StockCountEvent } from '../models/stock-count-event';
import { AuthMiddleware } from '../middleware/auth-middleware';

@Controller('api/stockCount')
@ClassMiddleware([AuthMiddleware])
export class StockCountController {
    service:StockCountService;
 constructor(service:StockCountService) 
    {
        this.service= service; 
    }
    @Get('getAll')
    private async getAll(req: Request, res: Response) {
         var result =await this.service.getAllStockCounts();
        return res.status(StatusCodes.OK).json(result);
    }
    @Get("getByCode/:code")
    private async getByCode(req: Request, res: Response) {
        const result =await this.service.getStKByCode(req.params.code);
        return res.status(StatusCodes.OK).json(result);
    }
     @Post("get")
    private async get(req: Request, res: Response) {
        const result =await this.service.get(req.body);
        return res.status(StatusCodes.OK).json(result);
    }
    @Post("save")
    private async save(req: Request, res: Response) {
        var data = plainToInstance(StockCountEvent,<StockCountEvent[]>req.body)
        var savedData =await this.service.save(data);
        return res.status(StatusCodes.OK).json(savedData);
    }

    @Delete('delete/:code')
    private async delete(req: Request, res: Response) {
        await this.service.delete(req.params.code);
        return res.status(StatusCodes.OK).json();
    }
}