import nodeMailer from "nodemailer";
import ApiError from "./apiError.js";

const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth:{
        user: "taryqu1234@gmail.com",
        pass: process.env.MAILPASS,
    },
})


const SendMail = async (mailInfo = { to: "", subject: "", body: "",})=>{
    if(!to || !subject || !body) {
        throw new Error("required all arguments");
    }
    try {
        const info = await transporter.sendMail({
            from: process.env.MAILUSER,
            to: mailInfo.to,
            subject: mailInfo.subject,
            text: mailInfo.body,
        })
    } catch (error) {
        console.log(error);
        
        throw new ApiError(500, "something went wrong while sending verification link");
    }
}


export default SendMail


// qcnt fezx otoe yayk