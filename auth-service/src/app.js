import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());


// routes
app.use("/api/auth", authRoutes);

app.get("/test", (req, res) => {
    res.send("Hello World");
});

// 404 error
app.use("*", (req, res) => {
    res.status(404).json({
      success: false,
      message: "API route not found",
    });
  });

  // error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  });
  
  

export default app;








