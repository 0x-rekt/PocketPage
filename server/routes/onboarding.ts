import express from "express";
import { completeOnboarding } from "../controller/onboarding";

const router = express.Router();

router.post("/complete", completeOnboarding);

export default router;
