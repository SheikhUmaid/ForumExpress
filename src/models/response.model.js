import mongoose from "mongoose";





const responseSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }, 
    content: {
        type: String,
        required:true,   
    },
    query:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Query",
        required: true,
    },
    ups:{
        //basically likes and,
        type: Number,
        default: 0,
    },
    downs:{
        //basically dislikes
        type: Number,
        default: 0,
    },
    isEdited:{
        type: Boolean,
        default: false,
    },
    approvedByAuthor: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})



export default  Response = mongoose.model("Response", responseSchema);