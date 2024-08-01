import mongoose from "mongoose";






async function connectDB(){
    try{
        await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
        console.log("Connected to db successfully");
    }catch(err){
        console.log("Error in Connecting to DB\n", err);
        process.exit(1);
    }
}



export default connectDB;