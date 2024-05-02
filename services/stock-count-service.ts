import { StockCountEvent } from "../models/stock-count-event";
import { BaseService } from "./base-service";

export class StockCountService extends BaseService<StockCountEvent>
{
    constructor() {
        super()
        this.tableName= "stockCounts";
    }
    preSave(data: StockCountEvent[]) {
        data.forEach(_=>{
            _.items= JSON.stringify(_.itemObjects);
        });
    }
    async getStockCounts(search:any)
    {
       const result=  await this.get(search);
       if(result.length>0){
        result.forEach(_=>{
            _.itemObjects= JSON.parse(_.items);
        });
      }
    }
    async getAllStockCounts()
    {
       const result=  await this.getAll();
       if(result.length>0){
        result.forEach(_=>{
            _.itemObjects= JSON.parse(_.items);
        });
      }
      return result;
    }
    async getStKByCode(code:string)
    {
       const result=  await this.getByCode(code);
       if(result){
        result.itemObjects= JSON.parse(result.items);
       }
      return result;
    }
}