import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

// Import routes
import apiRoutes from "./routes/api";

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "5000", 10);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRoutes);

// Default route
app.get("/", (req: Request, res: Response) => {
	res.send("Globetrotter API is running");
});

// Start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
