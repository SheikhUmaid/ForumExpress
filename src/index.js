import dotenv from "dotenv"
import connectDB from "./db/connect.js"
import app from "./app.js"



dotenv.config({
    path: "./.env"
})


connectDB().then(()=>{
    app.get("/", (req,res)=>{
        res.send("Hello World");
    })
    app.listen(process.env.PORT);
    console.log(`server has been started on - ${process.env.PORT}`);
}).catch(()=>{
    console.log(`failed to connect to db`);
    process.exit(1);
})