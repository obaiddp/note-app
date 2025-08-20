// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";

// import userRoutes from "./routes/userRoutes.js";
// import noteRoutes from "./routes/noteRoutes.js";

// dotenv.config();
// const app = express();

// app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/users", userRoutes);
// app.use("/api/notes", noteRoutes);

// export default app;
// =============================================
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";


const app = express();


// Trust proxy so secure cookies work behind Railway/Vercel proxies
app.set("trust proxy", 1);


app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser());


const allowedOrigin = process.env.FRONTEND_URL; // e.g. http://localhost:5173 or https://your-dashboard.vercel.app
app.use(
cors({
origin: allowedOrigin,
credentials: true,
methods: ["GET","POST","PUT","DELETE","OPTIONS"],
allowedHeaders: ["Content-Type","Authorization"],
})
);


app.get("/healthz", (req, res) => res.status(200).send("ok"));


export default app;