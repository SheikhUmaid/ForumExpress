import mongoose from "mongoose"


const querySchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title:{
        type:String,
        require:true,
        maxLength: 50,
    },
    content: {
        type: String,
        required:true,   
    },
    tags:[
        {
            type:String,
        }
    ],
    language:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Language",
    },
    edited:{
        type: Boolean, 
        default: false
    },
    votes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    responses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Response"
        }
    ],
    

}, {
    timestamps:true,
})

const Query = mongoose.model("Query", querySchema)

export default Query