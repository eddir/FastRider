import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import authRouter from "./routes/auth.js";
import parkRouter from "./routes/park.js";
import * as path from "node:path";

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/park", parkRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
