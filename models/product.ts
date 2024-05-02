import { BaseEntity } from "./base-entity";

export class Product extends BaseEntity
{
    codePrefix: string="PRD"
    name:string="";
    description:string="";
    category:string="";
    quantity:number=0;
}