import express from "express";
import { signup, login, logout, onboard } from "../controllers/authControllers.js";
import { protectedRoute } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/onboarding",protectedRoute,onboard);

router.get("/me", protectedRoute, (req, res) => {
  res.status(200).json({ message: "You have accessed a protected route", user: req.user });
});

export default router;
