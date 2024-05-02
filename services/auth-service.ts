import { ClassMiddleware } from "@overnightjs/core";
import { BaseEntity } from "../models/base-entity";
import { ObjectState } from "../models/object-state";
import { User } from "../models/user";
import { BaseService } from "./base-service";
import { AuthMiddleware } from "../middleware/auth-middleware";
import { JWTokenHelper } from "../util/jwt";
var bcrypt= require('bcrypt');
export class AuthService extends BaseService<User>
{
  
    // bcrypt.hash(password, saltRounds, function (err, hash) {
    //     const insertUsers = `INSERT INTO users (email, password) VALUES ('foo@bar.com', '${hash}');`
    //     db.run(insertUsers);
    // });
    /**
     *
     */
    constructor() {
        super()
        this.tableName="users";
    }

    preSave(data: User[]) {
    
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if(element.state== ObjectState.new)
                {
                    element.password= bcrypt.hashSync(element.password, 5);
                    console.log(element.password); 
                }
        }
    }
    async login(user:User)
    { 
        const hash = bcrypt.hashSync(user.password, 5);
        const found= await this.get({email:user.email});
        if(found && found.length>0)
        {
            const match = bcrypt.compareSync(found[0].password, hash);
            if(match)
            {
              found[0].token= new JWTokenHelper().generateToken({email:found[0].email})
              return found[0];
            }
            else
            {
                throw new Error('User password not match');
            }
        }
        else
        {
              throw new Error('User not found');
        }
    } 
}