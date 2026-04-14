import http from "node:http"
import { createExpressServer } from "./app";

async function main(){
    try {
        const server =  http.createServer(createExpressServer());
        const PORT : number = 4000

        server.listen(PORT,()=>{
            console.log(`Server is listening on port ${PORT}`);
            
        })
    } catch (error) {
        console.log(`Error starting server`);
        throw error;
    }
}

main();