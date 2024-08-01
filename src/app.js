import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin: process.env.CORSORIGIN,
    credentials: true
}))
app.use(express.json({limit:"16kb"}))
app.use(urlencoded({extended:true}))
app.use(express.static("public"));
app.use(cookieParser())









//routes


import userRouter from "./routes/user.routes.js"
import queryRouter from "./routes/query.routes.js"
import responseRouter from "./routes/response.routes.js"
app.use("/users", userRouter)
app.use("/query", queryRouter)
app.use("/response", responseRouter)










export default app;