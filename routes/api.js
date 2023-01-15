const express = require("express");
const router = express.Router();
const tf = require("../controller/tasks");

router.get("/all", tf.allTasks);

router.post("/update", express.json(), tf.updateTasks);

module.exports = router;