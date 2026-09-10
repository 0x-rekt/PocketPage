import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import webhooks from "./routes/webhooks";
import onboarding from "./routes/onboarding";
import dashboard from "./routes/dashboard";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(clerkMiddleware());
app.use(cors({ origin: ["*"] }));

app.use("/api/webhooks", express.raw({ type: "application/json" }), webhooks);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/onboarding", onboarding);
app.use("/api/me", dashboard);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});
