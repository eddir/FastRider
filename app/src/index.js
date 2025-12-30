import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/users", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
