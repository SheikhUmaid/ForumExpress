import { response, Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import { AddApproval, CreateResponse, DeleteResponse, UpdateResponse } from "../controllers/response.controller.js";


const router = Router();










//secured routes below this route
router.use(verifyJwt);
router.route("/create-response/:queryId").post(CreateResponse)
router.route("/delete-response/:responsetodelete").delete(DeleteResponse)
router.route("/update-response/responseid").put(UpdateResponse)
router.route("/approve-response/responseid").put(AddApproval)
export default router