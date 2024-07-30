import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { router } from "./router";
export const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://bridge-murex-psi.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api", router);

app.listen(process.env.PORT || 9000, () => {
  console.log(`listening to port ${process.env.PORT}`);
});
