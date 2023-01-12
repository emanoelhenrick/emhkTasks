const express = require("express");
const router = express.Router();
const tf = require("../controller/tasks");


router.get("/all", tf.allTasks);

router.post("/new", express.json(), tf.saveTask);

router.post("/delete", express.json(), tf.deleteTask);

router.post("/done", express.json(), tf.doneTask);


module.exports = router;