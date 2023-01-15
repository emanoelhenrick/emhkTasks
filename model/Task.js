const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
	task: {type: String, required: true},
	done: {type: Boolean, default: false },
	userID: {type: String, required: true},
	taskFrontId: {type: String, required: true}
});

module.exports = mongoose.model("Task", TaskSchema);