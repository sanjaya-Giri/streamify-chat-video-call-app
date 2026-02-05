import express from "express";
import { protectedRoute } from "../middlewares/AuthMiddleware.js";
import { getStreamToken } from "../controllers/chatController.js";


const router = express.Router();

router.get("/token",protectedRoute,getStreamToken);
export default router;