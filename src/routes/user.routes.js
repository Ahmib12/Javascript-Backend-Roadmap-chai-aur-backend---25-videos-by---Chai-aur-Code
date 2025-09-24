import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser)
// router.route("/login").post(loginUser); // we dont hv it fo rnow,its just for leaning purpose we saw it

export default router; 