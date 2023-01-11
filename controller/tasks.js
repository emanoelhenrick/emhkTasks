const Task = require("../model/Task");

const taskController = {

	async allTasks(req, res){
		const taskList = await Task.find();
		res.json(taskList);
	},

	saveTask(req, res){

		const { task } = req.body;
		const doc = new Task({
			task: task,
			done: false
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
