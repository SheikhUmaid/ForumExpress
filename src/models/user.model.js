import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import SendMail from "../utils/mailer.js";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
        },
        name:{
            type:String,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password needed"],
        },
        bio: {
            type: String,
            default: "",
        },
        picture: {
            type: String,
            default: "",
        },
        refreshToken: {
            type: String,
        },
        quries: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Query",
            },
        ],
        responses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Reponse",
            },
        ],
        isVerified: {
            type: Boolean, 
            default: false
        },
        verificationString: {
            type:String,
        }
    },
    {
        timestamps: true,
    }
);

userSchema.plugin(mongooseAggregatePaginate);//not used yet


userSchema.pre("save", async function (next) {
    console.log("user pre in voked");
    
    const uuid = uuidv4();
    this.verificationString = uuid;
    await SendMail({
        to: this.email,
        subject: "Your Verification Link for this app",
        body:`click on the link above to verify your account https://127.0.0.1:3000/verify/${this._id}/${this.verificationString}`
    })
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 8);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function (password) {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESSTOKEN,
        { expiresIn: process.env.ACCESSTOKENEXPIRY }
    );
};
userSchema.methods.generateRefreshToken = async function (password) {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESHTOKEN,
        { expiresIn: process.env.REFRESHTOKENEXPIRY }
    );
};

export const User = mongoose.model("User", userSchema);
