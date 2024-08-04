import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, verifyUser } from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router()




router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/verify/:userId/:verificationString").get(verifyUser)




router.route("/logout").post(verifyJwt, logoutUser)

export default router;