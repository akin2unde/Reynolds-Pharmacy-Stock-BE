
import { Request, Response, NextFunction } from 'express';
import { JWTokenHelper } from '../util/jwt';
import { StatusCodes } from 'http-status-codes';

export function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    if(req.header('Authorization') || req.url.includes('login'))
    {
        if(req.url.includes('login'))
            {
                next()
            }
            else{
              const token=  req.header('Authorization') ;
              const tokenResp= new JWTokenHelper().validateToken(token);
              if(tokenResp==undefined)
                {
                    res.status(StatusCodes.FORBIDDEN).send({message: "Invalid token"});
                }
                else{
                    next();
                }
            }
    }
    else
    {
        res.status(StatusCodes.FORBIDDEN).send({message:"Token not present in the header"});
    }
}