import type{Request,Response} from "express"
import { signUpPayloadModel } from "./models"
import { createHmac, randomBytes } from "node:crypto"
import { db } from "../../db"
import { userTable } from "../../db/schema"
import { eq } from "drizzle-orm"
class AuthenticationController{
    public async handleSignup(req:Request, res:Response){
        const validationResult = await signUpPayloadModel.safeParseAsync(req.body)

        if(validationResult.error) return res.status(400).json({
            msg :"Body validation failed!",
            error : validationResult.error.issues            
        })

        const {firstName, lastName, email,password} = validationResult.data

        const userEmailResult = await db.select().from(userTable).where(eq(userTable.email , email));

        if(userEmailResult.length > 0) return res.status(400).json({
            msg:"user with email already exists"
        })

        const salt = randomBytes(32).toString('hex');

        // by using this salt(random string) i am going to hash the userpassword

        const hash = createHmac('sha256',salt).update(password).digest('hex');

        const [result] = await db.insert(userTable).values({
            firstName,
            lastName,
            email,
            password:hash,
            salt
        }).returning({id:userTable.id});

        return res.status(201).json({
            msg : "user has beed created successfully",
            data:{id:result?.id}
        })
    }
}

export default AuthenticationController