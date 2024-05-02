import { BaseEntity } from "./base-entity";

export class User extends BaseEntity
{
    tableName: string="users";
    codePrefix: string="USR"
    name:string="";
    email:string="";
    phoneNo:number=0;
    password:string="";
    token:string="";
    /**
     *
     */
    constructor() {
        super();
        
    }
}