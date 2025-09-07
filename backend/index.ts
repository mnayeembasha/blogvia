import express from "express";
import { PORT } from "./config";
import cors from "cors";
import {type Request,type Response} from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db";
import authRoutes from "./routes/auth.routes";
import blogRoutes from "./routes/blog.routes";
import commentRoutes from "./routes/comment.routes";
import userRoutes from "./routes/user.routes";
import path from "path";

const __dirname = path.resolve();
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}));
app.use(express.json({ limit: '7mb' })); // Set to 7MB for base64-encoded images
app.use(express.urlencoded({ extended: true, limit: '7mb' })); // Optional for form data
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/blogs",blogRoutes);
app.use("/api/comments",commentRoutes);

//serve frontend
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get(/.*/,(req:Request,res:Response)=>{
	    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    });
}


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});
