import jwt from 'jsonwebtoken';

export interface userTokenPayload{
    id:string
}


const JWT_SECRET = 'mysecret'

export function createUserToken(payload:userTokenPayload){
    const token = jwt.sign(payload,JWT_SECRET);

    return token;
}


export function verifyToken(token:string){
    try {
        const payload = jwt.verify(token,JWT_SECRET) as userTokenPayload

        return payload;
    } catch (error) {
        return null;
    }
}

