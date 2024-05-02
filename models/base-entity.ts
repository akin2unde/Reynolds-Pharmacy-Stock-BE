import { ObjectState } from "./object-state";

export abstract class BaseEntity
{
    code:string="";
    error:string="";
    createdAt:Date= new Date();
    updatedAt:Date= new Date();
    state:Object= ObjectState.new;
    abstract codePrefix:string
}