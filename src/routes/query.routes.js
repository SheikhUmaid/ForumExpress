import { Router } from "express"
import verifyJwt from "../middlewares/auth.middleware.js"
import { CreateQuery, UpdateQuery, DeleteQuery, GetOneQuery, GetAllQueries, GetQueriesOfUser, SearchQueries } from "../controllers/query.controller.js"
// import router from "./user.routes"
const router = Router()
                                                            //testing
router.route("/create-query").post(verifyJwt, CreateQuery ) //done
router.route("/update-query/:queryId").put(verifyJwt,UpdateQuery) //done
router.route("/delete-query/:queryId").delete(verifyJwt,DeleteQuery) //done
router.route("/get-query/:queryId").get(GetOneQuery) //done
router.route("/get-all-queries").get(GetAllQueries) //done
router.route("/get-queries/:userId").get(GetQueriesOfUser) //done
router.route("/search").get(SearchQueries) //done




export default router