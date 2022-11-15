import { Router }       from "express";

/* Controllers */
import UserController   from "../controllers/users.controller";
import WallController from "../controllers/walls.controller";

const UserRoutes = Router();

/* User Routes */
UserRoutes.get("/", UserController.homepage);
UserRoutes.post("/register", UserController.register);
UserRoutes.post("/login", UserController.login);
UserRoutes.post("/logout", UserController.logout);


/* Wall Routes */
UserRoutes.get("/wall", WallController.wallpage);
UserRoutes.post("/create_message", WallController.createMessage)
UserRoutes.post("/create_comment", WallController.createComment)
UserRoutes.post("/delete_post", WallController.deletePost)


module.exports = UserRoutes;