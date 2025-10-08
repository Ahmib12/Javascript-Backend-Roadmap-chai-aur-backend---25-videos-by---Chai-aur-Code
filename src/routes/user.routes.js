import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
 

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name : "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
// router.route("/login").post(loginUser); // we dont hv it fo rnow,its just for leaning purpose we saw it

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)

// refresh access token route
router.route("/refresh-token").post(refreshAccessToken)

export default router; 