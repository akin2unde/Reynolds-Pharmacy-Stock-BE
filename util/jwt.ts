import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

export class JWTokenHelper
{
    SECRET_KEY="rps_032_*$$"
    public generateToken(data:any)
    {
        return jwt.sign(data, this.SECRET_KEY, { expiresIn: '7d' });
    }
    public validateToken(token:string):any|undefined
    { 
          try {
             const res= jwt.verify(token, this.SECRET_KEY);
             return res
           } catch (error) {
            return undefined;
         }
    }

}