import express from "express";
import { syncUser } from "../controller/webhooks";

const router = express.Router();

router.post("/clerk", syncUser);

export default router;
