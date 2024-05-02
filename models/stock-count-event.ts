import { BaseEntity } from "./base-entity";
import { ProductCount } from "./product-count";
import { StoreCountStatus } from "./store-count-status";

export class StockCountEvent extends BaseEntity
{
    codePrefix: string="STK";
    description:string="";
    itemObjects:ProductCount[]=[];
    items:string="";
    countedBy:string="";
    status:StoreCountStatus= StoreCountStatus.pending;
}