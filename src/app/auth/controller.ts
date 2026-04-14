import type{Request,Response} from "express"
import { signInPayloadModel, signUpPayloadModel } from "./models"
import { createHmac, randomBytes } from "node:crypto"
import { db } from "../../db"
import { userTable } from "../../db/schema"
import { eq } from "drizzle-orm"
import { createUserToken, userTokenPayload } from "./utils/token"
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

    public async handleSignIn(req:Request, res:Response){
        // validating the incoming body parameters using zod

        const validationResult = await signInPayloadModel.safeParseAsync(req.body);

        // checking for the error 
        if(validationResult.error) return res.status(400).json({
            message:"boday validation failed",
            error : validationResult.error.issues
        })


        // if there is no error then extract the email and password
        const {email,password} = validationResult.data;

        // now get the user with the extracted email id
        const [userSelect] = await db.select().from(userTable).where(eq(userTable.email, email))

        // if no user exists then return an error
        if(!userSelect) return res.status(404).json({
            message : `user with email ${email} does not exists`
        })
        // if user exists with the email then check the password

        // for that we need the stored salt(in db)
        // then hash that salt with the password given by the user 
        const existingSalt = userSelect.salt!
        const hash = createHmac('sha256',existingSalt).update(password).digest('hex')

        // if the password that is stored in the database is not equal to the hashed password then throw an error
        if(userSelect.password !== hash) return res.status(400).json({
            message : `User email or password is incorrect`
        });

        // if user is genuine then generate the token and return that token back to the user
        

        const token = createUserToken({
            id: userSelect.id
        })

        return res.json({
            message : 'SignIn success!',
            data:{token : token}
        })
    }

    public async handleMe(req:Request, res:Response){

        //@ts-ignore
        const{id} = req.user! as userTokenPayload
        
        const [userResult] = await db.select().from(userTable).where(eq(userTable.id, id));

        return res.json({
            firstName:userResult?.firstName,
            lastName:userResult?.lastName,
            email: userResult?.email
        })
    }
}

export default AuthenticationController