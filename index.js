// app.js or server.js

import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/userRoutes.js";
import shopRoutes from "./routes/shopRouter.js";
import productRouter from "./routes/productRouter.js"
import contactRoutes from "./routes/contactRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import { connectDatabase } from "./db/db.js";

dotenv.config();

const app = express();

const allowedOrigins = [process.env.NEXT_PUBLIC_API_URL_CLIENT].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: false },
  })
);

app.options("*", cors());
app.use(express.json());

connectDatabase();

app.use("/api/product", productRouter);
app.use("/api", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth/shop", shopRoutes);
app.use("/api/otp", otpRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
