const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const leadRoutes = require("./routes/lead.routes");
const dashboardRoutes = require("./routes/dashboard");
const activityRoutes = require("./routes/activity.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/health", healthRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/test",testRoutes);
app.use("/api/leads",leadRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/activity",activityRoutes);

module.exports = app;