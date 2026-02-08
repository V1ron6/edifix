import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Database
import { connectDB } from "./Config/database.js";

// Import all models to set up associations
import "./Model/index.js";

// Routes
import {
  authRoutes,
  courseRoutes,
  lessonRoutes,
  progressRoutes,
  streakRoutes,
  examRoutes,
  notificationRoutes,
  reminderRoutes,
  playgroundRoutes,
  dashboardRoutes
} from "./Route/index.js";

// Middleware
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// Cron jobs
import { startCronJobs } from "./Config/cron.js";

const port = process.env.PORT || 4000;
const app = express();
const serverStartTime = Date.now();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}



// Health check page
app.get("/", (req, res) => {
 res.sendFile(path.join(__dirname,"edifix.html"));
});

// Health API endpoint
import sequelize from "./Config/database.js";
app.get("/api/health", async (req, res) => {
  let dbStatus = "DISCONNECTED";
  try {
    await sequelize.authenticate();
    dbStatus = "CONNECTED";
  } catch (e) {
    dbStatus = "ERROR";
  }
  
  const uptimeMs = Date.now() - serverStartTime;
  const seconds = Math.floor(uptimeMs / 1000) % 60;
  const minutes = Math.floor(uptimeMs / 60000) % 60;
  const hours = Math.floor(uptimeMs / 3600000) % 24;
  const days = Math.floor(uptimeMs / 86400000);
  
  res.json({
    server: "ACTIVE",
    secure: process.env.NODE_ENV === "production" ? "HTTPS" : "HTTP",
    database: dbStatus,
    uptime: (days > 0 ? days + "d " : "") + (hours > 0 ? hours + "h " : "") + (minutes > 0 ? minutes + "m " : "") + seconds + "s",
    port: port,
    mode: process.env.NODE_ENV || "development"
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/playground", playgroundRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start cron jobs
    startCronJobs();

    app.listen(port, () => {
      console.log(`

 --------EDIFIX API SERVER------------                                 

║  Status:  Running                                               
║  Port:   ${port}                                                
║  Mode: ${process.env.NODE_ENV || 'development'}       
║  Database: MySQL                                                

      `);
    });
  } catch (error) {
    console.error("[ERROR] Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
