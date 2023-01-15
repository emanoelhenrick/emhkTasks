require("dotenv").config();
const Task = require("../model/Task");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const taskController = {

	async updateTasks(req, res){

		const taskListUpdate = req.body.taskList;
		const tk_user = req.body.tk;

		const token = jwt.verify(tk_user, process.env.TK_SEC);
		const userID = token._id;

		const tasksListMongo = await Task.find({ userID: userID });

		const tasksToSave = taskListUpdate.filter(tasksUP => {
			const match = tasksListMongo.find(taskMongo => taskMongo.taskFrontId === tasksUP.taskFrontId);
			return !match;
		});

		if(tasksToSave){
			taskController.saveTask(tasksToSave, userID);
		}

		if(req.body.delTasks){
			taskController.deleteTask(req.body.delTasks, userID);
		}

		if(tasksListMongo.length !== 0){
			taskController.doneTask(taskListUpdate);
		}

		res.end();

	},

	async allTasks(req, res){

		const tk_user = req.header("tk_auth");
		const token = jwt.verify(tk_user, process.env.TK_SEC);
		const userID = token._id;

		const taskList = await Task.find({ userID: userID });
		const user = await User.findOne({_id: userID});

		const taskRes = {
			taskList: taskList,
			username: user.username,
			id: userID
		};

		res.json(taskRes);
	},

	async saveTask(tasksToSave, userID){

		for (let task of tasksToSave){
			const doc = new Task({
				task: task.task,
				done: task.done,
				userID: userID,
				taskFrontId: task.taskFrontId
			});
	
			await doc.save().then().catch(err => console.log(err));
		}

	},

	async deleteTask(delTasks, userID){

		const tasks = JSON.parse(delTasks);
		for (const task of tasks){
			await Task.findOneAndDelete({taskFrontId: task.taskID, userID: userID});
		}

	},

	async doneTask(taskList){

		for (const task of taskList){
			await Task.findOne({taskFrontId: task.taskFrontId})
				.then(async taskFind => {
					await Task.findByIdAndUpdate(taskFind._id, task);
				});
		}
	},
};

module.exports = taskController;
