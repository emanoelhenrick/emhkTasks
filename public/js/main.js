const URL_FETCH = "http://localhost:10000"; //"https://emhk-tasks-v2.onrender.com";


const Main = {

	init: async function(){
		await this.downloadTasks();
		this.renderTaskList();
		this.overflowHub();
	},

	bindEvents: function(){
		this.$sendButton.onclick = () => Main.Events.sendButton_newTask();

		this.$deleteBTN.forEach(element => {
			element.onclick = (element) => this.Events.delete_ask(element);
			
		});

		this.$checkButton.forEach(element => {
			element.onclick = element => this.Events.checkButton_verific(element);
		});

		this.$logoutBTN.onclick = this.Events.logout;

		this.$inputTask.onkeypress = (event) => 
		{if(event.key === "Enter"){Main.Events.sendButton_newTask();}};

	},

	cacheSelectors: function(){
		this.$checkButton = document.querySelectorAll(".checkBT");
		this.$hubTasks = document.querySelector(".hub-tasks");
		this.$sendButton = document.getElementById("sendButton");
		this.$inputTask = document.getElementById("inputTask");
		this.$deleteBTN = document.querySelectorAll(".deleteBT");
		this.$logoutBTN = document.querySelector(".logout-btn");
		this.$savingUpdate = document.querySelector(".saving-alert");
	},

	overflowHub: function(){
		const altHub = this.$hubTasks.clientHeight;
		if(altHub === 638){
			this.$hubTasks.style.overflow = "auto";
		}   
	},

	downloadTasks: async function(){

		const options = {
			method: "GET",
			headers: new Headers({"tk_auth": tk_auth}),
		};

		try{
			await fetch(URL_FETCH + "/api/all", options)
				.then(res => res.json())
				.then(json => {
	
					document.querySelector(".usernameBox").innerHTML = json.username;
					localStorage.setItem("task_storage", JSON.stringify(json.taskList));
			
				});
		} catch(error) {
			console.log(error);
		}
	},

	updateTasks: async function(){

		const delTasks = localStorage.getItem("del_tasks");
		const taskList = JSON.parse(localStorage.getItem("task_storage"))
			.filter((element)=> element.mod === true);

		if(taskList.length === 0 && !delTasks){
			return;
		}
		
		const taskUpdate = {taskList: taskList, tk: tk_auth, delTasks: delTasks};

		const options = {
			method: "POST",
			headers: new Headers({"content-type": "application/json"}),
			body: JSON.stringify(taskUpdate)
		};

		this.$savingUpdate.classList.add("load");
	
		try {
			await fetch(URL_FETCH + "/api/update", options);
			localStorage.removeItem("del_tasks");
			this.$savingUpdate.classList.remove("load");
		} catch(error) {
			console.log(error);
		}

	},

	renderTaskList: () => {

		let taskElements = "";

		if(!localStorage.getItem("task_storage")){
			localStorage.setItem("task_storage", JSON.stringify([]));
		}

		const task_storage = JSON.parse(localStorage.getItem("task_storage"));

		task_storage.forEach((task) => {

			let doneClass = "";
			if(task.done === true){
				doneClass = "done";
			} else {
				doneClass = "";
			}

			const taskID = task.taskFrontId;
			let taskElement = `
					<li>
						<button onclick="Main.Events.check_done('${taskID}')" class="checkBT ${doneClass}" value="${taskID}" id="checkBT" data-done="${task.done}"></button>
							<span>${task.task}</span>
						<button name="deleteBT" class="deleteBT" value="${taskID}"></button>
					</li>
						`;
		
			taskElements += taskElement;
		});

		document.getElementById("list").innerHTML = taskElements;

		Main.cacheSelectors();
		Main.bindEvents();
		Main.updateTasks();
	},

	Events: {
		checkButton_verific: async function(element){

			const task_storage = JSON.parse(localStorage.getItem("task_storage"));

			const taskID = {taskID: element.target.value};
			const doneValue = element.target.dataset.done;

			if(!element.target.classList.contains("done")){
				element.target.classList.add("done");
			} else {
				element.target.classList.remove("done");
			}

			if(doneValue === "false"){
				element.target.dataset.done = "true";

				for (let task of task_storage){
					if(task.taskFrontId === taskID.taskID){
						task.done = true;
						task.mod = true;
					}
				}
				
			} else {
				element.target.dataset.done = "false";
				
				for (let task of task_storage){
					if(task.taskFrontId === taskID.taskID){
						task.done = false;
						task.mod = true;
					}
				}
			}

			localStorage.setItem("task_storage", JSON.stringify(task_storage));

			Main.updateTasks();

		},

		sendButton_newTask: async () => {

			if(!Main.$inputTask.value){
				return;
			}

			const task_storage = JSON.parse(localStorage.getItem("task_storage"));
			task_storage.push({task: Main.$inputTask.value, done: false, taskFrontId: generateID(), mod: true});
			localStorage.setItem("task_storage", JSON.stringify(task_storage));

			Main.renderTaskList();
			
			document.getElementById("inputTask").value = "";
			
		},

		delete_ask: async function(element){

			if(!localStorage.getItem("del_tasks")){
				localStorage.setItem("del_tasks", JSON.stringify([]));
			}

			const taskID = {taskID: element.target.value};

			let delTasks = JSON.parse(localStorage.getItem("del_tasks"));
			delTasks.push(taskID);
			localStorage.setItem("del_tasks", JSON.stringify(delTasks));

			const task_storage = JSON.parse(localStorage.getItem("task_storage"));

			const tasksUp = task_storage.filter(task => {
				if(task.taskFrontId !== taskID.taskID){
					return task;
				}
			});
			localStorage.setItem("task_storage", JSON.stringify(tasksUp));
			Main.renderTaskList();
		},

		logout: function(){
			localStorage.removeItem("tk_auth");
			localStorage.removeItem("task_storage");
			window.location.assign("/login");
		}
	}
};

const tk_auth = localStorage.getItem("tk_auth");

if(!tk_auth){
	window.location.assign("/login");
} else {
	Main.init();
}

function generateID() {
	let array = new Uint32Array(4);
	window.crypto.getRandomValues(array);
	let str = "";
	for (let i = 0; i < array.length; i++) {
		str += array[i].toString(16);
	}
	return str;
}