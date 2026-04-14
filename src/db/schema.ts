import { timestamp } from "drizzle-orm/pg-core"
import { boolean } from "drizzle-orm/pg-core"
import {pgTable,uuid,varchar,text} from "drizzle-orm/pg-core"

//                              name_table
export const userTable = pgTable('users',{
    id : uuid('id').primaryKey().defaultRandom(),
    firstName : varchar('first_name',{length:45}).notNull(),
    lastName : varchar('last_name',{length:45}),
    email:varchar('email',{length:322}).notNull().unique(),
    emailVerified : boolean('email_verified').default(false).notNull(),
    password:varchar('password',{length: 66}),

    salt : text('salt'),

    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').$onUpdate(()=>new Date())
})

//ORM - JS (camelCase ) -- DB snake_case