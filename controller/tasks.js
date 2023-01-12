require('dotenv').config()
const Task = require("../model/Task");
const User = require('../model/User')
const jwt = require('jsonwebtoken')

const taskController = {

	async allTasks(req, res){

		const tk_user = req.header('tk_auth')
		const token = jwt.verify(tk_user, process.env.TK_SEC)
		const userID = token._id

		const taskList = await Task.find({ userID: userID });
		const user = await User.findOne({_id: userID})

		const taskRes = {
			taskList: taskList,
			username: user.username
		}

		res.json(taskRes);
	},

	saveTask(req, res){
		const { task, tk } = req.body;

		const token = jwt.verify(tk, process.env.TK_SEC)
		const userID = token._id

		const doc = new Task({
			task: task,
			done: false,
			userID: userID
		});
		doc.save().then().catch(err => console.log(err));
		res.end();
	},

	async deleteTask(req, res){
		const { taskID } = req.body;
		await Task.findByIdAndDelete(taskID);
		res.end();
	},

	async doneTask(req, res){
		const { taskID } = req.body;
		let upTask = {};

		const task = await Task.findOne({_id: taskID});

		if(!task.done){
			upTask.done = true;
		} else {
			upTask.done = false;
		}

		try{
			await Task.findByIdAndUpdate(taskID, upTask);
		} catch(error) {
			console.log(error);
		}
		res.end();
	},
};

module.exports = taskController;
