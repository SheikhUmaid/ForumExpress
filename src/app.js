import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import winston from "winston";
const app = express();


const logger = winston.createLogger({
    level: 'info',
    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({timestamp, level,message})=>{
            return `${timestamp} ${level}: ${message}`
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/requests.log' })
    ],
})

morgan.token('body', (req)=>JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}))

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