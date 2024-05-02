import { Database } from "sqlite3";
import { BaseEntity } from "../models/base-entity";
import { ObjectState } from "../models/object-state";
import { plainToInstance } from "class-transformer";

export abstract class BaseService<T extends BaseEntity>
{
    db:Database;
    tableName:string
    dbIgnoreProperties= ['codePrefix','token','state','codePrefix','itemObjects','error','categoryObj']
    constructor() 
    {
        
    }

   abstract preSave(data: T[]);
   private  resetStateRemoveIgnoreProperties(data: T[])
   {
      data.forEach(_=>{
        if(!_.error){
        _.state= ObjectState.unchanged;
        }
        delete _.codePrefix;
        // if(_.hasOwnProperty('password')){
        //    delete (_ as any).password
        // }
       });
   }
    
    public async save(data: T[]): Promise<T[]> {
      this.preSave(data);
      const dataTosave= data.filter(_=>_.state== ObjectState.new);
      const dataToUpdate=data.filter(_=>_.state== ObjectState.changed);
      const dataToDelete=data.filter(_=>_.state== ObjectState.deleted);
      if(dataTosave.length>0)
      {
      await this.create(dataTosave);
      }
      if(dataToUpdate.length>0)
      {
       await this.update(dataToUpdate[0]);
      }
      if(dataToDelete.length>0)
      {
       await this.delete(dataToDelete[0].code);
      }
       var result= dataToUpdate.concat(dataTosave).concat(dataToDelete);
      this.resetStateRemoveIgnoreProperties(result)
       return result;
    }
    setCode(data:T[])
    {
      data.forEach(f=>{
        f.code=`${f.codePrefix}-${this.generate6DigitCode()}`;
      });
    }
    private generate6DigitCode()
    {
     return Math.floor(1000000000 + Math.random() * 9000000000);
    } 
    private async create(data: T[])
      {
        return new Promise<T[]>((resolve, reject) => { 
        this.setCode(data);
        for (let index = 0; index < data.length; index++) {
            const item = data[index];
            const allFields= Object.keys(item).filter(_=>!this.dbIgnoreProperties.find(f=>f==_));
            const allValues=allFields.map(_=>item[_]);
            const qry = `INSERT INTO ${this.tableName} (${allFields}) VALUES (${allFields.map(m=>'?')})`
            this.db.run(qry, allValues,(err,res)=>{
              if (err) {
                console.error("DB Error: Insert failed: ", err.message);
                item.error=err.message;
                return  resolve(data); //reject(err.message);
              }
              else{
                    this.resetStateRemoveIgnoreProperties(data)
                    return resolve(data);
              }
            
            });
        } 
       });
      }      
  
    async get(param:{}): Promise<T[]> {
        const allFields= Object.keys(param).filter(_=>!this.dbIgnoreProperties.find(f=>f==_));
        const allfieldClause=allFields.map(_=>`${_}= ?`).join(' AND ');
        const allValues=allFields.map(_=>param[_]);
        const sql = `SELECT * FROM ${this.tableName} WHERE (${allfieldClause})`;
        return new Promise<T[]>((resolve, reject) => { 
        this.db.all<T>(sql, allValues,  (err, res)=> {
           if(err) throw Error(err.message);
           else{
             this.resetStateRemoveIgnoreProperties(res)
             resolve(res)
           }
        });
        });
    }

    async getByCode(code: string): Promise<T> {
      const sql = `SELECT * FROM ${this.tableName} WHERE code = ?`;
      return new Promise<T>((resolve, reject) => { 
      this.db.get<T>(sql, [code], (err, data)=>{
            if(err) throw Error(err.message)
            else
            {
               this.resetStateRemoveIgnoreProperties([data])
               resolve(data)
            }
          })
      });
  }
  async getAll(): Promise<T[]> {
    const sql = `SELECT * FROM ${this.tableName}`;
    return new Promise<T[]>((resolve, reject) => { 
    this.db.all<T>(sql,[], (err, data)=> {
           if(err) throw Error(err.message)
            else
            {
              this.resetStateRemoveIgnoreProperties(data)
              resolve(data)
            }
            
        })
    });
   }

      private async update(item: T)
      {
        return new Promise<T>((resolve, reject) => { 
             const filter =this.dbIgnoreProperties.concat('code');
             const allFields= Object.keys(item).filter(_=>!this.dbIgnoreProperties.concat('code').find(f=>f==_));
             const allfieldClause=allFields.map(_=>`${_}= ?`);
             const allValues=allFields.map(_=>item[_]);
             allValues.push(item.code);
            const qry = `UPDATE ${this.tableName} SET ${allfieldClause} WHERE code=?`
            this.db.run(qry, allValues,(err,res)=>{
              if (err) {
                console.error("DB Error: Update failed: ", err.message);
                item.error=err.message;
                return  resolve(item); //reject(err.message);
              }
              else
              {
                this.resetStateRemoveIgnoreProperties([item])
                return resolve(item);
              }
              
            });
       });
      } 
      async delete(code: string): Promise<void> {
        const qry = `DELETE FROM ${this.tableName} WHERE code = ?`;
         return new Promise<void>((resolve, reject) => { 
            this.db.run(qry,[code], (err,res)=>{
              if (err) {
                reject(new Error("Unable to delete data"))
              }
              return resolve();
            });
       });
      }

}