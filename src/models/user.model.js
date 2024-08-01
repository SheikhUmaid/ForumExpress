import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
        }
    },
    {
        timestamps: true,
    }
);

userSchema.plugin(mongooseAggregatePaginate);//not used yet
userSchema.pre("save", async function (next) {
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
