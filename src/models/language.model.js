import mongoose from "mongoose";




const languageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
})


export default languageModel = mongoose.model("Language", languageSchema)