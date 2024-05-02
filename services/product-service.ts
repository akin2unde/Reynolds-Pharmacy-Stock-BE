import { Product } from "../models/product";
import { BaseService } from "./base-service";

export class ProductService extends BaseService<Product>
{
    constructor() {
        super()
        this.tableName="products";
    }
     preSave(data: Product[]) 
     {

     }
}