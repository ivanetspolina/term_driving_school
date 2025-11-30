const express = require("express");
const router = express.Router();
const AnalyticsController = require("../controllers/AnalyticsController");

router.get("/test", AnalyticsController.getTestAnalytics);

module.exports = router;