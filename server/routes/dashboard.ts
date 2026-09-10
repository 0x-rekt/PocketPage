import express from "express";
import { getDashboard, getIncident } from "../controller/dashboard";

const router = express.Router();

router.get("/dashboard", getDashboard);
router.get("/incidents/:id", getIncident);

export default router;
