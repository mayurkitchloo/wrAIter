require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoute");
const bookRoutes = require("./routes/bookRoute");
const aiRoutes = require("./routes/aiRoute");
const exportRoutes = require("./routes/exportRoute");
const otpRoutes = require("./routes/otpRoute");

const app = express();

//Middleware to handle CORS
app.use(
    cors(
        {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"]
        }
    )
);

//middleware
app.use(express.json());

//connect database
connectDB();

//static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//routes here
app.use("/api/auth", authRoutes);
app.use("/api/auth", otpRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/export", exportRoutes);

app.get("/test", (req, res) => {
    res.send("Server is working");
});

//start server
console.log("PORT from env:", process.env.PORT);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));